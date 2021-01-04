<template>
  <div class="login">
    <!-- login -->
    <div class="con">
      <h3>登录</h3>
      <!-- 属性说明: clearable:可点×号清空;show-password:小眼睛 -->
      <!-- 验证user中的数据, 规则rules -->
      <el-form :model="user" :rules="rules">
        <el-form-item prop="username" class="ipt">
          <el-input
            v-model="user.username"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="ipt">
          <el-input
            v-model="user.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="toLogin" class="btn">登录</el-button>
    </div>
  </div>
</template>

<script>
import { reqManageLogin } from "../../utils/http";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      //规则
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3,max: 10,message: "长度在 3 到 10 个字符",trigger: "blur",},
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),

    toLogin() {
      reqManageLogin(this.user).then((res) => {
        if (res.data.code == 200) {
          // 将用户信息存到仓库
          this.changeUser(res.data.list);
          // 跳转页面
          this.$router.push("/");
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #553444, #423a52, #303d5f);
  text-align: center;
}
.con {
  width: 400px;
  background: #fff;
  border-radius: 20px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
}
.login h3 {
  font-size: 20px;
}
.login .ipt {
  margin: 20px;
}
.btn {
  width: 360px;
}
</style>