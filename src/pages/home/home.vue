<template>
  <div>
    home首页折线图
    <div id="main"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      cateList: "cate/cateList"
    })
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList"
    })
  },
  mounted() {
    //页面一加载就发请求
    this.reqList();
  },
  watch: {
    // 监听
    cateList: {
      handler() {
        if (this.cateList.length > 0) {
         
          
          //数据请求以后 画图
          let mychart = require("echarts").init(
            document.getElementById("main")
          );
          // 指定图表的配置项和数据
          var option = {
            title: {
              text: "分类数量"
            },
            color: ['#c23531'],
            tooltip: {},
            legend: {
              data: ["分类数量"]
            },
            xAxis: {
              data:this.cateList.map(item=>item.catename)
            },
            yAxis: {},
            // series:数据
            series: [
              {
                name: "分类数量",
                type: "line",
                data: this.cateList.map(item=>item.children?item.children.length:0)
              },
            ]
          };

          mychart.setOption(option);
        }
      },
      deep: true
    }
  }
};
</script>
<style scoped>
#main {
  width: 80%;
  height: 500px;
  border: 1px solid transparent;
  margin: 20px auto;
}
</style>