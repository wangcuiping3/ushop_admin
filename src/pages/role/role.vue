<template>
  <div>
    <!-- 角色管理页 -->

    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 角色列表页 -->
    <role-list
      :roleList="roleList"
      @init="init"
      @edit="edit($event)"
    ></role-list>

    <!-- 角色添加页 -->
    <role-add :info="info" @init="init" ref="roleAdd"></role-add>
  </div>
</template>

<script>
// 引入子组件
import roleList from "./components/roleList";
import roleAdd from "./components/roleAdd";
// 引入http请求
import { reqRoleList } from "../../utils/http";
export default {
  components: {
    // 注册子组件
    roleList,
    roleAdd,
  },
  data() {
    return {
      info: {
        // 角色添加页的显示/隐藏
        isshow: false,
        // 点的是添加/编辑按钮,默认true是添加按钮
        isAdd: true,
      },
      // 初始化角色列表数据
      roleList: [],
    };
  },
  methods: {
    // 点击添加按钮
    willAdd() {
      // 添加页显示
      this.info.isshow = true;

      // 点了添加按钮,标题是"角色添加""
      this.info.isAdd = true;
    },
    // 封装获取列表数据的函数
    init() {
      reqRoleList().then((res) => {
        if (res.data.code === 200) {
          this.roleList = res.data.list;
        }
      });
    },
    // list页点了编辑按钮,通知给父组件, 父组件通知menuAdd获取数据
    edit(id) {
      // 显示add页面
      this.info.isshow = true;
      // 通知子组件获取数据
      this.$refs.roleAdd.getOne(id);

      // 点的是"编辑"按钮, 则下面显示"修改"按钮
      this.info.isAdd = false;
    },
  },
  // 页面一加载就获取角色列表数据
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>