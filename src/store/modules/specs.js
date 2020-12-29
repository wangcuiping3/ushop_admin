
// 引入http请求
import {reqSpecsList} from "../../utils/http"
// 数据
let state={
    // 列表数据
    specsList:[],
    // 数据总数
    total:0,
    // 当前页码
    page:1,
    // 每一页的条数
    size:2

}
// 方法
let mutations={
    // 获取列表
    changeSpecsList(state,arr){
        state.specsList=arr
    },
    // 获取总数
    getTotall(state,num){
        state.total=num
    },
    // 页码改变
    changePage(state,pageNum){
        state.page=pageNum
    }

}
// 修改state中的数据
let getters={
    specsList(state){
        return state.specsList
    },
    total(state){
        return state.total
    },
    size(state){
        return state.size
    }
}
// 处理异步 、处理逻辑
let actions={
    // 一进页面就获取列表数据
    reqList(context){
        reqSpecsList().then(res=>{
            if(res.data.code==200){
                // ---------------------------
            }
        })
    }

}

// 导出
export default{
    state,
    mutations,
    getters,
    actions,
    // 命名空间 是否使用原来的名字
    namespaced:true
}