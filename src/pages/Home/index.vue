<template>
  <div>
    <!-- <H1>我是首页</H1> -->
    <!-- 直接使用全局组件，不需要再引入 -->
    <Typenav></Typenav>
    <Listcontainer></Listcontainer>
    <Todayrecommend></Todayrecommend>
    <Rank></Rank>
    <Like></Like>
    <!-- Floor组件：自己内部没有发送请求，数据是父亲给的 
        Floor标签,通过v-for动态生成
       父子组件通信:props

       问题:VC[Home]身上的floorList这个属性的属性值有几种情况?

       仓库floorList:起始值 空数组
       仓库floorList:不是空数组,代表服务器数据回来了。v-for渲染子组件完毕。给组件的props,就是两个对象
    -->
    <!-- 自定义属性：【属性名:属性值】  props接收属性名-->
    <Floor v-for="(floor,index) in floorList" :key="floor.id"  :floor="floor"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
// 引入其余组件
import Listcontainer from "./Listcontainer";
import Todayrecommend from "./Todayrecommend";
import Rank from "./Rank";
import Like from "./Like";
import Floor from "./Floor";
import Brand from "./Brand";

// 获取仓库数据
import { mapState } from "vuex";

export default {
  name: "Home",
  components: {
    Listcontainer,
    Todayrecommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    // 获取轮播图数据请求
    this.$store.dispatch("getFloorList");
  },
  computed: {
    // 从仓库中拿数据
    ...mapState({
      floorList(state) {
        return state.home.floorList;
      },
    }),
  },
};
</script>

<style>
</style>