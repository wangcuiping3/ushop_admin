<template>
  <div class="menu">
    <!-- 菜单管理页 -->
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 菜单列表 -->
    <!-- 子传父的edit事件, 参数是子组件的scope.row.id,$event获取 -->
    <menu-list :menuList="menuList" @init="init" @edit="edit($event)"></menu-list>
    <!-- 菜单添加 弹框 -->
    <!-- 子传父 init 刷新列表 -->
    <menu-add :info="info" @init="init" :menuList="menuList" ref="menuAdd"></menu-add>
  </div>
</template>

<script>
// 引入菜单管理的两个组件
import menuList from "./components/menulist";
import menuAdd from "./components/menuadd";
// 引入http请求
import { reqMenuList } from "../../utils/http";

export default {
  /// 注册组件
  components: {
    menuList,
    menuAdd,
  },
  data() {
    return {
      info: {
        // 弹框状态;传递给子组件一个json, 子组件可直接修改父组件的isshow
        isshow: false,
        // 标识是点的添加还是编辑按钮,默认是添加按钮
        isadd:true
      },
      // 初始化菜单列表数据
      menuList: [],
    };
  },
  methods: {
    // 点击添加按钮 menulist出现
    willAdd() {
      this.info.isshow = true;

      // 点的是添加按钮,设为true
      this.info.isadd=true
    },
    // 获取列表数据封装
    init() {
      reqMenuList().then((res) => {
        if (res.data.code == 200) {
          this.menuList = res.data.list;
        }
      });
    },
    // 子传父的edit事件
    edit(id){
      //menuadd出现
      this.info.isshow = true
      // 父组件通知menuadd请求数据,传递id参数
      this.$refs.menuAdd.getone(id)
      //点的是编辑按钮,设为false
      this.info.isadd=false
    }
  },
  mounted() {
    // 页面一加载 就获取列表数据,调用init
    this.init()

  },
};
</script>

<style scoped>

</style>