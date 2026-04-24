import React from "react";
import { View, StyleSheet, ScrollView, RefreshControl, BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { Colors } from "../theme/colors";
import { NetworkBar } from "./NetworkBar";
import { SkeletonLoader } from "./SkeletonLoader";
import { PROFILE_DETECTION_JS, HIDE_HEADER_JS } from "../utils/webViewScripts";

const COMBINED_INJECTION = `
  ${HIDE_HEADER_JS}
  ${PROFILE_DETECTION_JS}
`;

interface GenericWebViewProps {
  url: string;
}

export const GenericWebViewScreen = ({ url, onUserIdDetected }: { url: string, onUserIdDetected?: (id: number) => void }) => {
  const webViewRef = React.useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SESSION_INFO' && data.userId) {
        onUserIdDetected?.(data.userId);
      }
    } catch (e) {
      // Silently fail
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setHasError(false);
    webViewRef.current?.reload();
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    })();
  }, []);

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
      <NetworkBar visible={hasError} />
      
      {progress < 1 && (
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      )}

      {isLoading && <SkeletonLoader />}
      
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
          style={[styles.webView, isLoading && { height: 0, opacity: 0 }]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          geolocationEnabled={true}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
          injectedJavaScript={COMBINED_INJECTION}
          onMessage={handleMessage}
          onLoadStart={() => setHasError(false)}
          onError={() => setHasError(true)}
          onLoadProgress={({ nativeEvent }) => {
            setProgress(nativeEvent.progress);
            if (nativeEvent.progress > 0.7) {
              setIsLoading(false);
            }
          }}
          onLoadEnd={() => {
            setProgress(1);
            setIsLoading(false);
            setRefreshing(false);
          }}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
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
