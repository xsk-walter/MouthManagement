<template>
  <el-dialog
    title="盘点汇总详情"
    :visible.sync="dialogVisible"
    width="980px"
    class="coustomCheckStyle"
    :class="platform === 'pc' ? 'check-pc' : 'check-terminal'"
  >
    <div class="checkView-wrap">
      <div class="checkView-content">
        <div class="box-all">
          <div class="top">
            <span></span>
            <p>总览</p>
          </div>
          <div class="bottom">
            <div class="item">
              <div class="boxCount">
                <div>格口总数</div>
                <div class="num" style="color: #e2b062">
                  {{ checkBoxInfo.boxCount || 0 }}
                </div>
              </div>
              <div class="item-line"></div>
              <div class="bindCount">
                <div>已绑定印章</div>
                <div class="num" style="color: #3681ff">
                  {{ checkBoxInfo.bindCount || 0 }}
                </div>
              </div>
            </div>
            <div class="item">
              <div class="shouldInCount">
                <div>应在柜印章</div>
                <div class="num" style="color: #e2b062">
                  {{ checkBoxInfo.shouldInCount || 0 }}
                </div>
              </div>
              <div class="item-line"></div>
              <div class="inCount">
                <div>实在柜印章</div>
                <div class="num" style="color: #e2b062">
                  {{ checkBoxInfo.inCount || 0 }}
                </div>
              </div>
            </div>
            <div class="item out-item">
              <div class="shouldOutCount" @click.stop="viewOutSeal(2)">
                <div>应被取出印章</div>
                <div class="num" style="color: #626262">
                  {{ checkBoxInfo.shouldOutCount || 0 }}
                </div>
              </div>
              <!-- <div class="item-line"></div> -->
              <div class="outCount" @click.stop="viewOutSeal(1)">
                <div>实被取出印章</div>
                <div class="num" style="color: #626262">
                  {{ checkBoxInfo.outCount || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="center-line"></div> -->
        <div class="box-error" v-if="errorList.length > 0">
          <div class="top">
            <span></span>
            <p>异常格口</p>
          </div>
          <div class="bottom">
            <div class="error-list" v-if="true">
              <div
                class="item"
                v-for="item in errorList"
                :key="item.id"
                @click.stop="getErrorList(item)"
              >
                {{ item.boxCode }}
              </div>
            </div>
          </div>
        </div>
        <div class="box-error box-error-no" v-if="errorList.length <= 0">
          <img src="../../assets/images/no-error.png" />
          <p>暂无异常格口数据</p>
        </div>
      </div>
    </div>
    <!-- 错误详情 -->
    <ErrorBoxDialogVue
      :show.sync="errorListShow"
      :list="errorSealList"
      :macAddress="macAddress"
      :outText="outText"
      v-if="errorListShow"
    ></ErrorBoxDialogVue>
  </el-dialog>
</template>

<script>
import { boxGoodsList, boxProductPageByState } from "@/common/js/api.js";
// 错误 详情表格
import ErrorBoxDialogVue from "../../components/errorBoxDialog";
export default {
  name: "CheckAll",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    platform: {
      type: String,
      default: "pc",
    },
    info: {
      type: Object,
      default() {
        return {};
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    macAddress: {
      type: String,
      default: "",
    },
  },
  components: { ErrorBoxDialogVue },
  data() {
    return {
      errorSealList: [], //异常印章列表
      errorListShow: false,
      outText: "异常",
      takeOutShow: false,
      takeOutList: [],
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
    checkBoxInfo: {
      get() {
        return this.info;
      },
    },
    errorList: {
      get() {
        return this.list;
      },
    },
  },
  methods: {
    getErrorList(item) {
      this.errorListShow = true;
      this.outText = "异常";
      this.errBoxCode = item.boxCode;
      // item.id
      boxGoodsList({
        boxId: item.id,
        state: -1,
      }).then((res) => {
        let { code, data } = res;
        if (code == 200) {
          this.errorSealList = data ? data : [];
          if (this.errorSealList.length <= 0) {
            this.$message({
              message: "未查询到异常印章",
              type: "warning",
            });
          }
        }
      });
    },
    // 取出列表详情
    viewOutSeal(type) {
      this.outText = type > 1 ? "应被取出" : "实被取出";
      boxProductPageByState({ type: type, macAddress: this.macAddress }).then(
        (res) => {
          let { code, data } = res;
          if (code == 200) {
            this.errorSealList = data.records ? data.records : [];
            if (this.errorSealList.length <= 0) {
              this.$message({
                message: `未查询到${type > 1 ? "应被取出" : "实被取出"}印章`,
                type: "warning",
              });
              return;
            }
            this.errorListShow = true;
          }
        }
      );
    },
  },
};
</script>

<style lang="scss">
.check-pc {
  .checkView-wrap {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;

    .checkView-content {
      display: flex;
      justify-content: space-between;
      padding: 22px 40px 44px 40px;
      > div {
        width: 420px;
        height: 500px;
      }

      .box-all {
        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 370px;
          height: 124px;
          background: rgba(255, 255, 255, 0);
          border: 1px solid rgba(190, 190, 189, 1);
          border-radius: 10px;
          margin-top: 20px;
          margin-left: 20px;
          > div {
            width: calc(50% - 1px);
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: PingFang-SC-Bold;
            font-size: 18px;
            color: #626262;
            font-weight: 700;
            > .num {
              font-family: PingFang-SC-Bold;
              font-size: 33px;
              font-weight: 700;
              margin-top: 16px;
            }
          }
          > .item-line {
            width: 2px;
            height: 80px;
            background: rgba(190, 190, 189, 1);
          }
        }
        .out-item {
          border: none;
          display: flex;
          justify-content: space-between;
          > div {
            width: 180px;
            height: 100%;
            background-image: url("../../assets/images/out-seal-bg.png");
            background-size: 100% auto;
            background-repeat: no-repeat;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #726c63;
          }
        }
      }
      .box-error-no {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .box-error {
        > img {
          width: 226px;
        }
        > p {
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #626262;
          text-align: center;
          font-weight: 400;
        }
        .bottom {
          display: flex;
          ::-webkit-scrollbar {
            width: 4px;
            background: #f2f5f7;
          }
          ::-webkit-scrollbar-thumb {
            background: #ccc;
          }

          ::-ms-scrollbar {
            width: 4px;
            background: #f2f5f7;
          }
          ::-ms-scrollbar-thumb {
            background: #ccc;
          }

          ::-moz-scrollbar {
            width: 4px;
            background: #f2f5f7;
          }
          ::-moz-scrollbar-thumb {
            background: #ccc;
          }
          .error-list {
            width: 100%;
            height: 420px;
            overflow-y: scroll;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            .item {
              width: 40%;
              height: 75px;
              background: #f38381;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: PingFang-SC-Bold;
              font-size: 16px;
              color: #323232;
              font-weight: 700;
              margin-bottom: 10px;
            }
          }
        }
      }
      .top {
        border-bottom: 1px solid #e9e9e9;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #e2b062;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        margin-bottom: 28px;
        > span {
          width: 4px;
          height: 30px;
          background: #e2b062;
          margin-right: 15px;
        }
      }
    }
  }
}

.coustomCheckStyle {
  .el-dialog {
    border-radius: 8px;
  }
  .el-dialog__header {
    background-color: #f5f5f5;
    padding: 20px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
