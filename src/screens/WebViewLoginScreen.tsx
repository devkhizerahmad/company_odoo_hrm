import React, { useRef } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { LOGIN_CSS_INJECTION } from "../utils/webViewScripts";

const WebViewLoginScreen = () => {
  const navigation = useNavigation<any>();
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: any) => {
    console.log("Current URL:", navState.url);

    // Odoo successful login URL: contains "/odoo/discuss"
    if (navState.url.includes("/odoo/discuss") || navState.url.includes("/web#") || navState.url.includes("/odoo/attendance")) {
      console.log("Login Success! Navigating to Main Interface...");
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
          source={{ uri: "https://attendance.bytescripterz.com/web/login" }}
          onNavigationStateChange={handleNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          injectedJavaScript={LOGIN_CSS_INJECTION}
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
