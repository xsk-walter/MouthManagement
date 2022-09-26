<template>
  <div class="container-step">
    <div v-for="item in list" :key="item" class="status-step">
      <div
        class="step-column"
        :class="item === '异常放入' || item === '异常取出' ? 'error-bg' : ''"
      >
        <img
          v-if="item !== '未绑定'"
          class="status-img"
          :src="require(`../assets/images/${handelImg(item)}`)"
        />
      </div>
      <div class="status-label">{{ item }}</div>
    </div>
  </div>
</template>

<script>
/**
 * props
 * list: Array 展示格口状态提示 - 顺序
 * matchup: Object 样式和图片名称映射
 */
export default {
  name: "MouthStatus",
  props: {
    list: {
      type: Array,
      default: () => {
        return ["未绑定", "在盒", "取出", "异常放入", "异常取出"];
      },
    },
    matchup: {
      type: Object,
      default: () => {
        return {
          在盒: "status_small_in.png",
          取出: "status_small_out.png",
          异常放入: "status_small_in.png",
          异常取出: "status_small_error_out.png",
        };
      },
    },
  },
  data() {
    return {};
  },

  methods: {
    // 处理图片展示路径
    handelImg(name) {
      for (let key in this.matchup) {
        if (name === key) {
          return this.matchup[key];
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container-step {
  display: flex;
  justify-content: flex-end;
  .status-step {
    display: flex;
    .step-column {
      width: 17px;
      height: 17px;
      background: #ececec;
      border: 1px solid #dfdfdf;
      text-align: center;
      line-height: 15px;
    }

    .status-img {
      width: 6px;
      height: 10px;
    }

    .error-bg {
      background: rgba(255, 0, 0, 0.49);
    }
    .status-label {
      font-size: 12px;
      color: #626262;
      text-align: center;
      margin: 0 12px 0 4px;
    }
  }
}
</style>
