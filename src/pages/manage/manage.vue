<template>
  <div>
    <!-- 管理员管理 -->
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 管理员列表页 -->
    <manage-list :manageList="manageList" @init="init" @edit="edit($event)"></manage-list>
    <!-- 管理员添加页 -->
    <manage-add :info="info" @init="init" :manageList="manageList" ref="add"></manage-add>

    <!-- 列表的分页 -->
    <!-- current-change	currentPage 改变时会触发 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
// 引入子组件
import manageList from "./components/manageList";
import manageAdd from "./components/manageAdd";

import { reqManageList, reqManageTotal } from "../../utils/http";
export default {
  // 注册组件
  components: {
    manageList,
    manageAdd,
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
      manageList: [],

      // 数据总数量
      total: 0,
      // 一页展示的数据
      pageSize: 2,
      // 当前页码
      page: 1,
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
    // 获取总数
    getTotal() {
      reqManageTotal().then((res) => {
        this.total = res.data.list[0].total;
      });
    },
    // 数据发生改变 就重新获取列表数据 刷新页面
    getManageList() {
      reqManageList({size:this.pageSize,page:this.page}).then((res) => {
        if (res.data.code == 200) {
          // 如果删除了最后一页的最后一条数据,则当前页就是[],并且如果还有上一页,就展示上一页的数据
          if(res.data.list.length==0&&this.page>0){
            // 页码减少
            this.page--
            // 重新获取数据
            this.getManageList()
          }
          this.manageList=res.data.list
        }
      });
    },
    // 点击页码 发生改变
    changePage(ev){
      // console.log(ev);
      this.page=ev
      // 页码改变,重新获取列表数据
      this.getManageList()
    },
    //获取总数和列表数据封装调用
    init() {
      this.getTotal();
      this.getManageList();
    },
    // 接收list的edit事件
    edit(uid){
      // add页面出现
      this.info.isshow=true
      // 传递给add去处理
      this.$refs.add.getOne(uid)
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