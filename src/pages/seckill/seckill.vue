<template>
  <div class="seckill">
    <!-- 菜单管理页 -->
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 菜单列表 -->
    <!-- 子传父的edit事件, 参数是子组件的scope.row.id,$event获取 -->
    <seckill-list :seckillList="seckillList" @init="init" @edit="edit($event)"></seckill-list>
    <!-- 菜单添加 弹框 -->
    <!-- 子传父 init 刷新列表 -->
    <seckill-add :info="info" @init="init" :seckillList="seckillList" ref="seckillAdd"></seckill-add>
  </div>
</template>

<script>
// 引入菜单管理的两个组件
import seckillList from "./components/seckilllist";
import seckillAdd from "./components/seckilladd";
// 引入http请求
import { reqSeckillList } from "../../utils/http";

export default {
  /// 注册组件
  components: {
    seckillList,
    seckillAdd,
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
      seckillList: [],
    };
  },
  methods: {
    // 点击添加按钮 seckilllist出现
    willAdd() {
      this.info.isshow = true;

      // 点的是添加按钮,设为true
      this.info.isadd=true
    },
    // 获取列表数据封装
    init() {
      reqSeckillList().then((res) => {
        if (res.data.code == 200) {
          this.seckillList = res.data.list;
        }
      });
    },
    // 子传父的edit事件
    edit(id){
      //seckilladd出现
      this.info.isshow = true
      // 父组件通知seckilladd请求数据,传递id参数
      this.$refs.seckillAdd.getone(id)
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