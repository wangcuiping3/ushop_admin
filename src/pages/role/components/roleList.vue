<template>
  <div>
    <!-- 角色列表 -->
    <el-table
      :data="roleList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="角色编号" width="80px">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称"> </el-table-column>
      <el-table-column prop="" label="状态">
        <!-- slot-scope="scope"  获取到status值 -->
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.status === 1"
            >启用</el-button
          >
          <el-button type="info" size="mini" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {reqRoleDel,reqRoleEdit} from "../../../utils/http";
import { successAlert } from "../../../utils/myAlert";

export default {
  // 接收role传过来的数据
  props: ["roleList"],

  data() {
    return {};
  },
  methods: {
    // 点击编辑按钮
    edit(id) {
    // 通知父组件,点了编辑,让父组件通知menuAdd修改数据,并携带id参数
    this.$emit("edit",id)
    },

    // 点击删除按钮
    del(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        // 点击删除按钮
        .then(() => {
          reqRoleDel({ id: id }).then((res) => {
            if (res.data.code === 200) {
              // 弹成功的消息
              successAlert(res.data.msg)
              // 刷新页面 调用父组件的init()
              this.$emit("init")
            }
          });
        })
        // 点击取消按钮 不作任何提示和操作
        .catch(() => {});
    },
  },
};
</script>

<style>
</style>