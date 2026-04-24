import React, { useRef } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { LOGIN_CSS_INJECTION, PROFILE_DETECTION_JS } from "../utils/webViewScripts";
import { authSession } from "../services/authSession";
import { ODOO_ROUTES } from "../constants/odoo";
import { appError, appLog } from "../utils/logger";

const LOGIN_WEBVIEW_INJECTION = `
  ${LOGIN_CSS_INJECTION}
  ${PROFILE_DETECTION_JS}
`;

const WebViewLoginScreen = () => {
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      appLog("Login WebView message received", data);

      if (data.type === "SESSION_INFO" && data.userId) {
        await authSession.save({
          uid: data.userId,
          loginDetectedAt: new Date().toISOString(),
          source: "webview",
        });
      }
    } catch (error) {
      appError("Failed to parse Login WebView message", error);
    }
  };

  const handleNavigationStateChange = async (navState: any) => {
    appLog("Login WebView URL changed", navState.url);

    if (
      navState.url.includes("/odoo/discuss") ||
      navState.url.includes("/web#") ||
      navState.url.includes("/odoo/attendance")
    ) {
      await authSession.save({
        loginDetectedAt: new Date().toISOString(),
        source: "webview",
      });
      appLog("Login success detected, navigating to MainTabs");
      navigation.replace("MainTabs");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.webViewWrapper}>
        <WebView
          ref={webViewRef}
          source={{ uri: ODOO_ROUTES.login }}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          injectedJavaScript={LOGIN_WEBVIEW_INJECTION}
          scalesPageToFit={true}
          style={styles.webView}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  webViewWrapper: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
});

export default WebViewLoginScreen;
