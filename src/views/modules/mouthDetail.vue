<template>
  <div>
    <!-- 格口详情 -->
    <el-dialog
      :visible.sync="showDialog"
      :width="platform === 'pc' ? '1150px' : '1050px'"
      class="coustomStyle"
      :class="platform === 'pc' ? 'dialog-pc' : 'dialog-terminal'"
      :fullscreen="dialogFullscreen"
      v-loading="loading"
    >
      <div slot="title" class="title">格口详情</div>

      <!-- info -->
      <div class="info">
        <div class="column">
          <div class="top">{{ mouthInfo.boxCode }}</div>
          <div class="bottom">格口编号</div>
        </div>
        <div class="column">
          <div class="top">
            {{ mouthInfo.positionIsClosed ? "关" : "开" }}
          </div>
          <div class="bottom">锁控状态</div>
        </div>
        <div class="column">
          <div class="top">
            {{ mouthInfo.state === 0 ? "正常" : "异常" }}
          </div>
          <div class="bottom">格口状态</div>
        </div>
        <div class="common-btn" @click="handleBlock">
          <span v-if="mouthInfo.enable">停用</span>
          <span v-else>启用</span>
        </div>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- tabbar -->
      <div class="tabbar">
        <el-tabs v-model="activeName">
          <!-- 绑定印章 -->
          <el-tab-pane label="绑定印章" name="first">
            <div class="detail-box" v-if="isBound">
              <div class="img-box img-common">
                <!-- 放入、异常 -->
                <img src="../../assets/images/status_in.png" v-show="!isOut" />
                <!-- 取出、异常 -->
                <img src="../../assets/images/status_out.png" v-show="isOut" />
              </div>
              <div class="info-box">
                <div class="info-box-title">
                  {{ boundSealInfo && boundSealInfo.productName }}
                  <span
                    class="info-code"
                    v-if="boundSealInfo && boundSealInfo.boxCode"
                    >({{ boundSealInfo && boundSealInfo.boxCode }})</span
                  >
                </div>
                <div
                  class="info-box-tag"
                  :class="
                    isError ? 'info-box-tag-error' : 'info-box-tag-normal'
                  "
                >
                  <div class="box-tag box-tag-error" v-if="isError">
                    {{ handleFormat(isError, isOut) }}
                  </div>
                  <div class="box-tag box-tag-normal" v-if="!isError">
                    {{ handleFormat(isError, isOut) }}
                  </div>
                  <div class="box-person">
                    操作人: {{ boundSealInfo && boundSealInfo.personName }}
                  </div>
                  <div class="box-time">
                    |&nbsp;{{ boundSealInfo && boundSealInfo.updateTime }}
                  </div>
                  <div
                    class="box-log"
                    v-show="boundSealInfo && boundSealInfo.exceptionRemark"
                  >
                    |&nbsp;{{ boundSealInfo && boundSealInfo.exceptionRemark }}
                  </div>
                </div>
              </div>
              <div class="box-btns">
                <div
                  class="common-btn box-btn"
                  @click="handleUnlock(mouthInfo)"
                >
                  开锁
                </div>
                <!-- <div class="ignore-btn" style="margin: 0">解绑</div> -->
              </div>
            </div>
            <div class="detail-no-bound" v-else>
              <img src="../../assets/images/Empty.png" />
              <div>未绑定印章</div>
            </div>
          </el-tab-pane>
          <!-- 流程记录 -->
          <el-tab-pane label="流程记录" name="second">
            <el-table
              v-loading="tableLoading"
              :data="tableData"
              stripe
              :row-key="id"
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
                width="60"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="personName"
                label="操作人"
                min-width="90"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="crateDate"
                label="操作时间"
                min-width="120"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="optCmd"
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

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.pageIndex"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.totalCount"
            >
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
        <div class="buttons">
          <div
            class="ignore-btn"
            v-show="activeName === 'first' && isError"
            @click="errorIgnore"
          >
            <span v-if="!mouthInfo.ignoreException">忽略异常</span>
            <span v-else>恢复异常</span>
          </div>
          <div
            class="ignore-btn"
            v-show="activeName === 'second'"
            @click="handleUnlock(mouthInfo)"
          >
            开锁
          </div>
          <div class="ignore-btn" v-if="platform !== 'pc' && boundSeal">
            绑定印章
          </div>
          <div class="common-btn" @click="handlePan(mouthInfo)">盘点</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Promise } from "q";
