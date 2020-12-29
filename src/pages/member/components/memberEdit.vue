<template>
  <div>
    <!-- 会员管理添加 -->
    <el-dialog title="会员修改" :visible.sync="info.isshow">
      <el-form :model="user">
        {{ user }}
        <el-form-item label="手机号" label-width="100px">
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="100px">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
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
        
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {reqMemberEdit,reqMemberUpdate } from "../../../utils/http";
import { successAlert } from "../../../utils/myAlert";

export default {
  props: ["info"],

  data() {
    return {
      //  初始化user
      user: {
        nickname: "", //昵称
        phone: "", //手机号
        password:"",//密码
        status: 1, //状态  1正常2禁用 number
      },
    };
  },
  methods: {
    // 点击取消按钮 添加弹框消失
    cancel() {
      // 点"取消" 清空数据;
        this.empty();
     
      this.info.isshow = false;
    },
    //清空数据
    empty() {
      this.user = {
        nickname: "", //昵称
        phone: "", //手机号
        password:"",//密码
        status: 1, //状态  1正常2禁用 number
      };
    },
    
    // 编辑操作,接收父组件传过来的getOne
    getOne(uid){
        reqMemberEdit({uid:uid}).then(res=>{
            if(res.data.code==200){
                // 赋值
                this.user=res.data.list
                // 将密码置为空
                this.user.password = ""
            }
        })
    },
    update(){
        reqMemberUpdate(this.user).then(res=>{
            // 弹成功消息
            successAlert(res.data.msg)
            // 页面隐藏
            this.cancel()
            // 数据清空
            this.empty()
            // 通知父组件 刷新页面
            this.$emit ("init")
        })
    }
  },
  mounted() {
  },
};
</script>

<style>
</style>