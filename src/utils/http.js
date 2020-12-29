import axios from "axios"
import qs from "qs"
import Vue from "vue"
// 引入封装的消息弹框
import { errorAlert } from "../utils/myAlert"

// 开发环境使用 8080 
let baseUrl = "/api"
Vue.prototype.$pre = "http://localhost:3000"

// 生产环境使用(打包) 3000
// let baseUrl = ""
// Vue.prototype.$pro = ""

// 响应拦截
axios.interceptors.response.use(res => {
    // 统一处理数据失败的弹框
    if (res.data.code !== 200) {
        errorAlert(res.data.msg)
    }
    // 统一处理list是null的情况
    if (!res.data.list) { //null为假 取反为真
        res.data.list = []
    }
    console.group("本次请求的地址是:" + res.config.url)
    console.log(res);
    console.groupEnd()
    return res
})

// post 带有文件，参数转换
function dataToFormData(user){
    let data=new FormData()
    for(let i in user){
        data.append(i,user[i])
    }
    return data
}

/* ---------------------------------- 菜单管理 ------------------------------ */
// 菜单添加 发送数据
export const reqMenuAdd = (user) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data: qs.stringify(user)
    })

}

// 获取菜单列表数据
export const reqMenuList = () => {
    return axios({
        url: baseUrl + "/api/menulist",
        method: "get",
        params: {
            istree: true
        }
    })
}

// 菜单删除 
export const reqMenuDel = (obj) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify(obj)
    })
}

// 点击编辑按钮 获取某一条数据,展示到menuadd中
export const reqMuneEdit = (obj) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: "get",
        params: obj
    })
}

// 菜单修改
export const reqMenuUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data: qs.stringify(user)
    })
}
/* -------------------------- 角色管理 --------------------------------------- */
// 角色添加 发送数据
export const reqRoleAdd = (user) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: "post",
        data: qs.stringify(user)
    })
}

//  获取角色列表 
export const reqRoleList = () => {
    return axios({
        url: baseUrl + "/api/rolelist",
        method: "get"
    })
}
//  角色列表删除 
export const reqRoleDel = (obj) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data: qs.stringify(obj)
    })
}

//  角色列表点编辑,获取一条数据展示 
export const reqRoleEdit = (obj) => {
    return axios({
        url: baseUrl + "/api/roleinfo",
        method: "get",
        params: obj
    })
}

// 角色修改
export const reqRoleUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/roleedit",
        method: "post",
        data: qs.stringify(user)
    })
}
/* ------------------- 管理员管理 ----------------- */
// 管理员添加 发送数据
export const reqManageAdd = (user) => {
    return axios({
        url: baseUrl + "/api/useradd",
        method: "post",
        data: qs.stringify(user)
    })
}
//  获取管理员总数（用于计算分页）
export const reqManageTotal = () => {
    return axios({
        url: baseUrl + "/api/usercount",
        method: "get"
    })
}
//  获取管理员列表（分页）{size:查询条数,page:页码数}
export const reqManageList = (obj) => {
    return axios({
        url: baseUrl + "/api/userlist",
        method: "get",
        params: obj
    })
}
//  管理员列表点编辑,获取一条数据展示
//  {uid:用户编号【唯一编号，不是主键】}
export const reqManageEdit = (obj) => {
    return axios({
        url: baseUrl + "/api/userinfo",
        method: "get",
        params: obj
    })
}
// 管理员修改 补uid;user={uid:"必填"}
export const reqManageUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/useredit",
        method: "post",
        data: qs.stringify(user)
    })
}
//  管理员列表删除 {uid:用户编号}
export const reqManageDel = (obj) => {
    return axios({
        url: baseUrl + "/api/userdelete",
        method: "post",
        data: qs.stringify(obj)
    })
}
// 管理员登录 {username:用户名,password:密码}
export const reqManageLogin = (user) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data: qs.stringify(user)
    })
}

