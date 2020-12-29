
import Vue from "vue"
// 创建一个vue实例
let vm = new Vue()

// 成功的消息弹框
export let successAlert = (msg) => {
    vm.$message({
        message: msg,
        type: 'success'
    });
}
// 错误的消息弹框
export let errorAlert = (msg) => {
    vm.$message({
        message: msg,
        type: 'warning'
    });
}