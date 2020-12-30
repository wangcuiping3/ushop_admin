<template>
  <div>
    <!-- 商品分类 -->
    <!-- "添加"按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 管理员列表页 -->
    <cate-list @edit="edit($event)"></cate-list>
    <!-- 管理员添加页 -->
    <cate-add :info="info" ref="add"></cate-add>
  </div>
</template>

<script>
// 引入子组件
import cateList from "./components/cateList";
import cateAdd from "./components/cateAdd";

import { reqCateList } from "../../utils/http";
export default {
  // 注册组件
  components: {
    cateList,
    cateAdd,
  },
  data() {
    return {
      info: {
        // 控制add出现/隐藏
        isshow: false,
        // 判断点的是"添加"的取消,还是"编辑"取消
        isAdd: true,
      },
    };
  },
  methods: {
    // 点击'添加'按钮
    willAdd() {
      // add出现
      this.info.isshow = true;
      // isAdd设为true
      this.info.isAdd = true;
    },

    // 接收list的edit事件
    edit(id) {
      // add页面出现
      this.info.isshow = true;
      // 传递给add去处理
      this.$refs.add.getOne(id);
      // 点的是编辑
      this.info.isAdd = false;
    },
  },
};
</script>

<style>
</style>