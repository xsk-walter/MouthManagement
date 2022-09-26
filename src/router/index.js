import Vue from "vue";
import VueRouter from "vue-router";
import MouthList from "../views/MouthList.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/box/mouthlist",
  },
  {
    path: "/box/mouthlist",
    name: "MouthList",
    component: MouthList
  }
]
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
