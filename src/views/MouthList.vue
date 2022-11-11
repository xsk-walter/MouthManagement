<template>
  <div class="container-mouth">
    <el-card class="box-card" :body-style="bodyStyle" v-loading="loading">
      <div slot="header" class="clearfix">
        <div class="header-title">格口管理</div>
      </div>

      <!-- search -->
      <div class="search">
        <span class="search-label">终端名称</span>
        <el-select
          v-model="terminalGrid"
          placeholder="请选择终端名称"
          size="small"
          @change="changeSelect"
        >
          <el-option
            v-for="item in termialOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="mouthLists.length === 0 && !loading" class="emtype-list">
        <img src="../assets/images/empty_list.png" />
        <div>还未接入任何印章盒！</div>
      </div>

      <!-- status -->
      <div class="status" v-if="mouthLists.length !== 0">
        <div class="columns-check">
          <div class="check-button" @click="checkAll">一键盘点</div>
          <u class="check-flex">
            <div class="check-last" @click="lastTimeCheck">
              查看最近一次盘点结果(<span>{{ lastCheckTime }}</span
              >)
            </div>
          </u>
        </div>
        <div class="columns-status">
          <MouthStatus></MouthStatus>
        </div>
      </div>
      <!-- list -->
      <el-row
        type="flex"
        :gutter="20"
        justify="space-between"
        style="flex-wrap: wrap; min-width: 1180px"
      >
        <el-col
          :span="8"
          style="margin-bottom: 20px"
          v-for="(item, index) in mouthLists"
          :key="index"
        >
          <MouthCard
            :platform="platform"
            :state="item.state"
            :inBoxState="item.inBoxState"
            :bindState="item.bindState"
            :cancel="item.link"
            :ignoreException="item.ignoreException"
            :boxCode="item.boxCode"
            :productName="item.productName"
            @goDetail="goDetail(item)"
            @unlock="handleUnlock(item)"
            @check="handlePan(item)"
            @cancel="handleCancel(item)"
          ></MouthCard>
        </el-col>
        <!-- 尾行占位 -->
        <el-col
          :span="8"
          style="margin-bottom: 20px"
          v-for="item in 3"
          :key="item * 9"
        >
        </el-col>
      </el-row>
    </el-card>
    <!-- 格口详情弹窗 -->
    <MouthDetail
      v-if="detailDialogShow"
      :show.sync="detailDialogShow"
      :id="select_box_id"
      :mac-address="terminalGrid"
    ></MouthDetail>
    <!-- 一键盘点弹窗 -->
    <CheckAll
      v-if="checkAllDialogShow"
      :show.sync="checkAllDialogShow"
      :info="checkBoxInfo"
      :list="boxInfoList"
      :macAddress="terminalGrid"
    ></CheckAll>
  </div>
</template>

