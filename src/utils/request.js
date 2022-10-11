/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from "axios";
import { Message } from "element-ui";
// import router from "@/router";
import { getToken } from "@/utils/auth";

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, response) => {
  // 状态码判断
  if (status == 401) {
    // 401: token失效，跳转登录页
    // store.dispatch('LogOut').then(() => {
    // location.href = '/#/home?hasInit=true'
    // router.replace({
    //   path: "/home",
    //   query: {
    //     hasInit: true,
    //   },
    // });
    window.location.href = "/index.htm";
    // })
    return Promise.reject(response);
  } else {
    Message({
      message: response.data.message || "出现错误，请稍后再试",
      type: "warning",
      duration: 5 * 1000,
    });
    return Promise.reject(response);
  }
};
// 创建axios实例
const instance = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_URL,
  // 超时
  timeout: "10000",
  // 10000
});
/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  async (config) => {
    if (config.method == "post") {
      config.data = {
        ...config.data,
      };
    } else if (config.method == "get") {
      config.params = {
        ...config.params,
      };
    }
    config.headers["Content-Type"] = config.headers["Content-Type"]
      ? config.headers["Content-Type"]
      : "application/json;charset=UTF-8";

    config.headers["Authorization"] = "Bearer " + getToken();

    return config;
  },
  (error) => Promise.error(error)
);

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  (res) => {
    if (res.status === 200) {
      if (res.data.code != 200) {
        Message({
          message: res.data.message,
          type: "warning",
          duration: 5 * 1000,
        });
      }
      return Promise.resolve(res.data);
    } else if (res.status === 211) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res.data);
    }
  },
  // 请求失败
  (error) => {
    let { response, message } = error;
    if (response) {
      errorHandle(response.status, response);
    } else {
      if (!window.navigator.onLine) {
        console.log(123);
      } else {
        if (message == "Network Error") {
          message = "服务器连接异常，请联系管理员";
        } else if (message.includes("timeout")) {
          message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
          message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        Message({
          message: message,
          type: "warning",
          duration: 5 * 1000,
        });
        return Promise.reject(error);
      }
    }
  }
);

export default instance;
