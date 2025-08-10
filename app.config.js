export default {
  expo: {
    name: "Local Treasure Hunts",
    slug: "local-treasure-hunts",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "treasurehunts",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#6366f1"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.localtreasure.app",
      deploymentTarget: "15.1"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6366f1"
      },
      package: "com.localtreasure.app"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    plugins: [
      "expo-barcode-scanner",
      "expo-camera",
      "expo-location"
    ],
    extra: {
      apiBaseUrl: "https://backend-6ez5urww8-johns-projects-719b2fcb.vercel.app/api"
    }
  }
};
