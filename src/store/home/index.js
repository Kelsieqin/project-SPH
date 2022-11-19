// home组件的小仓库

// 引入接口API
import {reqCatagoryList, reqGetBannerList,reqFloorList} from "@/api";

// 数据
const state = {
    // 三级联动数据。 注意数据的类型不能胡写需要根据服务器返回数据类型，数组或者对象
    categoryList:[],
    // Listcontainer中轮播图数据。
    bannerList:[],
    // floor中轮播图数据。
    floorList:[],
};
// 处理异步请求等业务逻辑
const actions = {
    // 三级联动数据请求：通过API接口调用，向服务器发送axios请求
    async categoryList(context){
        // axios请求返回结果是promise对象。需要拿到成果的结果 使用await & async
        let result = await reqCatagoryList();
        // 如果请求数据成功
        if(result.code == 200){
            // 提交数据给mutation处理
            context.commit('CATEGORYLIST',result.data);
        }
        
    },
    // bannerList数据请求：API接口调用，向mock发请求要数据
    async getBannerList(context){
        let result = await reqGetBannerList();
        if(result.code == 200){
            // 提交commit请求
            context.commit('GETBANNERLIST',result.data)
        }
    },
    // floorList数据请求：API接口调用，向mock发请求要数据
    async getFloorList(context){
        let result = await reqFloorList();
        if(result.code == 200){
            // 提交commit请求
            context.commit('GETFLOORLIST',result.data)
        }
    },
};
// 操作数据
const mutations = {
    // 向仓库中写入三级列表数据
    CATEGORYLIST(state,categoryList){
        // 修改数据
        state.categoryList = categoryList;
    },
    // 向仓库中写入轮播图数据
    GETBANNERLIST(state,bannerList){
        state.bannerList = bannerList
    },
    // 向仓库中写入floor轮播图数据
    GETFLOORLIST(state,floorList){
        state.floorList = floorList
    },

};
// 计算属性
const getters = {

};


export default {
    state,
    actions,
    mutations,
    getters
}