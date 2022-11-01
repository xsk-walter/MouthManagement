<script>
import { unLock, check_goods } from "../common/js/api";

export default {
  methods: {
    // 盘点
    handlePan(attr) {
      if (attr.enable) {
        let param = {
          macAddress: attr.macAddress,
          boxId: attr.id,
          boxCode: attr.boxCode,
        };
        this.$message({
          message: "格口盘点中...",
          type: "info",
        });
        this.pan_flag = true;
        check_goods(param).then(() => {
          // 盘点成功
          // this.$message({
          //   message: "盘点成功",
          //   type: "success",
          // });
        });
      } else {
        this.$message({
          message: "当前格口禁用中",
          type: "info",
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
          let data = {
            macAddress: row.macAddress,
            boxId: row.id,
            boxCode: row.boxCode,
          };
          unLock(data).then(() => {
            this.$message({
              type: "success",
              message: "开锁成功",
            });
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
