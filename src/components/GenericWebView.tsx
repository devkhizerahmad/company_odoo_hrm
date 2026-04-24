import React from "react";
import { View, StyleSheet, ScrollView, RefreshControl, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as Network from "expo-network";
import { Colors } from "../theme/colors";
import { NetworkBar } from "./NetworkBar";
import { SkeletonLoader } from "./SkeletonLoader";
import { WebViewStatusCard } from "./WebViewStatusCard";
import { HIDE_HEADER_JS, PROFILE_DETECTION_JS } from "../utils/webViewScripts";
import { authSession } from "../services/authSession";
import { appError, appLog, appWarn } from "../utils/logger";

const WEBVIEW_INJECTED_JS = `
  ${HIDE_HEADER_JS}
  ${PROFILE_DETECTION_JS}
`;

const CLEAR_WEBVIEW_STORAGE_JS = `
  (function() {
    try {
      if (window.localStorage) {
        window.localStorage.clear();
      }

      if (window.sessionStorage) {
        window.sessionStorage.clear();
      }

      if (window.caches && window.caches.keys) {
        window.caches.keys().then(function(names) {
          names.forEach(function(name) {
            window.caches.delete(name);
          });
        });
      }

      if (window.indexedDB && window.indexedDB.databases) {
        window.indexedDB.databases().then(function(databases) {
          databases.forEach(function(database) {
            if (database && database.name) {
              window.indexedDB.deleteDatabase(database.name);
            }
          });
        });
      }
    } catch (error) {
      console.log("[HRM App] Failed to clear browser storage", error);
    }
  })();
  true;
`;

const isLogoutUrl = (url: string) =>
  url.includes("/web/session/logout") ||
  url.includes("/web/logout") ||
  url.includes("action=logout");

const isLoginUrl = (url: string) => url.includes("/web/login");

interface GenericWebViewProps {
  url: string;
}

export const GenericWebViewScreen = ({ url, onUserIdDetected }: { url: string, onUserIdDetected?: (id: number) => void }) => {
  const navigation = useNavigation<any>();
  const webViewRef = React.useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("We couldn't load this page. Please try again.");
  const [isAuthRedirectInProgress, setIsAuthRedirectInProgress] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);

  const updateNetworkStatus = React.useCallback((networkState: Network.NetworkState) => {
    const connected = Boolean(networkState.isConnected && networkState.isInternetReachable !== false);
    setIsOffline(!connected);
    appLog("Network state updated", {
      isConnected: networkState.isConnected,
      isInternetReachable: networkState.isInternetReachable,
      type: networkState.type,
    });
  }, []);

  const cleanupAndRedirectToLogin = React.useCallback(async (reason: string, targetUrl: string) => {
    if (isAuthRedirectInProgress) {
      return;
    }

    setIsAuthRedirectInProgress(true);
    appLog("Starting logout/session cleanup", { reason, targetUrl });

    try {
      webViewRef.current?.injectJavaScript(CLEAR_WEBVIEW_STORAGE_JS);
      webViewRef.current?.stopLoading();
      webViewRef.current?.clearFormData?.();
      webViewRef.current?.clearHistory?.();
      webViewRef.current?.clearCache?.(true);
      appLog("Current WebView cache/history cleanup triggered");
    } catch (error) {
      appError("Failed while clearing current WebView state", error);
    }

    await authSession.clear();

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }, [isAuthRedirectInProgress, navigation]);

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      appLog("Generic WebView message received", data);
      if (data.type === 'SESSION_INFO' && data.userId) {
        await authSession.save({
          uid: data.userId,
          loginDetectedAt: new Date().toISOString(),
          source: "webview",
        });
        onUserIdDetected?.(data.userId);
      }
    } catch (error) {
      appError("Failed to parse Generic WebView message", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    appLog("Manual refresh requested", { url });
    setRefreshing(true);
    setHasError(false);
    setErrorMessage("We couldn't load this page. Please try again.");

    Network.getNetworkStateAsync()
      .then((networkState) => {
        updateNetworkStatus(networkState);

        if (networkState.isConnected && networkState.isInternetReachable !== false) {
          webViewRef.current?.reload();
        } else {
          appWarn("Refresh skipped because device is offline");
          setHasError(true);
          setRefreshing(false);
          setIsLoading(false);
          setErrorMessage("You're offline. Check your connection and try again.");
        }
      })
      .catch((error) => {
        appError("Failed to fetch network state during refresh", error);
        webViewRef.current?.reload();
      });

    setTimeout(() => setRefreshing(false), 1500);
  }, [updateNetworkStatus, url]);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        appWarn("Location permission denied");
      }
    })();
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    Network.getNetworkStateAsync()
      .then((networkState) => {
        if (!isMounted) {
          return;
        }

        updateNetworkStatus(networkState);
      })
      .catch((error) => {
        appError("Failed to fetch initial network state", error);
      });

    const subscription = Network.addNetworkStateListener((networkState) => {
      if (!isMounted) {
        return;
      }

      updateNetworkStatus(networkState);

      const connected = Boolean(networkState.isConnected && networkState.isInternetReachable !== false);
      if (connected && hasError) {
        appLog("Network restored while page was in error state");
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [hasError, updateNetworkStatus]);

  const handleNavigationStateChange = React.useCallback(async (navState: any) => {
    setCanGoBack(navState.canGoBack);
    appLog("Generic WebView URL changed", navState.url);

    if (isAuthRedirectInProgress) {
      return;
    }

    if (isLogoutUrl(navState.url)) {
      appLog("Odoo logout detected from top bar/profile menu", navState.url);
      await cleanupAndRedirectToLogin("logout", navState.url);
      return;
    }

    if (isLoginUrl(navState.url)) {
      appWarn("WebView reached login page, clearing app session marker");
      await cleanupAndRedirectToLogin("session_expired", navState.url);
    }
  }, [cleanupAndRedirectToLogin, isAuthRedirectInProgress]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [canGoBack])
  );

  return (
    <View style={styles.webViewContainer}>
      <NetworkBar
        visible={isOffline || hasError}
        message={
          isOffline
            ? "You're offline. Reconnect to continue."
            : "We ran into a problem loading this page."
        }
      />
      
      {progress < 1 && (
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      )}

      {isLoading && <SkeletonLoader />}
      {!isLoading && isOffline && (
        <WebViewStatusCard
          title="No Internet Connection"
          message="Please check your Wi-Fi or mobile data connection and try again."
          buttonLabel="Try Again"
          iconName="wifi-strength-alert-outline"
          onPress={onRefresh}
        />
      )}
      {!isLoading && !isOffline && hasError && (
        <WebViewStatusCard
          title="Unable to Load Page"
          message={errorMessage}
          buttonLabel="Reload Page"
          iconName="cloud-alert-outline"
          onPress={onRefresh}
        />
      )}
      
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={[styles.webView, (isLoading || isOffline || hasError) && { height: 0, opacity: 0 }]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
          injectedJavaScript={WEBVIEW_INJECTED_JS}
          onMessage={handleMessage}
          onLoadStart={() => {
            appLog("Generic WebView load started", url);
            setHasError(false);
            setErrorMessage("We couldn't load this page. Please try again.");
            setIsAuthRedirectInProgress(false);
            setProgress(0.05);
          }}
          onError={(syntheticEvent) => {
            const description =
              syntheticEvent.nativeEvent.description ||
              "We couldn't load this page. Please try again.";
            setHasError(true);
            setIsLoading(false);
            setErrorMessage(description);
            appError("Generic WebView load error", syntheticEvent.nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const statusCode = syntheticEvent.nativeEvent.statusCode;
            setHasError(true);
            setIsLoading(false);
            setErrorMessage(`The server returned an error (${statusCode}). Please try again in a moment.`);
            appWarn("Generic WebView HTTP error", syntheticEvent.nativeEvent);
          }}
          onLoadProgress={({ nativeEvent }) => {
            setProgress(nativeEvent.progress);
            if (nativeEvent.progress > 0.7) {
              setIsLoading(false);
            }
          }}
          onLoadEnd={() => {
            appLog("Generic WebView load ended", url);
            setProgress(1);
            setIsLoading(false);
            setRefreshing(false);
          }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    paddingBottom: 85,
    backgroundColor: "#fff",
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.primary,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    borderRadius: 3,
  },
  webView: {
    flex: 1,
  },
});
