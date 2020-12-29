<template>
  <div>
      <el-button type="danger" @click="del">删除</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    del() {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        confirmButtonClass:"el-button el-button--danger",
        type: "warning"
      })
        .then(() => {
           //点了确定删除，通知父组件删除
           this.$emit("realDel")
            
        })
        .catch(() => {});
    }
  }
};
</script>

<style>

</style>