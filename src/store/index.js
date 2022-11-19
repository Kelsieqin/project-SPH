import Vue  from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// 引入小仓库
import home from './home'
import search from './search'
import detail from './detail'
// vuex模块式开发
export default new Vuex.Store({
    // 注册模块
    modules:{
        home,
        search,
        detail
    }

})