<template>
  <div>
    <!-- 会员管理列表 -->
    <el-table
      :data="memberList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children'}"
    >
      <el-table-column prop="uid" label="用户编号" width="80">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" size="mini" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <!-- ------------------------------编辑了     -->
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {reqManageDel} from "../../../utils/http"
import {successAlert} from "../../../utils/myAlert"
export default {
    props:["memberList"],
  data() {
    return {
     
    };
  },
  methods:{
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