// axios二次封装
import axios from 'axios';
// 引入进度条
import nprogress from 'nprogress';
// 引入进度条样式
import "nprogress/nprogress.css"
// 引入大仓库
import store from '@/store'

// 创造一个axios复制对象
let requests = axios.create({
    // 基础地址
    baseURL:'/api',
    timeout:5000
})

// 请求拦截器
requests.interceptors.request.use((config)=>{

    // 向服务器发送用户临时身份: 检查uuid
    if(store.state.detail.uuid_token){
        // 配置请求头，添加一个字段（与后台协商好userTempId）
        config.headers.userTempId = store.state.detail.uuid_token;
    }

    // 进度条开始
    nprogress.start();
    // config配置项： 其中的请求头headers属性很重要
    return config
})

// 响应拦截器
requests.interceptors.response.use((res)=>{
    // 进度条完成
    nprogress.done();
    // 服务器成功回调：检测到结果，可以做一些事情
    return res.data
},(err)=>{
    // 服务器失败回调：终止promise链等等
    // 终止promise链
    return Promise.reject(new Error('fail'));

})

// 暴露requests
export default requests;