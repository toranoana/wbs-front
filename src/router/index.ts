import Vue from "vue";
import VueRouter from "vue-router";
import Wbs from "../views/Wbs.vue";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/wbs/:id",
    name: "Wbs",
    component: Wbs
  },
  {
    path: "/",
    name: "Home",
    component: Home
  }
];

const router = new VueRouter({
  routes
});

export default router;
