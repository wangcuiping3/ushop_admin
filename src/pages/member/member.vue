<template>
  <div>
    <!-- 会员管理 -->

    <!-- 会员列表页 -->
    <member-list :memberList="memberList" @init="init" @edit="edit($event)"></member-list>
    <!-- 会员编辑页 -->
    <member-edit :info="info" @init="init" :memberList="memberList" ref="edit"></member-edit>
  </div>
</template>

<script>
// 引入子组件
import memberList from "./components/memberList";
import memberEdit from "./components/memberEdit";

import { reqMemberList, reqMemberTotal } from "../../utils/http";
export default {
  // 注册组件
  components: {
    memberList,
    memberEdit,
  },
  data() {
    return {
      info: {
        // 控制edit页面的出现/隐藏
        isshow: false,
        // "编辑"取消
        isAdd:true
      },
      // 初始化列表数据
      memberList: [],
    };
  },
  methods: {
    init() {
     reqMemberList({size:this.pageSize,page:this.page}).then((res) => {
        if (res.data.code == 200) {
          this.memberList=res.data.list
        }
      });
    },
    // 接收list的edit事件
    edit(uid){
      // add页面出现
      this.info.isshow=true
      // 传递给add去处理
      this.$refs.edit.getOne(uid)
      // 点的是编辑
      this.info.isAdd=true
    }
  },
  mounted() {
    // 页面一加载,就获取数据
    this.init()
  },
};
</script>

<style>
</style>