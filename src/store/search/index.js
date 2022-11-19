// Search组件的小仓库
// 引入请求API
import { reqSearchList,reqGoodsInfo } from '@/api'


const state = {
    // 搜索数据。形式需要参考后台返回数据形式，不能随便设置
    searchList: {},
    // 产品数据
    goodsInfo:{},
};
const actions = {
    // 所有商品详情数据请求接口  - 解构对象
    async getCategoryList({ commit }, searchparams) {
        // 注意该函数的参数至少为一个空对象
        let result = await reqSearchList(searchparams);
        if (result.code == 200) {
            commit('GETCATEGORYLIST', result.data)
        }
    },

    // 展示某个产品详情信息 
    async getGoodsInfo({commit},goodsId){
        let result = await reqGoodsInfo(goodsId);
        if(result.code == 200){
            commit('GETGOODSINFO', result.data)
        }
    }
};
const mutations = {
    // 修改搜索数据
    GETCATEGORYLIST(state, searchList) {
        state.searchList = searchList;
    },
    // 修改产品数据
    GETGOODSINFO(state,goodsInfo){
        state.goodsInfo = goodsInfo;

    }
};

// 简化数据
const getters = {
    // 仓库中存储数据格式：
    /* "trademarkList":[],
        "attrsList":[],
        "goodsList":[],
        "total":78,
        "pageSize":3,
        "pageNo":1,
        "totalPages":26 */

    // 商品列表 
    goodsList(state) {
        // 注意getter中的数据是该仓库中的数据，不用区别大小仓库
        return state.searchList.goodsList;
    },
    // 品牌列表 
    trademarkList(state) {
        // 注意getter中的数据是该仓库中的数据，不用区别大小仓库
        return state.searchList.trademarkList;
    },
    // 品牌属性列表 
    attrsList(state) {
        // 注意getter中的数据是该仓库中的数据，不用区别大小仓库
        return state.searchList.attrsList;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
}