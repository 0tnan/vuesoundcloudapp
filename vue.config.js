const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "src/config/index.scss";`,
      },
    },
  },
  configureWebpack: {
    devServer: {
      client: {
        overlay: false,
      },
    },
  },
});
