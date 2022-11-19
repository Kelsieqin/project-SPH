// 创建项目的路由管理文件
import Vue from 'vue';
import VueRouter from 'vue-router';
// 使用路由
Vue.use(VueRouter);
// 引入路由配置文件
import routes from './routes';

// 路由的push和replace方法重写
// 1. 保存原始push方法
const orginPush = VueRouter.prototype.push;
// 2. 重写
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        // 需要：更改指针指回VueRouter实例对象$router
        // 因为: 当前指针是window,使用原始push方法的前提是，this指向VueRouter的实例对象
        // 方法：使用call方法 | apply（参数为数组）
        orginPush.call(this, location, resolve, reject)
    } else {
        orginPush.call(this, location, () => { }, () => { })
    }
}
const orginReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        orginReplace.call(this, location, resolve, reject)
    } else {
        orginReplace.call(this, location, () => { }, () => { })
    }
}


// 创建并暴露路由
export default new VueRouter({
    // 简写
    routes,
    // 自定义路由切换时页面如何滚动
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        // y:0 表示始终滚动到顶部
        return { y: 0 }
    }
})


