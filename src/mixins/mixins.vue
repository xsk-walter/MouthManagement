<script>
import {
  ischeckAll,
  unLock,
  check_goods,
  updateIgnoreException,
} from "../common/js/api";

export default {
  methods: {
    // 忽略异常 - 单独组建
    errorIgnore() {
      let query = {
        boxId: this.id,
        ignore: !this.boxErrorIgnore,
      };
      if (!this.boxErrorIgnore) {
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
            updateIgnoreException(query).then(() => {
              this.boxErrorIgnore = !this.boxErrorIgnore;
              this.$bus.$emit("ignoreOperate", true);
            });
          })
          .catch(() => {});
      } else {
        updateIgnoreException(query).then(() => {
          this.boxErrorIgnore = !this.boxErrorIgnore;
          this.$bus.$emit("ignoreOperate", true);
        });
      }
    },
    // 盘点
    handlePan(item) {
      if (item.enable) {
        let param = {
          macAddress: item.macAddress,
          boxId: item.id,
          lock: 1,
        };
        ischeckAll(param).then((res) => {
          if (res.code == 200) {
            if (res.data.allowed) {
              this.$message.info("格口盘点中...");
              let param = {
                macAddress: item.macAddress,
                boxId: item.id,
                boxCode: item.boxCode,
                boxLockIp: item.boxLockIp,
              };
              check_goods(param).then(() => {});
            } else {
              this.$message({
                message: res.data.message,
                type: "warning",
              });
            }
          }
        });
      } else {
        this.$message({
          message: "当前格口禁用中",
          type: "warning",
        });
      }
    },
    // 远程开锁
    handleUnlock(row) {
      this.$confirm(
        `避免印章被异常取出，请确保管理员在场的情况下使用远程开锁，是否确定现在打开格口${row.boxCode}箱门？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let param = {
            macAddress: row.macAddress,
            boxId: row.id,
            lock: 1,
          };
          ischeckAll(param).then((res) => {
            if (res.code == 200) {
              if (res.data.allowed) {
                let data = {
                  macAddress: this.changeCase(this.terminalGrid),
                  boxId: row.id,
                  boxCode: row.boxCode,
                  boxLockIp: row.boxLockIp,
                };
                unLock(data).then(() => {});
              } else {
                this.$message({
                  message: res.data.message,
                  type: "warning",
                });
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消开锁",
          });
        });
    },
  },
};
</script>
