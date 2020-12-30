<template>
  <div>
    <!-- 商品管理 列表 -->
    <el-table
      :data="goodsList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="商品编号" width="80"> </el-table-column>
      <el-table-column prop="goodsname" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="商品价格"></el-table-column>
      <el-table-column prop="market_price" label="市场价格"></el-table-column>
      <el-table-column  label="图片">
        <template slot-scope="scope">
          <img
            v-if="scope.row.img !== 'null'"
            :src="$pre + scope.row.img"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="isnew" label="是否新品">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.isnew===1">是</el-button>
          <el-button type="danger" size="mini" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ishot" label="是否热卖">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.ishot===1">是</el-button>
          <el-button type="danger" size="mini" v-else>否</el-button>
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

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reqGoodsDel } from "../../../utils/http";
import { successAlert } from "../../../utils/myAlert";
export default {
  data() {
    return {};
  },
  // mapGetters将状态层的数据成批量导入到组件的计算属性中
  computed: {
    ...mapGetters({
      goodsList: "goods/goodsList",
      total: "goods/total",
      size: "goods/size",
    }),
  },
  // mapActions将状态层的actions成批量导入到组件的methods中
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqTotal: "goods/reqTotal",
      changePage: "goods/changePage",
    }),
    // 删除按钮
    del(id) {
      reqGoodsDel({ id: id }).then((res) => {
        if (res.data.code == 200) {
          //   弹成功消息
          successAlert(res.data.msg);
          // 通知父组件刷新列表页面
          this.reqList();
          // 重新获取总数据
          this.reqTotal();
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
  mounted() {
    // 页面一进来就获取数据
    this.reqList();
    // 获取总数
    this.reqTotal();
  },
};
</script>

<style scoped>
img{
  width: 80px;
  height: 80px;
}
</style>