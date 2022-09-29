import { ischeckAll, unLock, check_goods } from "../common/js/api";

// 远程开锁
export function handleUnlock(row) {
  let that = this;
  this.$confirm(
    `避免${that.$store.state.user.extra}被异常取出，请确保管理员在场的情况下使用远程开锁，是否确定现在打开格口${row.boxCode}箱门？`,
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
}

// 盘点
export function handlePan(item) {
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
}