import {
  updateIgnoreException,
  box_detail_info,
  box_log_list,
  boxGoodsList,
  isAdminUnlockingAllowed,
  boxAttrBan,
} from "../../common/js/api";
import mixin from "../../mixins/mixins.vue";
export default {
  name: "MouthDetail",
  mixins: [mixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "",
    },
    macAddress: {
      type: String,
      default: "",
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
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        val === "second" && this.getLogList();
      },
    },
  },
  data() {
    return {
      activeName: "first",
      tableData: [],
      dialogFullscreen: false,
      loading: false,
      tableLoading: false,
      boundSeal: true,
      boundSealInfo: null,
      isOut: undefined, // 放入、取出
      isError: undefined, // 异常、正常
      // ignoreException: false,
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
        totalPage: 0,
      },
      mouthInfo: {
        boxCode: "", // 格口编码
        positionIsClosed: false, // 锁控状态
        state: "", // 0 正常、-1异常
        enable: true,
      },
      isBound: true, // 绑定印章
    };
  },
  created() {
    this.getInfo();
  },

  methods: {
    // 初始化获取信息
    getInfo() {
      let that = this;
      // box_detail_info(param).then((res) => {
      //   this.mouthInfo = res.data;
      //   this.boxErrorIgnore = res.data.boxErrorIgnore;
      //   this.loading = false;
      // });

      // boxGoodsList({
      //   macAddress: this.macAddress,
      //   boxId: this.id,
      // }).then((res) => {
      //   this.boundSealInfo = res.data[0];
      //   // 是否绑定
      //   this.isBound = res.data.length > 0;
      //   // 在不在盒
      //   this.isOut = this.isBound ? res.data[0].inBoxState === 0 : false;
      //   // 是否异常 0异常、1正常
      //   this.isError = this.isBound ? res.data[0].state === -1 : false;
      // });
      this.loading = true;
      let param = {
        macAddress: this.macAddress,
        id: this.id,
      };
      let p1 = function () {
        return new Promise((resolve, reject) => {
          box_detail_info(param).then((res) => {
            if (!res.success) {
              reject();
            }
            that.mouthInfo = res.data;
            console.log(res, "返回的详情====");
            that.boxErrorIgnore = res.data.boxErrorIgnore;
            that.loading = false;
            resolve();
          });
        });
      };
      let p2 = function () {
        return new Promise((resolve, reject) => {
          boxGoodsList({
            macAddress: that.macAddress,
            boxId: that.id,
          }).then((res) => {
            if (!res.success) {
              reject();
            }
            that.boundSealInfo = res.data[0];
            // 是否绑定
            that.isBound = res.data.length > 0;
            // 在不在盒
            that.isOut = that.isBound ? res.data[0].inBoxState === 0 : false;
            // 是否异常 0异常、1正常
            that.isError = that.isBound ? res.data[0].state === -1 : false;
            resolve();
          });
        });
      };
      Promise.all([p1(), p2()]).finally(() => {
        that.loading = false;
      });
    },
    // 获取日志记录
    getLogList() {
      this.tableLoading = true;
      box_log_list({
        boxId: this.id,
        pageSize: this.pagination.pageSize,
        pageIndex: this.pagination.pageIndex,
      }).then((res) => {
        console.log(res);
        this.tableData = res.data.records;
        this.tableLoading = false;
        this.pagination.totalCount = res.data.total;
      });
    },
    // 忽略异常 - 单独组建
    errorIgnore() {
      let query = {
        boxId: this.id,
        ignore: !this.mouthInfo.ignoreException,
      };
      if (!this.mouthInfo.ignoreException) {
        this.$confirm(
          "确认忽略异常后，当前格口将允许员工正常使用，建议将异常处理完毕后，格口自动恢复正常，手动忽略异常存在一定的盗章风险",
          "忽略异常",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            confirmButtonClass: "confirm",
            cancelButtonClass: "cancel",
            type: "warning",
          }
        )
          .then(() => {
            updateIgnoreException(query).then((res) => {
              if (!res.success) return;
              this.mouthInfo.ignoreException = !this.mouthInfo.ignoreException;
              // 刷新父列表
              this.$parent.getList();
            });
          })
          .catch(() => {});
      } else {
        updateIgnoreException(query).then((res) => {
          if (!res.success) return;
          this.mouthInfo.ignoreException = !this.mouthInfo.ignoreException;
          // 刷新父列表
          this.$parent.getList();
        });
      }
    },
    // 监听分页事件
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.pageIndex = 1;
      this.getLogList();
    },
    handleCurrentChange(val) {
      this.pagination.pageIndex = val;
      this.getLogList();
    },
    // 处理在盒状态
    handleFormat(err, isout) {
      let str = "";
      str = err ? (isout ? "异常放入" : "异常取出") : isout ? "不在盒" : "在盒";
      return str;
    },
    // 停用、启用格口
    handleBlock() {
      isAdminUnlockingAllowed({ boxId: this.id }).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            let title = `是否确定启用格口${this.mouthInfo.boxCode}？`;
            if (this.mouthInfo.enable) {
              title = `是否确定停用格口${this.mouthInfo.boxCode}？`;
            }
            let that = this;
            let obj = {
              macAddress: that.macAddress,
              boxId: that.id,
              enable: that.mouthInfo.enable ? false : true,
            };

            this.$confirm(title, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                boxAttrBan(obj).then((res) => {
                  let { code } = res;
                  if (code == 200) {
                    that.$message({
                      message: that.mouthInfo.enable ? "停用成功" : "启用成功",
                      type: "success",
                    });
                    that.$set(that.mouthInfo, "enable", !that.mouthInfo.enable);
                  }
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消操作",
                });
              });
          } else {
            this.$message({
              message: "很抱歉，您没有当前格口的操作权限",
              type: "warning",
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss">
div {
  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
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
    margin: 65px 0 15px 0;
  }
}

.box-btns {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.detail-no-bound {
  height: 318px;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 16px;
  color: #999999;
  img {
    width: 64px;
    height: 64px;
    margin-bottom: 8px;
  }
}
</style>
