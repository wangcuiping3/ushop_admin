
// 引入http请求
import { reqSpecsList, reqSpecsTotal } from "../../utils/http"
// 数据
let state = {
    // 列表数据
    specsList: [],
    // 数据总数
    total: 0,
    // 当前页码
    page: 1,
    // 每一页的条数
    size: 2

}
// 方法
let mutations = {
    // 获取列表
    changeSpecsList(state, arr) {
        state.specsList = arr
    },
    // 获取总数
    changeTotal(state, num) {
        state.total = num
    },
    // 点击页码 发生改变
    changePage(state, num) {
        state.page = num
    }

}
// 修改state中的数据
let getters = {
    // 列表数据
    specsList(state) {
        return state.specsList
    },
    // 总数
    total(state) {
        return state.total
    },
    // 每一页的条数
    size(state) {
        return state.size
    }
}
// 处理异步 、处理逻辑
let actions = {
    // 一进页面就获取列表数据
    reqList(context,bool) {
          //"商品规格"页面中的数据是要分页展示的;"商品管理"中"add"页面中的规格数据是不要分页的。用第二个参数bool区分;bool是true,就要全部数据；false，就做分页
        let params = bool ? {} : { page: context.state.page, size: context.state.size }

        // 请求列表数据
        reqSpecsList(params).then(res => {
            if (res.data.code == 200) {
                //删除的是最后一页的最后一条
                if (res.data.list.length === 0 && context.state.page > 1) {
                    context.commit("changePage", context.state.page - 1)
                    context.dispatch("reqList")
                    return;
                }

                //处理列表逻辑
                let specsList = res.data.list

                specsList.forEach(item => {
                    // 判断如果属性没写 
                    if(item.attrs==""){
                        item.attrs="[]" 
                    }
                    item.attrs = JSON.parse(item.attrs)
                })
                //修改list
                context.commit("changeSpecsList", specsList)
            }
        })

    },
    //获取总数
    reqTotal(context){
        reqSpecsTotal().then(res=>{
            if(res.data.code==200){
                context.commit("changeTotal",res.data.list[0].total)
            }
        })
    },
    //页码改变
    changePage(context,num){
        //修改页码
        context.commit("changePage",num)
        //重新请求list
        context.dispatch("reqList")
    }

}

// 导出
export default {
    state,
    mutations,
    getters,
    actions,
    // 命名空间 
    namespaced: true
}