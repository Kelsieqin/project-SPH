// 管理所有api接口
import requests from "./ajax";
// 引入mock ajax请求
import mockRequests from './mockAjax'

// 三级联动接口
// /api/product/getBaseCategoryList Get 无参数
export const reqCatagoryList = ()=>{
    // 发请求 返回promise对象
    return requests.get('/product/getBaseCategoryList')
}


// banner轮播图接口 -- 从mock获取数据
export const reqGetBannerList = ()=>{
    return mockRequests.get('/banner')
}
// floor轮播图接口 -- 从mock获取数据
export const reqFloorList = ()=>{
    return mockRequests.get('/floor')
}


// 商品详情数据请求接口 - POST请求 /api/list 参数 
// 注意该函数调用时，参数至少为一个空对象
export const reqSearchList = (data)=>{
    // 对象请求方式
    return requests({
        method: 'post',
        url: '/list',
        data: data,
    })
}

// 产品详情数据接口 - GET /api/item/{skuId} 必须带参数
export const  reqGoodsInfo = (skuId)=>{
    return requests.get(`/item/${skuId}`)
}


// 产品添加购物车 或者 更新产品个数 - POST /api/cart/addToCart/{ skuId }/{ skuNum }  必须带参数
export const reqAddOrUpdateShopCart = (skuId,skuNum)=>{
    return requests({
        method:'post',
        url:`/cart/addToCart/${skuId}/${skuNum}`,
    })
}