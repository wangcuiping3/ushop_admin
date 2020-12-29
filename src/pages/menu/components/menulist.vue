<template>
  <div class="menulist">
    <!-- 菜单列表页 -->
    <!-- :tree-props="{ children: 'children'}"表示哪一项有children,哪一项就有下层列表 -->
    <el-table
      :data="menuList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="菜单编号" width="80px">
      </el-table-column>
      <el-table-column prop="title" label="菜单名称">
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单地址"> </el-table-column>
      <el-table-column prop="" label="状态">
        <!-- slot-scope="scope"  获取到status值 -->
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.status === 1"
            >启用</el-button
          >
          <el-button size="mini" type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="listDel(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { successAlert } from "../../../utils/myAlert";
import { reqMenuDel } from "../../../utils/http";

export default {
  // 接收menu传过来的menuList值
  props: ["menuList"],

  data() {
    return {};
  },
  methods: {
    // 点击删除按钮
    listDel(id){
      //id->scope.row.id
      // 确认删除 的弹框
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除按钮的代码
          reqMenuDel({ id: id }).then((res) => {
            if (res.data.code === 200) {
              // 弹弹框提示删除消息
              successAlert(res.data.msg);
              //通知父组件 触发init事件, 刷新menulist
              this.$emit("init")
            }
          });
        })
        .catch(() => {});//取消按钮 不做代码
    },
    // 点击编辑按钮
    edit(id){
      // 子传父 触发edit事件,带着参数id
      this.$emit("edit",id)
    }
  },
};
</script>

<style scoped>
</style>