<template>
  <div class="container-mouth">
    <el-card class="box-card" :body-style="bodyStyle">
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

      <!-- status -->
      <div class="status">
        <div class="columns-check">
          <div class="check-button" @click="checkAll">一键盘点</div>
          <u class="check-flex">
            <div class="check-last">
              查看最近一次盘点结果(<span>{{ recentlyResult }}</span
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
            :cancel="item.cancel"
            :ignoreError="item.ignoreError"
            :boxCode="item.boxCode"
            :boxTypeName="item.boxTypeName"
            @goDetail="goDetail"
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
    ></MouthDetail>
    <!-- 一键盘点弹窗 -->
    <CheckAll
      v-if="checkAllDialogShow"
      :show.sync="checkAllDialogShow"
    ></CheckAll>
  </div>
</template>

<script>
// import { mouthSelect } from "../common/js/api";
import MouthStatus from "../components/mouthStatus";
import MouthCard from "../components/mouthCard";
import MouthDetail from "./modules/mouthDetail";
import CheckAll from "./modules/checkAll";
import { boxGetCheckAll, selectExceptionBoxList } from "../common/js/api";
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
      recentlyResult: "2022-02-02",
      mouthLists: [],
      platform: "pc", // 平台
      detailDialogShow: false,
      checkAllDialogShow: false,
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      // mouthSelect().then((res) => {
      //   if (res.success) {
      //     this.termialOptions = res.data;
      //   }
      // });
      this.mouthLists = [
        // 正常 在盒
        {
          state: 0,
          inBoxState: 1,
          bindState: 1,
          cancel: 0,
          ignoreError: 0,
          boxTypeName: "项目一部财务工程办公合同专用章一",
          boxCode: "A-1-1",
        },
        // 正常 - 取出
        {
          state: 0,
          inBoxState: 0,
          bindState: 1,
          cancel: 0,
          ignoreError: 0,
          boxTypeName: "项目一部财务工程办公合同专用章二",
          boxCode: "A-1-2",
        },
        // 异常 - 取出
        // {
        //   state: -2,
        //   inBoxState: 0,
        //   bindState: 1,
        //   cancel: 0,
        //   ignoreError: 0,
        //   boxTypeName: "项目一部财务工程办公合同专用章四",
        //   boxCode: "A-1-4",
        // },
        // 异常 - 放入
        {
          state: -1,
          inBoxState: 1,
          bindState: 1,
          cancel: 0,
          ignoreError: 0,
          boxTypeName: "项目一部财务工程办公合同专用章五",
          boxCode: "A-1-5",
        },
        // 忽略异常
        {
          state: 0,
          inBoxState: 1,
          bindState: 1,
          cancel: 0,
          ignoreError: 1,
          boxTypeName: "项目一部财务工程办公合同专用章六",
          boxCode: "A-1-6",
        },
        // 未绑定
        {
          state: 0,
          inBoxState: 1,
          bindState: 0,
          cancel: 0,
          ignoreError: 0,
          boxTypeName: "项目一部财务工程办公合同专用章七",
          boxCode: "A-1-7",
        },
        // 注销 - 在盒、取出、异常放入、异常取出（未绑定直接不显示）
        {
          state: 0,
          inBoxState: 1,
          bindState: 1,
          cancel: 1,
          ignoreError: 0,
          boxTypeName: "项目一部财务工程办公合同专用章八",
          boxCode: "A-1-8",
        },
      ];
    },
    // 打开详情
    goDetail() {
      this.detailDialogShow = true;
    },

    // 一键盘点
    checkAll() {
      this.checkAllDialogShow = true;
      boxGetCheckAll({ macAddress: this.terminalGrid }).then((res) => {
        console.log(res);
        // let { code, data } = res;
        // if (code == 200) {
        //   this.checkView = true;
        //   this.checkBoxInfo = data;
        // }
      });
      selectExceptionBoxList({ macAddress: this.terminalGrid }).then((res) => {
        console.log(res);
        // let { code, data } = res;
        // if (code == 200) {
        //   this.ExceptionBoxList = data;
        //   console.log(this.ExceptionBoxList);
        // }
      });
      return false;
    },

    // 注销
    handleCancel(attr) {
      console.log(attr, "注销");
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
