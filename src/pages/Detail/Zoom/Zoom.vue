<template>
  <div class="spec-preview">
    <!-- 默认背景图 -->
    <!-- 这里不能直接取第0项，服务器数据没有回来时，空数组第零项打.报错 需要处理 -->
    <img :src="skuImageObj.imgUrl" />
    <!-- 绑定鼠标移动事件 -->
    <div class="event" @mousemove="handler"></div>
    <!-- 右侧大图 -->
    <div class="big">
      <img :src="skuImageObj.imgUrl" ref="bigImg" />
    </div>
    <!-- 上层遮盖盒子（绿色盒子） -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  // 从父组件中拿数据
  props: ["skuImageList"],
  data() {
    return {
      // 配置当前索引值 来接收兄弟组件传递的索引
      currentIndex: 0,
    };
  },
  computed: {
    skuImageObj() {
      return this.skuImageList[this.currentIndex] || {};
    },
  },
  // 兄弟间通信
  mounted() {
    // 定义事件名和回调- 接收兄弟组件传递的图片索引值
    this.$bus.$on("getImgIndex", (index) => {
      // 修改当前索引
      this.currentIndex = index;
    });
  },
  methods: {
    // 鼠标移动时间
    handler(event) {
      // 目标：鼠标移动 遮盖盒子跟着动
      // 1. 获取盒子
      let mask = this.$refs.mask;
      // 2. 计算遮盖盒子的left top
      let left = event.offsetX - mask.offsetWidth / 2;
      let top = event.offsetY - mask.offsetHeight / 2;
      // 4. 限制移动范围
      // 左侧限制
      if (left <= 0) left = 0;
      // 右侧限制 - 大盒子宽度等于小盒子宽度的二倍
      if (left >= mask.offsetWidth) left = mask.offsetWidth;
      // 上限制
      if (top <= 0) top = 0;
      // 下限制
      if (top >= mask.offsetHeight) top = mask.offsetHeight;
      // 3. 修改元素top left
      mask.style.left = left + "px";
      mask.style.top = top + "px";

      // 5. 修改右侧大图跟随遮盖的小盒子中的图片,一起变动
      // 获取右侧大图
      let bigImg = this.$refs.bigImg;
      // 改变右侧大图left |top
      bigImg.style.left = -2 * left + "px";
      bigImg.style.top = -2 * top + "px";
    },
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>