<template>
  <div class="login">
    <!-- login -->
    <div class="con">
      <h3>登录</h3>
      <!-- clearable:可点×号清空;show-password:小眼睛 -->
      <div class="ipt">
        <el-input v-model="user.name" placeholder="请输入用户名" clearable></el-input>
      </div>
      <div class="ipt">
        <el-input v-model="user.password" placeholder="请输入密码" show-password></el-input>
      </div>
      <el-button type="primary" @click="toLogin" class="btn">登录</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      user:{
        name:"",
        password:""
      }
    }
  },
  methods:{
    toLogin(){
      this.$router.push("/")
    }
  }
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
.btn{
  width: 360px;
}
</style>