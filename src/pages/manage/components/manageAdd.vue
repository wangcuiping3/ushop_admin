<template>
  <div>
    <!-- 管理员管理添加 -->
    <el-dialog
      :title="info.isAdd ? '用户添加' : '用户修改'"
      :visible.sync="info.isshow"
      @closed="cancel"
    >
      <el-form :model="user">
        {{ user }}
        <el-form-item label="所属角色" label-width="100px">
          <el-select v-model="user.roleid">
            <el-option label="请选择" value="" disabled></el-option>
            <!-- 循环遍历"所属角色"展示内容 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" label-width="100px">
          <!-- active-value 1 正常;inactive-value 2 禁用;number类型 -->
          <el-switch
            v-model="user.status"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.isAdd" @click="add"
          >添 加</el-button
        >
        <el-button type="primary" v-else @click="updata">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqRoleList,
  reqManageAdd,
  reqManageEdit,
  reqManageUpdate,
} from "../../../utils/http";
import { successAlert,errorAlert } from "../../../utils/myAlert";

export default {
  props: ["info", "manageList"],

  data() {
    return {
      //  初始化user
      user: {
        roleid: "", //角色编号 number
        username: "", //管理员名称
        password: "", //密码
        status: 1, //状态  1正常2禁用 number
      },
      //   初始化角色列表roleList
      roleList: [],
    };
  },
  methods: {
    // 点击取消按钮 添加弹框消失
    cancel() {
      // 如果点的是"编辑"里的取消按钮,则清空数据;
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //清空数据
    empty() {
      this.user = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    //add数据验证 封装
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.roleid === "") {
          errorAlert("所属角色不能为空");
          return;
        }

        if (this.user.username === "") {
          errorAlert("用户名不能为空");
          return;
        }
        if (this.user.password === "") {
          errorAlert("密码不能为空");
          return;
        }
        resolve();
      });
    },

    //   添加了
    add() {
      this.checkProps().then(() => {
        reqManageAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            //   弹成功的消息
            successAlert(res.data.msg);
            //   清空数据
            this.empty();
            //   add页面隐藏
            this.cancel();
            //通知父组件,刷新页面
            this.$emit("init");
          }
        });
      });
    },
    // 编辑操作,接收父组件传过来的getOne
    getOne(uid) {
      reqManageEdit({ uid: uid }).then((res) => {
        if (res.data.code == 200) {
          // 赋值
          this.user = res.data.list;
          // 将密码置为空
          this.user.password = "";
        }
      });
    },
    updata() {
      this.checkProps().then(() => {
        reqManageUpdate(this.user).then((res) => {
          // 弹成功消息
          successAlert(res.data.msg);
          // 页面隐藏
          this.cancel();
          // 数据清空
          this.empty();
          // 通知父组件 刷新页面
          this.$emit("init");
        });
      });
    },
  },
  mounted() {
    //   页面一加载就获取角色列表数据,展示到"所属角色"
    reqRoleList().then((res) => {
      if (res.data.code == 200) {
        this.roleList = res.data.list;
      }
    });
  },
};
</script>

<style>
</style>