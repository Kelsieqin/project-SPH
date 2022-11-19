<template>
  <!-- 轮播图结构 -->
  <div class="swiper-container" ref="mySwiper">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(carousel, index) in list"
        :key="carousel.id"
      >
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
// 引入swiper
import Swiper from "swiper";

export default {
  name: "Carousel",
// 父组件传递的轮播图数据list
  props:['list'],
    watch: {
    // 问题1：new swapper之前必须有结构，但是在mounted中new swiper， 轮播图效果没实现？？？
    // 原因：结构没有完整。因为dispatch中涉及【异步请求】，所以v-for遍历服务器返回的数据还没有完全，但是swiper实例已经创建
    // 解决办法： 使用watch监听bannerList数组的变化【从[]变为四个元素】-- 必须采用对象形式，使用handler
    bannerList: {

      // 为了统一风格，进行封装
      immediate:true,
      // 问题2：如果执行handler(),表示数据已经返回，更改完成；但是轮播图的效果还是没有实现？？？
      // 原因： 结构还是没有完整，当前操作只能保证bannerList数据已经有了，但是v-for是否把结构渲染完毕还未知。
      // 解决方法：$nextTick
      handler(newValue, oldValue) {
        // 当执行这个回调的时候，保证服务器数据已经回来了，v-for执行完毕了【轮播图的结构有了！】
        this.$nextTick(() => {
          var mySwiper = new Swiper(
            // 获取DOM中的swiper-container
            this.$refs.mySwiper, 
            {
              loop: true, // 循环模式选项

              // 如果需要分页器
              pagination: {
                el: ".swiper-pagination",
                // 点击小圆点可以切换图片
                type:"bullets",
                clickable: true,
              },
              // 如果需要前进后退按钮
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
          });
        });
      },
    },
  },
};
</script>

<style>
</style>