import Vue from "vue";
import VueRouter from "vue-router";
import MouthList from "../views/MouthList.vue";
import Error from "../views/404.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/mouthlist",
  },
  // {
  //   path: "/",
  //   name: "Error",
  //   redirect: "/404",
  // },
  {
    path: "/mouthlist",
    name: "MouthList",
    component: MouthList,
  },
  {
    path: "/404",
    name: "Error",
    component: Error,
  },
];
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL + "/box/",
  routes,
});

export default router;
