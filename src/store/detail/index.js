// Detail组件的小仓库
// 引入请求API
import { reqGoodsInfo } from '@/api'

const state = {
    // 产品数据 不能瞎写，从文档中查看服务器返回的数据是什么类型 - 对象
    goodInfo:{},
};

const actions = {
    // 获取某个产品详情信息 
    async getGoodsInfo({commit},skuId){
        let result = await reqGoodsInfo(skuId);
        if(result.code == 200){
            commit('GETGOODSINFO', result.data)
        }
    }
};

const mutations = {
    // 修改产品数据
    GETGOODSINFO(state,goodInfo){
        state.goodInfo = goodInfo;
    }
};

// 简化数据
const getters = {
    // 路径导航信息
    categoryView(state){
        // 避免获取空对象的属性为undefined，而产生虚假报错。需要追加{}进行处理，这样{}.XXX为undefined不会报错
        return state.goodInfo.categoryView || {}
    },
    // 产品信息
    skuInfo(state){
        return state.goodInfo.skuInfo || {}
    },
    // 产品属性信息
    spuSaleAttrList(state){
        return state.goodInfo.spuSaleAttrList || []
    }
    
};
export default {
    state,
    actions,
    mutations,
    getters
}