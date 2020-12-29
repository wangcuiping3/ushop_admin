<template>
  <div>
    <!-- 管理员管理列表 -->
    <el-table
      :data="manageList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children'}"
    >
      <el-table-column prop="id" label="用户编号" width="80">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="所属角色"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" size="mini" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
          <!-- 使用封装的删除按钮 -->
          <del-btn @realDel="del(scope.row.uid)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {reqManageDel} from "../../../utils/http"
import {successAlert} from "../../../utils/myAlert"
export default {
    props:["manageList"],
  data() {
    return {
     
    };
  },
  methods:{
      del(uid){
          reqManageDel({uid:uid}).then(res=>{
              if(res.data.code==200){
                //   弹成功消息
                successAlert(res.data.msg)
                // 通知父组件刷新列表页面
                this.$emit("init")
              }
          })
      },
    //   点了""编辑"按钮
      edit(uid){
        //   通知父组件
          this.$emit("edit",uid)
      }
  }
 
};
</script>

<style>
</style>