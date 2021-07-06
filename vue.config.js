module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    apollo: {
      lintGQL: true
    }
  },
  devServer: {
    port: 8080,
    host: "0.0.0.0",
    disableHostCheck: true
  }
};
