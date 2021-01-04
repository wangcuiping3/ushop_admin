export let state = {
    // 判断, 如果本地存储有值就用本地存储的值
    userInfo: sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")) : {}
}
export let getters = {
    userInfo(state) {
        return state.userInfo
    }
}
export let mutations = {
    changeUserInfo(state, obj) {
        state.userInfo = obj;
        //同步到本地存储
        if (obj.username) {//userInfo有值就存值
            sessionStorage.setItem("userInfo", JSON.stringify(obj))
        } else {//否则就删除userInfo(退出登录)
            sessionStorage.removeItem("userInfo")
        }

    }
}