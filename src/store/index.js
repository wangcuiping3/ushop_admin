import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

// 引入
import {actions} from "./actions"
import {state,getters,mutations} from "./mutations"
// 引入对应的模块文件
import specs from "./modules/specs"

// 导出
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        // 注册
        specs
    }
})