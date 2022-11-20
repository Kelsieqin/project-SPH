// ShopCart组件的小仓库
// 引入请求API
import { reqCartList,reqDeleteCartById } from "@/api";
const state = {
    cartList:[],

};
const actions = {
    // 获取购物车列表数据
    async getCartList({commit}){
        let result = await reqCartList();
        // 检查数据是否得到 - 派发action
        // console.log(result);
        if(result.code == 200){
            commit('GETCARTLIST',result.data)
        }
    },
    // 删除购物车中的一个商品
    async deleteCartBySkuId({commit},skuId){
        let result = await reqDeleteCartById(skuId);
        // 返回成功或者失败
        if(result.code == 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('fail'))
        }
    }
};
const mutations = {
    // 获得购物车数据
    GETCARTLIST(state,cartList){
        state.cartList = cartList;
    }
};
// 简化数据
const getters = {
    // 数组中的第一项，不是购物车数据
    cartList(state){
        return state.cartList[0] || {}
    },

};
export default {
    state,
    actions,
    mutations,
    getters
}