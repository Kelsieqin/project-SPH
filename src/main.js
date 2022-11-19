import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router'
// 引入三级联动----全局组件（放在components文件夹）
import Typenav from '@/components/Typenav'
// 引入轮播图 --- 全局组件
import Carousel from '@/components/Carousel'
// 引入分页器 --- 全局组件
import Pagination from '@/components/Pagination'
// 注册全局组件：第一个参数全局组件的名字，第二个参数是组件
Vue.component(Typenav.name,Typenav)
Vue.component(Carousel.name,Carousel)
Vue.component(Pagination.name,Pagination)


// 引入store
import store  from '@/store'
// 引入MockServer虚拟数据 -- 执行一次， 模拟数据
import '@/mock/mockServe'
// 引入swiper样式（css）
import 'swiper/dist/css/swiper.css'

// 测试三级联动axios发请求
// import {reqCatagoryList} from '@/api'
// reqCatagoryList();


Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  // 注册路由 :组件获得$route $router属性
  router,
  // 注册store： 组件获得$store属性
  store,
  // 注册全局总线
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#app')
