// 路由配置信息

// 引入路由组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'

export default [
    {
        path:'/home',
        component:Home,
        meta:{show:true}

    },
    {
        // params参数要占位, ? 解决不传param参数问题
        path:'/search/:keyword?',
        component:Search,
        meta:{show:true},
        // 命名路由
        name:'search',
        // props接收参数传递给组件
        // 1.对象写法----只能传递额外参数，不能传递query和params
        // props:{
        //    a:1,
        //    b:2
        // }
        // 2.布尔值写法----只能传递params参数
        // props:true
        // 3.函数写法----通过接收到的$route可以同时传递params参数和query参数，组件以props方式接收；
        props(route){
            return {
                keyword: route.params.keyword,
            }
        }
    },
    {
        path:'/login',
        component:Login,
        // 设置元信息控制Footer组件是否出现
        meta:{show:false}
    },
    {
        path:'/register',
        component:Register,
        meta:{show:false}
    },
    {
        //一上来，重定向到首页
        path: '/',
        redirect: '/home'
    },
    {
        // 商品详情页面路由
        path:'/detail/:stuId?',
        component:Detail,
        meta:{show:true}

    },
]