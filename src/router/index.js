import Vue from "vue";
import VueRouter from "vue-router";
import MouthList from "../views/MouthList.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/mouthlist",
  },
  {
    path: "/mouthlist",
    name: "MouthList",
    component: MouthList,
  },
];
const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL + "/box/",
  routes,
});

export default router;
