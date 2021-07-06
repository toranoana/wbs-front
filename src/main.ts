import Vue from "vue";
import VueCompositionApi, { provide } from "@vue/composition-api";
Vue.use(VueCompositionApi);

import vuetify from "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
Vue.config.productionTip = false;
import "reset-css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";
// @ts-ignore
import { createProvider } from "./vue-apollo.js";
import { DefaultApolloClient } from "@vue/apollo-composable";

const apolloProvider = createProvider();

// @ts-ignore
new Vue({
  router: router,
  render: h => h(App),
  vuetify,

  // @ts-ignore
  setup: function() {
    provide(DefaultApolloClient, apolloProvider.defaultClient);
  }
}).$mount("#app");
