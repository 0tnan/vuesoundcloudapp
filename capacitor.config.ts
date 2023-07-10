import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.omniwave.app",
  appName: "OmniWave",
  webDir: "dist",
  server: {
    androidScheme: "https",
    hostname: "com.app.omniwave",
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
