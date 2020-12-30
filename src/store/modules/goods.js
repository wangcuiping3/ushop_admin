import { reqGoodsTotal,reqGoodsList } from "../../utils/http";

let state={
    //列表
    goodsList:[],
    //总数
    total:0,
    //一页的数量
    size:2,
    //当前的页码
    page:1
}
let mutations={
    changeList(state,arr){
        state.goodsList=arr;
    },
    changeTotal(state,num){
        state.total=num
    },
    changePage(state,num){
        state.page=num
    }
}
let getters={
    goodsList(state){
        return state.goodsList
    },
    total(state){
        return state.total
    },
    size(state){
        return state.size
    }
}
let actions={
    //获取list的action
    reqList(context,bool){
        //"商品规格"页面中的数据是要分页展示的;"商品管理"中"add"页面中的规格数据是不要分页的。用第二个参数bool区分;bool是true,就要全部数据；false，就做分页
        let params=bool?{}:{page:context.state.page,size:context.state.size}
        
        //发列表的请求
        reqGoodsList(params).then(res=>{
            if(res.data.code==200){
                //删除的是最后一页的最后一条
                if(res.data.list.length===0&&context.state.page>1){
                    context.commit("changePage",context.state.page-1)
                    context.dispatch("reqList")
                    return;
                }

                //修改列表数据
                context.commit("changeList",res.data.list)
            }
        })
    },
    //获取总数
    reqTotal(context){
        reqGoodsTotal().then(res=>{
            if(res.data.code==200){
                context.commit("changeTotal",res.data.list[0].total)
            }
        })
    },
    //修改page
    changePage(context,num){
        //修改页码
        context.commit("changePage",num)
        //重新请求list
        context.dispatch("reqList")
    }
}

export default {
    state,
    mutations,
    getters,
    actions,
    // 命名空间
    namespaced:true
}