<script>
import { mouthSelect } from "../common/js/api";
import MouthStatus from "../components/mouthStatus";
import MouthCard from "../components/mouthCard";
import MouthDetail from "./modules/mouthDetail";
import CheckAll from "./modules/checkAll";
import { setToken } from "@/utils/auth";
import {
  boxGetCheckAll,
  selectExceptionBoxList,
  grid_list,
  service_list,
  getCabinetInvokeInfo,
  findLastCheckRecode,
  check_goods,
  offBox,
} from "../common/js/api";
import mixin from "../mixins/mixins.vue";
export default {
  name: "MouthList",
  components: { MouthStatus, MouthCard, MouthDetail, CheckAll },
  mixins: [mixin],
  data() {
    return {
      list: [],
      bodyStyle: {
        padding: "0 20px 20px 25px",
      },
      termialOptions: [],
      terminalGrid: "",
      mouthLists: [],
      platform: "pc", // 平台
      detailDialogShow: false,
      checkAllDialogShow: false,
      // 一键盘点弹窗信息
      checkBoxInfo: {}, //盘点汇总格口数据
      boxInfoList: [], // 异常列表
      select_box_id: "",
      loading: true,
      lastCheckTime: "",
    };
  },
  inject: ["noticeFromApp"],
  computed: {
    updateList() {
      return this.noticeFromApp();
    },
  },
  watch: {
    updateList(val) {
      console.log("硬件-刷新页面响应了", val);
      this.init();
    },
  },
  created() {
    // this.getLoginToken();
    this.init();
  },

  methods: {
    async init() {
      // 初始化 select-options
      mouthSelect().then((res) => {
        this.termialOptions = res.data.filter((item) => item.extra === 3);
        // 默认 选中 - 初始化
        this.terminalGrid = this.termialOptions[0].id;
        this.getList();
        this.getLastCheckTime();
      });
    },
    async getList() {
      this.loading = true;
      // 获取 设备id
      let result_device = await service_list({
        macAddress: this.terminalGrid,
        requestType: "device",
      });
      // 获取列表
      let result_list = await grid_list({
        macAddress: this.terminalGrid,
        deviceId: result_device.data[0].id,
      });
      // console.log(result_list)
      // this.mouthLists = [];
      this.loading = false;
      let arr_list = [];
      arr_list = this.handleData(result_list.data.records);
      arr_list.map((item, index) => {
        if (!item.link && !item.bindState) {
          arr_list.splice(index, 1);
        }
      });
      this.mouthLists = arr_list;
      console.log(this.mouthLists, "this.mouthLists", result_list.data.records);
    },

    changeSelect() {
      this.getList();
      this.getLastCheckTime();
    },
    // 盘点
    handlePan(attr) {
      if (attr.enable) {
        let param = {
          macAddress: attr.macAddress,
          boxId: attr.boxId,
          boxCode: attr.boxCode,
          hasPositionLock: true,
          operationType: "remoteCheck",
        };
        // this.$message({
        //   message: "格口盘点中...",
        //   type: "info",
        // });
        this.pan_flag = true;
        let that = this;
        check_goods(param).then(() => {
          let timer = setTimeout(() => {
            clearTimeout(timer);
            that.getList();
          }, 800);
        });
      } else {
        this.$message({
          message: "当前格口禁用中",
          type: "info",
        });
      }
    },
    // 处理列表数组
    handleData(attr) {
      let arr = [];
      if (!attr || attr.length === 0 || !Array.isArray(attr)) return [];
      attr.forEach((item) => {
        arr.push({
          ...item.positionList[0],
          ignoreException: item.ignoreException,
          boxId: item.id,
          link: item.link,
        });
      });
      return arr;
    },
    // 打开详情
    goDetail(attr) {
      let { boxId } = attr;
      this.select_box_id = boxId;
      this.detailDialogShow = true;
    },

    // 一键盘点
    checkAll() {
      this.checkAllDialogShow = true;
      boxGetCheckAll({ macAddress: this.terminalGrid }).then((res) => {
        this.checkBoxInfo = res.data;
      });
      selectExceptionBoxList({ macAddress: this.terminalGrid }).then((res) => {
        this.boxInfoList = res.data.length > 0 ? res.data[0].boxInfoList : [];
      });
      return false;
    },

    // 最后一次盘点
    lastTimeCheck() {
      this.checkAll();
    },

    // 最近一次盘点时间
    getLastCheckTime() {
      findLastCheckRecode({
        checkType: "remoteAllCheck",
        macAddress: this.terminalGrid,
      }).then((res) => {
        this.lastCheckTime = res.data ? res.data.checkTime : "-";
      });
    },

    // 注销
    handleCancel(attr) {
      this.$confirm(`是否确定注销${attr.boxCode}格口吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          offBox({ boxId: attr.boxId }).then(() => {
            this.$message({
              type: "success",
              message: "注销成功",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    // 获取token
    getLoginToken() {
      getCabinetInvokeInfo().then((res) => {
        console.log(res.data.token, res.data.host, "===", res);
        setToken("Admin-Token", res.data.token);
        localStorage.setItem("box_host", res.data.host);
        this.init();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container-mouth {
  min-width: 1100px;
}
.box-card {
  margin: 10px;
  min-height: 800px;
  .header-title {
    position: relative;
    line-height: 25px;
    font-size: 16px;
    font-weight: 500;

    &::before {
      content: "";
      height: 26px;
      width: 4px;
      background: #e2b062;
      position: absolute;
      top: 0px;
      left: -15px;
    }
  }

  .search {
    margin-top: 10px;
    .search-label {
      font-size: 16px;
      color: #323232;
      margin-right: 20px;
    }
  }

  .emtype-list {
    display: flex;
    height: 500px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 24px;
    color: #666666;
    text-align: center;

    img {
      width: 540px;
      height: 234px;
    }
  }

  .status {
    display: flex;
    .columns-check {
      display: flex;
      margin: 15px 0;
      .check-button {
        width: 118px;
        height: 36px;
        color: #ffffff;
        background: #e2b062;
        border-radius: 4px;
        text-align: center;
        line-height: 36px;
        margin-right: 10px;
        cursor: pointer;
        font-size: 15px;
      }

      .check-flex {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        color: #59a4ee;
      }

      .check-last {
        font-weight: 400;
        font-size: 12px;
        color: #59a4ee;
        text-align: center;
        cursor: pointer;
      }
    }

    .columns-status {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
    }
  }
}

:deep.el-card .el-card__header {
  padding: 14px 15px 7px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
