<template>
  <div>
    <!-- 格口详情 -->
    <el-dialog
      :visible.sync="showDialog"
      :width="platform === 'pc' ? '1150px' : '1050px'"
      class="coustomStyle"
      :class="platform === 'pc' ? 'dialog-pc' : 'dialog-terminal'"
      :fullscreen="dialogFullscreen"
      v-loading="tableLoading"
    >
      <div slot="title" class="title">格口详情</div>

      <!-- info -->
      <div class="info">
        <div class="column">
          <div class="top">{{ mouthInfo && mouthInfo.code }}</div>
          <div class="bottom">格口编号</div>
        </div>
        <div class="column">
          <div class="top">
            {{ mouthInfo && mouthInfo.lockStatus ? "关" : "开" }}
          </div>
          <div class="bottom">锁控状态</div>
        </div>
        <div class="column">
          <div class="top">{{ mouthInfo && mouthInfo.mouthStatus }}</div>
          <div class="bottom">格口状态</div>
        </div>
        <div class="common-btn">停用</div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- tabbar -->
      <div class="tabbar">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 绑定印章 -->
          <el-tab-pane label="绑定印章" name="first">
            <div class="detail-box">
              <div class="img-box img-common">
                <!-- 放入、异常 -->
                <img src="../../assets/images/status_in.png" v-show="!isOut" />
                <!-- 取出、异常 -->
                <img src="../../assets/images/status_out.png" v-show="isOut" />
              </div>
              <div class="info-box">
                <div class="info-box-title">
                  {{ boundSealInfo && boundSealInfo.boxName }}
                  <span class="info-code"
                    >({{ boundSealInfo && boundSealInfo.boxCode }})</span
                  >
                </div>
                <div
                  class="info-box-tag"
                  :class="
                    isError ? 'info-box-tag-error' : 'info-box-tag-normal'
                  "
                >
                  <div class="box-tag box-tag-error" v-show="isError">
                    {{ boundSealInfo && boundSealInfo.boxStatus }}
                  </div>
                  <div class="box-tag box-tag-normal" v-show="!isError">
                    <!-- {{ boundSealInfo && boundSealInfo.boxStatus }} -->
                    不在柜
                  </div>
                  <div class="box-person">
                    操作人: {{ boundSealInfo && boundSealInfo.operationPerson }}
                  </div>
                  <div class="box-time">
                    |&nbsp;{{ boundSealInfo && boundSealInfo.operationTime }}
                  </div>
                  <div
                    class="box-log"
                    v-show="boundSealInfo && boundSealInfo.operationLog"
                  >
                    |&nbsp;{{ boundSealInfo && boundSealInfo.operationLog }}
                  </div>
                </div>
              </div>
              <div class="box-btns">
                <div class="common-btn box-btn">开锁</div>
                <div class="ignore-btn" style="margin: 0">解绑</div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 流程记录 -->
          <el-tab-pane label="流程记录" name="second">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%; margin-top: 10px"
              :header-cell-style="{
                background: '#FAFAFA',
                color: '#333333',
                display: 'table-cell',
                lineHeight: '22px',
                fontFamily: 'PingFangSC-Medium',
                fontSize: '14px',
              }"
            >
              <el-table-column
                label="序号"
                type="index"
                width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="operationPerson"
                label="操作人"
                min-width="180"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="operationTime"
                label="操作时间"
                min-width="180"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="operationLog"
                label="操作记录"
                min-width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                align="center"
                min-width="200"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div class="buttons">
          <div class="ignore-btn" v-show="activeName === 'first'">忽略异常</div>
          <div class="ignore-btn" v-show="activeName === 'second'">开锁</div>
          <div class="ignore-btn" v-if="platform !== 'pc' && boundSeal">
            绑定印章
          </div>
          <div class="common-btn">盘点</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MouthDetail",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    mouthInfo: {
      type: Object,
      default: () => {
        return {
          code: "A-1-1",
          lockStatus: true,
          mouthStatus: "异常",
        };
      },
    },
    platform: {
      type: String,
      default: "pc",
    },
  },
  computed: {
    showDialog: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit("update:show", val);
      },
    },
  },
  data() {
    return {
      activeName: "first",
      tableData: [],
      dialogFullscreen: false,
      tableLoading: false,
      boundSeal: true,
      boundSealInfo: null,
      isOut: false, // 放入、取出
      isError: true, // 异常、正常
    };
  },
  created() {
    this.getInof();
  },

  methods: {
    getInof() {
      let that = this;
      that.tableLoading = true;
      setTimeout(() => {
        that.tableLoading = false;
        // 绑定印章信息
        this.boundSealInfo = {
          boxName:
            "华东分区购销分区购销分区购销分区购销分区购销分区购销购合同章",
          boxCode: "E281166000",
          boxStatus: "异常放入",
          operationPerson: "刘德华",
          operationTime: "08/22 09:00",
          operationLog: "不属于该印章盒",
        };
        // 流程记录列表
        that.tableData = [
          {
            operationPerson: "郭光林",
            operationTime: "2022-01-02 09:00",
            operationLog: "启用",
            remark: "开锁类型：领取印章",
          },
          {
            operationPerson: "汤博",
            operationTime: "2022-01-12 09:00",
            operationLog: "关门",
            remark: "【智】招投标专用章(异常)",
          },
          {
            operationPerson: "郭光林",
            operationTime: "2022-01-02 09:00",
            operationLog: "启用",
            remark: "【智】招投标专用章(已归还)",
          },
          {
            operationPerson: "郭光林",
            operationTime: "2022-08-02 09:00",
            operationLog: "接入印章",
            remark: "【智】招投标专用章",
          },
        ];
      }, 1200);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="scss">
.dialog-pc {
  .common-btn {
    width: 90px;
    height: 36px;
    font-size: 12px;
    background: #e2b062;
    border-radius: 4px;
    line-height: 37px;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
  }

  .ignore-btn {
    width: 90px;
    height: 36px;
    text-align: center;
    line-height: 36px;
    font-size: 12px;
    border-radius: 4px;
    cursor: pointer;
    color: #e2b062;
    border: 1px solid #e8b86c;
    margin-right: 20px;
  }
  .img-box {
    width: 180px;
    height: 110px;

    img {
      width: 34px;
      height: 60px;
    }
  }
}

.dialog-terminal {
  .common-btn {
    width: 90px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: #fafafa;
    background-image: linear-gradient(90deg, #e2a952 0%, #d0963e 100%);
    box-shadow: 2px 3px 11px 0 rgba(0, 0, 0, 0.11), -2px -6px 11px 0 #ffffff,
      inset -2px -3px 4px 0 rgba(0, 0, 0, 0.09),
      inset 2px 3px 4px 0 rgba(255, 255, 255, 0.36);
    border-radius: 4px;
  }
  .ignore-btn {
    width: 90px;
    height: 46px;
    text-align: center;
    line-height: 46px;
    font-size: 12px;
    color: #e2b062;
    margin-right: 20px;
    background: #f2f2f2;
    box-shadow: 2px 11px 18px 0 rgba(0, 0, 0, 0.09), -7px -9px 16px 0 #ffffff,
      inset -2px -3px 4px 0 rgba(0, 0, 0, 0.03),
      inset 2px 3px 4px 0 rgba(255, 255, 255, 0.36);
    border-radius: 4px;
  }
  .img-box {
    width: 104px;
    height: 120px;

    img {
      width: 37px;
      height: 60px;
    }
  }
}

.coustomStyle {
  .title {
    font-size: 16px;
    color: #000000;
  }
  .el-dialog__header {
    background-color: #f5f5f5;
    padding: 20px;
  }
  .el-tabs__nav-wrap::after {
    width: 0px;
  }
  .el-tabs__active-bar {
    background-color: #e6b66b;
  }
  .el-tabs__item.is-active {
    color: #e6b66b;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #999999;
  }
  .el-tabs__item:hover {
    color: #e6b66b;
  }
}

// common
.info {
  display: flex;
  justify-content: space-between;
  padding: 0 20px 0 100px;
  align-items: center;
  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .top {
      font-weight: 900;
      font-size: 28px;
      color: #333333;
    }

    .bottom {
      font-weight: 500;
      font-size: 13px;
      color: #333333;
      margin-top: 20px;
    }
  }
}

.tabbar {
  position: relative;

  .buttons {
    position: absolute;
    top: 5px;
    right: 20px;
    display: flex;
  }
}

.detail-box {
  display: flex;
  height: 150px;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  justify-content: space-between;
  padding-right: 20px;
  margin-top: 10px;

  .img-common {
    background: #ececec;
    border: 0.5px solid #dfdfdf;
    border-radius: 2.54px;
    margin: auto 20px auto 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info-box {
    margin-top: 30px;
    width: 740px;
    .info-box-title {
      font-weight: 400;
      font-size: 18px;
      color: #303133;

      .info-code {
        font-weight: 400;
        font-size: 12px;
        color: #999999;
      }
    }

    .info-box-tag {
      margin-top: 10px;
      font-weight: 500;
      font-size: 12px;
      display: flex;

      .box-tag {
        border-radius: 4px;
        padding: 0 8px;
      }

      .box-tag-normal {
        color: #2cc91d;
        background: #e4fae2;
      }

      .box-tag-error {
        color: #ef1e1e;
        background: #fbd9d9;
      }

      .box-time,
      .box-person,
      .box-log {
        margin: 0 4px;
      }
    }

    .info-box-tag-normal {
      color: #909399;
    }

    .info-box-tag-error {
      color: #ef1e1e;
    }
  }

  .box-btn {
    margin: 25px 0 15px 0;
  }
}

.box-btns {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
