<template>
  <div>
    <!-- 商品分类 列表 -->
    <el-table
      :data="cateList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="分类编号" width="80"> </el-table-column>
      <el-table-column prop="catename" label="分类名称" width="180">
      </el-table-column>
      <el-table-column prop="" label="图片">
        <template slot-scope="scope">
          <img
            v-if="scope.row.img !== 'null'"
            :src="$pre + scope.row.img"
            alt=""
          />
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
import { reqCateDel } from "../../../utils/http";
import { successAlert } from "../../../utils/myAlert";
export default {
  data() {
    return {};
  },
  // 状态层列表数据
  computed: {
    ...mapGetters({
      cateList: "cate/cateList",
    }),
  },
  methods: {
    ...mapActions({
      // 状态层 方法
      reqCateList: "cate/reqList",
    }),

    del(id) {
      reqCateDel({ id: id }).then((res) => {
        if (res.data.code == 200) {
          //   弹成功消息
          successAlert(res.data.msg);
          // 刷新列表页面
          this.reqCateList();
        }
      });
    },
    //   点了""编辑"按钮
    edit(id) {
      this.$emit("edit", id);
      
    },
  },
  // 一进页面就获取数据
  mounted(){
    this.reqCateList()
  }
};
</script>

<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>