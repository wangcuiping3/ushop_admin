<template>
  <div>
    <!-- 角色添加 -->
    <!-- 点击叉号或者蒙版自己,也清空数据 用closed事件 -->
    <el-dialog
      :title="info.isAdd ? '角色添加' : '角色修改'"
      :visible.sync="info.isshow"
      @closed="cancel"
    >
      <el-form :model="user">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 角色权限 树形控件 -->
        <el-form-item label="角色权限" label-width="100px">
          <el-tree
            :data="menuList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="状态" label-width="100px">
          <el-switch
            v-model="user.status"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- 验证数据 -->
      {{ user }}
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add(user)" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入
import {
  reqMenuList,
  reqRoleAdd,
  reqRoleEdit,
  reqRoleUpdate,
} from "../../../utils/http";
import { mapActions, mapGetters } from "vuex";
import { successAlert ,errorAlert} from "../../../utils/myAlert";
export default {
  // 接收父组件传过来的值
  props: ["info"],

  // 属性 变量
  data() {
    return {
      //整页的数据
      user: {
        rolename: "", //角色名称
        menus: "", //角色权限 id数组;'[2,3,4]' 字符串数组
        status: 1, //状态,1正常2禁用 number
      },
      // 初始化菜单列表数据--角色权限展示的数据
      menuList: [],
      //角色权限展示数据
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  // 用户信息
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  // 函数
  methods: {
    // 用户信息修改
    ...mapActions({
      changeUser: "changeUser",
    }),
    // 取消按钮 add隐藏
    cancel() {
      // 如果点的是"编辑"里的取消按钮,则清空数据;如果点的是"添加"里的取消,则不作处理
      if (!this.info.isAdd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    // 清空add的数据
    empty() {
      this.user = {
        rolename: "",
        menus: "",
        status: 1,
      };
      // 清空角色权限的数据
      this.$refs.tree.setCheckedKeys([]);
    },
    //add数据验证 封装
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.rolename === "") {
          errorAlert("角色名称不能为空");
          return;
        }
        resolve();
      });
    },
    // 点了添加按钮 请求数据
    add(user) {
      this.checkProps().then(() => {
        // console.log(this.$refs.tree.getCheckedKeys());
        // 先获取到选中的menus的id数组,然后保存到menus中
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());

        // 添加数据请求
        reqRoleAdd(user).then((res) => {
          if (res.data.code == 200) {
            // 弹出操作成功的消息
            successAlert(res.data.msg);
            // 本页面隐藏
            this.cancel();
            // 清空数据
            this.empty();
            // 刷新列表数据
            this.$emit("init");
          }
        });
      });
    },
    // roleList点了编辑->role->roleAdd,获取一条数据,展示
    getOne(id) {
      // 发请求
      reqRoleEdit({ id: id }).then((res) => {
        if (res.data.code === 200) {
          // 获取到的这条数据展示在页面
          this.user = res.data.list;
          // 补id
          this.user.id = id;

          // 把menus的数据展示出来
          this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));
        }
      });
    },
    // 点击修改按钮
    update() {
      this.checkProps().then(() => {
        //先取出树形控件的数据给menus，再发请求
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        // 请求数据
        reqRoleUpdate(this.user).then((res) => {
          if (res.data.code === 200) {
            // 弹成功消息
            successAlert(res.data.msg);

            //如果修改的角色权限，是当前用户所属的角色，就需要退出登录，重新登录
            if (this.user.id == this.userInfo.roleid) {
              this.changeUser({});
              this.$router.push("/login");
              return;
            }
            // add页面隐藏
            this.cancel();
            // 清空数据
            this.empty();
            // 刷新页面
            this.$emit("init");
          }
        });
      });
    },
  },

  // 页面一加载就获取"菜单列表"数据---"角色权限"展示的数据
  mounted() {
    reqMenuList().then((res) => {
      if (res.data.code === 200) {
        this.menuList = res.data.list;
        // 通知父组件 刷新数据
        this.$emit("init");
      }
    });
  },
};
</script>

<style>
</style>