/* --------------------------------- 商品分类管理 ----------------------------- */
// 添加 
export const reqCateAdd = (user) => {
    return axios({
        url: baseUrl + "/api/cateadd",
        method: "post",
        data: dataToFormData(user)
    })
}

//  获取分类列表  {istree:是否需要返回树形结构;pid}
export const reqCateList = (p) => {
    return axios({
        url: baseUrl + "/api/catelist",
        method: "get",
        params:p
    })
}
//  列表删除 {id:id}
export const reqCateDel = (obj) => {
    return axios({
        url: baseUrl + "/api/catedelete",
        method: "post",
        data: qs.stringify(obj)
    })
}

//  列表点编辑,获取一条数据展示  {id:id}
export const reqCateEdit = (obj) => {
    return axios({
        url: baseUrl + "/api/cateinfo",
        method: "get",
        params: obj
    })
}

// 修改 user={id:"必填",img:file,catename:""}
export const reqCateUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/cateedit",
        method: "post",
        data: dataToFormData(user)
    })
}

/* ------------------------------------ 商品规格管理 ------------------------- */
// 添加 发送数据
export const reqSpecsAdd = (user) => {
    return axios({
        url: baseUrl + "/api/specsadd",
        method: "post",
        data: qs.stringify(user)
    })
}
//  获取总数（用于计算分页）
export const reqSpecsTotal = () => {
    return axios({
        url: baseUrl + "/api/specscount",
        method: "get"
    })
}
//  获取列表（分页）{size:查询条数,page:页码数}
export const reqSpecsList = (obj) => {
    return axios({
        url: baseUrl + "/api/specslist",
        method: "get",
        params: obj
    })
}
//  列表点编辑,获取一条数据展示
//  {id:规格编号}
export const reqSpecsEdit = (obj) => {
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "get",
        params: obj
    })
}
// 修改 补id; {id:"必填"}
export const reqSpecsUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data: qs.stringify(user)
    })
}
//  列表删除 {id:规格编号}
export const reqSpecsDel = (obj) => {
    return axios({
        url: baseUrl + "/api/specsdelete",
        method: "post",
        data: qs.stringify(obj)
    })
}

/* ------------------------------------- 商品管理 --------------------------- */


/* ------------------------------------- 会员管理 --------------------------- */

//  获取列表
export const reqMemberList = () => {
    return axios({
        url: baseUrl + "/api/memberlist",
        method: "get"
    })
}
//  列表点编辑,获取一条数据展示 {uid:用户编号}
export const reqMemberEdit = (obj) => {
    return axios({
        url: baseUrl + "/api/memberinfo",
        method: "get",
        params: obj
    })
}
// 修改 补uid; {uid:会员编号，必填项}
export const reqMemberUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/memberedit",
        method: "post",
        data: qs.stringify(user)
    })
}

/* -------------------------------- 轮播图管理 -------------------------- */
// 添加 
export const reqBannerAdd = (user) => {
    return axios({
        url: baseUrl + "/api/banneradd",
        method: "post",
        data: dataToFormData(user)
    })
}

//  获取分类列表  {istree:是否需要返回树形结构;pid}
export const reqBannerList = (p) => {
    return axios({
        url: baseUrl + "/api/bannerlist",
        method: "get",
        params:p
    })
}
//  列表删除 {id:id}
export const reqBannerDel = (obj) => {
    return axios({
        url: baseUrl + "/api/bannerdelete",
        method: "post",
        data: qs.stringify(obj)
    })
}

//  列表点编辑,获取一条数据展示  {id:id}
export const reqBannerEdit = (obj) => {
    return axios({
        url: baseUrl + "/api/bannerinfo",
        method: "get",
        params: obj
    })
}

// 修改 user={id:"必填",img:file,catename:""}
export const reqBannerUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/banneredit",
        method: "post",
        data: dataToFormData(user)
    })
}


/* ------------------- 限时秒杀管理 ----------------- */
