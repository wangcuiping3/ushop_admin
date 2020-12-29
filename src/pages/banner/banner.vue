<template>
  <div>
    <!-- 轮播图管理 -->
    <!-- "添加"按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 轮播图列表页 -->
    <banner-list :bannerList="bannerList" @init="init" @edit="edit($event)"></banner-list>
    <!-- 轮播图添加页 -->
    <banner-add :info="info" @init="init" :bannerList="bannerList" ref="add"></banner-add>
  </div>
</template>

<script>
// 引入子组件
import bannerList from "./components/bannerList";
import bannerAdd from "./components/bannerAdd";

import { reqBannerList} from "../../utils/http";
export default {
  // 注册组件
  components: {
    bannerList,
    bannerAdd,
  },
  data() {
    return {
      info: {
        // 控制add出现/隐藏
        isshow: false,
        // 判断点的是"添加"的取消,还是"编辑"取消
        isAdd:true
      },
      // 初始化列表数据
      bannerList: [],
    };
  },
  methods: {
    // 点击'添加'按钮
    willAdd() {
      // add出现
      this.info.isshow = true;
      // isAdd设为true
      this.info.isAdd=true
    },

    // 数据发生改变 就重新获取列表数据 刷新页面
    init() {
      reqBannerList({istree:true}).then((res) => {
        if (res.data.code == 200) {
          this.bannerList=res.data.list
        }
      });
    },
    // 接收list的edit事件
    edit(id){
      // add页面出现
      this.info.isshow=true
      // 传递给add去处理
      this.$refs.add.getOne(id)
      // 点的是编辑
      this.info.isAdd=false
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