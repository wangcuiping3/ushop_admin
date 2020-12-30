import {reqCateList} from "../../utils/http"
// 数据
let state={
    //初始化分类列表数据
    cateList:[]
}
// 方法
let mutations={
    //数据改变
    changeList(state,arr){
        state.cateList=arr;
    }
}
// 修改state中的数据,并导出
let getters={
    cateList(state){
        return state.cateList;
    }
}
let actions={
    // 3.4 处理list的逻辑
    reqList(context){
        //发请求 成功之后 修改
        reqCateList({istree:true}).then(res=>{
            if(res.data.code==200){
                context.commit("changeList",res.data.list)
            }
        })
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    //命名空间
    namespaced:true
}