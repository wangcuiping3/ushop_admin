<template>
  <div>
    <!-- 管理员管理列表 -->
    <el-table
      :data="specsList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="规格编号" width="80"> </el-table-column>
      <el-table-column prop="specsname" label="规格名称"> </el-table-column>
      <!-- width="500px" ---------------------------------------->
      <el-table-column prop="attrs" label="规格属性">
        <template slot-scope="scope">
          <el-tag
            v-for="(item) in scope.row.attrs"
            :key="item.index"
          >{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.status == 1"
            >启用</el-button
          >
          <el-button type="info" size="mini" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <!-- 使用封装的删除按钮 -->
          <del-btn @realDel="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reqSpecsDel } from "../../../utils/http";
import { successAlert } from "../../../utils/myAlert";
export default {
  data() {
    return {};
  },
  // mapGetters将状态层的数据成批量导入到组件的计算属性中
  computed:{
    ...mapGetters({
      specsList:"specs/specsList"
    })
  },
  // mapActions将状态层的actions成批量导入到组件的methods中
  methods: {
    ...mapActions({
      reqList:"specs/reqList"
    }),
    del(id) {
      reqSpecsDel({ id: id }).then((res) => {
        if (res.data.code == 200) {
          //   弹成功消息
          successAlert(res.data.msg);
          // 通知父组件刷新列表页面
          this.reqList()
        }
      });
    },
    //   点了""编辑"按钮
    edit(id) {
      //   通知父组件
      this.$emit("edit", id);
    },
  },
  // 挂载完成
  mounted(){
    // 页面一进来就获取数据
    this.reqList()
  }
};
</script>

<style>
</style>