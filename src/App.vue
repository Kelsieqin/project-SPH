<template>
  <div>
    <Header></Header>
    <!-- 路由出口 -->
    <router-view></router-view>
    <!-- $route是当前路由出口的组件的$route -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
// 引入组件
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    // 注册组件
    Header,
    Footer,
  },
  mounted(){
    // 性能优化：只发送一次请求，请求三级联动列表数据；
    this.$store.dispatch("categoryList");
  }
};
</script>

<style>
</style>
