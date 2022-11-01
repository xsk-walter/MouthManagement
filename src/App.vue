<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="loaded" />
    </keep-alive>
  </div>
</template>

<script>
import { getCabinetInvokeInfo, boxCheck_getGuid } from "./common/js/api";
import { setToken, removeToken } from "@/utils/auth";
export default {
  data() {
    return {
      loaded: true,
      random: "",
      Socket: "",
      socket: "",
      msgSuccess: null,
      msgError: null,
      msgInfo: null,
      noticeResult: null,
    };
  },
  provide() {
    return {
      noticeFromApp: () => ({
        noticeResult: this.noticeResult,
      }),
    };
  },
  created() {
    // 初始化清空本地存储
    localStorage.getItem("box_host") && localStorage.removeItem("box_host");
    removeToken("Admin-Token");
    // 先获取随机数，生成动态key
    boxCheck_getGuid().then((res) => {
      if (res.code == 200) {
        this.random = res.data;
        // 建立websocket连接
        this.connectSocket();
      }
    });
    this.msgSuccess = function (msg) {
      this.$message({ showClose: true, message: msg, type: "success" });
    };
    this.msgError = function (msg) {
      this.$message({ showClose: true, message: msg, type: "error" });
    };
    this.msgInfo = function (msg) {
      this.$message.info(msg);
    };
  },
  methods: {
    login() {
      // 获取token、host
      getCabinetInvokeInfo().then((res) => {
        setToken("Admin-Token", res.data.token);
        localStorage.setItem("box_host", res.data.host);
        this.loaded = true;
      });
    },
    connectSocket() {
      //测试 and 生产
      let curIP = window.location.hostname + ":" + window.location.port;
      let websocketHttp =
        "https:" == document.location.protocol ? "wss://" : "ws://";
      let wsUrl =
        websocketHttp + curIP + "/ws/cabinetTerminal/backMacKey" + this.random;
      this.createSocket(wsUrl);
      return false;
    },

    createSocket(url) {
      this.Socket && this.Socket.close();
      if (!this.Socket && !this.leave) {
        console.log("建立websocket连接");
        this.Socket = new WebSocket(url);
        this.Socket.onopen = this.onopenWS;
        this.Socket.onmessage = this.onmessageWS;
        this.Socket.onerror = this.onerrorWS;
        this.Socket.onclose = this.oncloseWS;
      } else {
        console.log("websocket已连接");
      }
    },

    onerrorWS() {
      this.Socket.close();
      console.log("连接失败重连中");
      if (this.Socket.readyState !== 3) {
        this.Socket = null;
        // this.createSocket(sessionStorage.getItem("webSocketUrl"));
      }
    },

    onmessageWS(e) {
      let self = this;
      let data = JSON.parse(e.data);
      console.log("接收websocket消息:" + JSON.stringify(data));
      switch (data.operationType) {
        case "remoteUnlock":
          if (data.success) {
            this.noticeResult = true;
            self.msgSuccess(data.msg);
          } else {
            self.msgError(data.msg);
          }
          break;
        case "remoteCheck":
          if (data.success) {
            self.msgSuccess(data.msg);
            if (self.$refs.cpManageGoods.$refs.manageGoodsContent) {
              self.$refs.cpManageGoods.$refs.manageGoodsContent.queryGoodsList();
            }
            this.noticeResult = true;
          } else {
            self.msgError(data.msg);
          }
          break;
        case "remoteLock":
          if (data.success) {
            this.noticeResult = true;
            self.msgSuccess(data.msg);
          } else {
            self.msgError(data.msg);
          }
          break;
        case "remoteLockCheck":
          if (data.success) {
            this.noticeResult = true;
            self.msgSuccess(data.msg);
          } else {
            self.msgError(data.msg);
          }
          break;
        default:
          if (data.success) {
            this.noticeResult = true;
            self.msgSuccess(data.msg);
          } else {
            self.msgError(data.msg);
          }
          break;
      }
    },

    /**断开重连 */
    oncloseWS() {
      console.log("websocket已断开....正在尝试重连");
      if (this.Socket.readyState !== 2) {
        this.Socket = null;
        // this.createSocket(sessionStorage.getItem("webSocketUrl"));
      }
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.content {
  background: #ededed;
}
</style>
