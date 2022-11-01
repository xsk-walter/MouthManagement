<template>
  <div class="container-error">
    <img src="../assets/images/404.png" />
    <div>服务开小差了，请联系客服</div>
  </div>
</template>
<script>
export default {
  name: "Error",
};
</script>

<style scoped lang="scss">
.container-error {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  font-size: 14px;
  color: #333330;
  text-align: center;
  height: 100vh;
  img {
    width: 350px;
    height: 249px;
  }
}
</style>
