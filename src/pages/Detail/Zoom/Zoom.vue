<template>
  <div class="spec-preview">
    <!-- 默认背景图 -->
    <!-- 这里不能直接取第0项，服务器数据没有回来时，空数组第零项打.报错 需要处理 -->
    <img :src="skuImageFirst.imgUrl" />
    <div class="event"></div>
    <!-- 右侧大图 -->
    <div class="big">
      <img :src="skuImageFirst.imgUrl" />
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    // 从父组件中拿数据
    props:['skuImageList'],
    computed:{
      skuImageFirst(){
        return this.skuImageList[0] || {}
      }
    }
  }
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

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>