<template>
    <!-- 轮播图 -->
  <div class="swiper-container" ref="mySwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(slide,index) in skuImageList" :key="slide.id">
        <!-- 实现点击谁 谁有高亮边框 -->
        <img :src="slide.imgUrl" :class="{active:currentList==index}" @click="changeCurrentList(index)">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
// 引包
import Swiper from 'swiper'
  export default {
    name: "ImageList",
    // 从父组件中拿数据
    props:['skuImageList'],
    data() {
      return {
        // 控制哪个图片高亮, 默认为第一个
        currentList:0,
      }
    },
    watch:{
      // 监听数据回来了，但是不能保证结构已经完善
      skuImageList(){
        // 监听数据和结构都已经有了
         this.$nextTick(() => {
          new Swiper(
            // 获取DOM中的swiper-container
            this.$refs.mySwiper, 
            {
              // 如果需要前进后退按钮
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
              // 显示几个图片设置
              slidesPerView : 3, 
              // 每一次切换图片的个数
              slidesPerGroup : 1,
          });
        });
      },
    },
    methods: {
      // 点击谁更改currentList为谁的索引值
      changeCurrentList(index){
          this.currentList = index;
          // 通知自己的兄弟组件，当前的索引值为几。同时修改上方大图
          this.$bus.$emit('getImgIndex',index);
      },

    },
  }
</script>

<style lang="less" scoped>
  .swiper-container {
    height: 56px;
    width: 412px;
    box-sizing: border-box;
    padding: 0 12px;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;

        &.active {
          border: 2px solid #f60;
          padding: 1px;
        }

      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: rgb(235, 235, 235);
      border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;
      &::after {
        font-size: 12px;
      }
    }
  }
</style>