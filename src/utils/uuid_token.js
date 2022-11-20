import {v4 as uuid4} from 'uuid'

// 游客身份生成： 1. 一旦生成，不能在变 2.永久存储
export const getUUID = ()=>{
    // 查看本地存储中是否有uuid
    let uuid_token = localStorage.getItem('UUIDTOKEN');
    // 如果没有
    if(!uuid_token){
        // 生成uuid
        uuid_token = uuid4();
        // 并且存储到本地
        localStorage.setItem('UUIDTOKEN',uuid_token)
    }
    // 切记有返回值
    return uuid_token
}