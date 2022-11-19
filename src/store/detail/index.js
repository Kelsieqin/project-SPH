// Detail组件的小仓库
// 引入请求API
import { reqGoodsInfo , reqAddOrUpdateShopCart} from '@/api'

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
    },
    // 产品添加到购物车
    async addOrUpdateShopCart({commit},{skuId,skuNum}){
        // 加入购物车后（发请求），前台将参数带给服务器
        // 服务器写入数据成功，并没有返回其他数据，只是返回code=200成功。
        // 因为没有返回数据，所以不需要存储数据
        let result = await reqAddOrUpdateShopCart(skuId,skuNum);
        // 该函数返回一个promise
        // 为了在组件中可以拿到成功或者失败的回调，这里需要进行成功或者失败的处理
        if(result.code = 200){
            // 非空字符串表示 成功
            return "ok";
        }else{
            // 失败
            return Promise.reject(new Error('fail'));
        }
    },
};

const mutations = {
    // 修改产品数据
    GETGOODSINFO(state,goodInfo){
        state.goodInfo = goodInfo;
    },
    // 产品添加到购物车
//     ADDSHOPCART(state,shop){
//         state.
//     }
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