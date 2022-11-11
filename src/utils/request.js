import axios from "axios";
import { getCabinetInvokeInfo } from "../common/js/api";
import { Message } from "element-ui";
import { setToken, getToken } from "@/utils/auth";
import router from "../router/index";
// 创建axios实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: "10000",
});
const pendingMap = new Map();

// 被挂起的请求数组
let refreshSubscribers = [];

// push所有请求到数组中
function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

// 刷新请求
function onRrefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
}
// 白名单
const whiteLists = ["/cabinet/getCabinetInvokeInfo.htm"];

const errorHandle = (status, response) => {
  if (status === 401) {
    router.replace({
      path: "/404",
    });
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
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    removePending(config);
    addPending(config);
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

    if (process.env.NODE_ENV === "development") {
      config.headers["Authorization"] =
        "Bearer " +
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJ3ZWIiLCJpc3MiOiJzbWFydC1jYWJpbmV0IiwiZXhwIjoxNjY4MDYzODU5LCJ1c2VySWQiOiJjMmQwM2Q2NjJmYzY5NDlhYzIyZDA2NTIwOTAxMWI1ZCIsImlhdCI6MTY2ODA2MDI1OSwianRpIjoiYjEwZWQ4ZTcyYjczNDRhOWIzNDE1NjNiYzBiNGMyNTIifQ.dDC2Idr-2-3B7p534h3TaUQ-OrHo9YDpog9m4qIVRaM"
      return config;
    }
    if (localStorage.getItem("box_host") && getToken("Admin-Token")) {
      // 有无本地存储
      config.baseURL = localStorage.getItem("box_host");
      config.headers["Authorization"] = "Bearer " + getToken("Admin-Token");
      return config;
    } else if (whiteLists.indexOf(config.url) === -1) {
      // 非白名单
      getCabinetInvokeInfo().then((res) => {
        setToken("Admin-Token", res.data.token);
        localStorage.setItem("box_host", res.data.host);
        onRrefreshed(res.data.token);
        /* 执行onRefreshed函数后清空数组中保存的请求 */
        refreshSubscribers = [];
      });

      /* 把请求缓存到一个数组中 */
      let retry = new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          config.baseURL = localStorage.getItem("box_host");
          config.headers["Authorization"] = "Bearer " + token;
          /* 将请求挂起 */
          resolve(config);
        });
      });

      return retry;
    } else {
      return config;
    }
  },
  (error) => Promise.error(error)
);

instance.interceptors.response.use(
  // 请求成功
  (res) => {
    if (res.data.code === 5000) {
      res.data && errorHandle(res.data.code, res);
      return;
    }
    if (res.status === 200) {
      return Promise.resolve(res.data);
    } else if (res.status === 211) {
      return Promise.resolve(res.data);
    } else {
      return Promise.reject(res.data);
    }
  },
  (error) => {
    let { response } = error;
    if (response) {
      response.status && errorHandle(response.status, response);
    }
  }
);

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 * @param {*} config
 */
function addPending(config) {
  const pendingKey = getPendingKey(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel);
      }
    });
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending(config) {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey);
    cancelToken(pendingKey);
    pendingMap.delete(pendingKey);
  }
}

/**
 * 生成唯一的每个请求的唯一key
 * @param {*} config
 * @returns
 */
function getPendingKey(config) {
  let { url, method, params, data } = config;
  if (typeof data === "string") data = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join("&");
}

export default instance;
