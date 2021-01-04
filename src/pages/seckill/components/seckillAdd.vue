<template>
  <div>
    <!-- 菜单添加页 -->
    <!-- 判断点的是添加/编辑按钮 -->
    <!-- 点击叉号或者蒙版自己,也清空数据 用closed事件 -->
    <el-dialog
      :title="info.isadd ? '活动添加' : '活动修改'"
      :visible.sync="info.isshow"
      @closed="cancel"
    >
      {{ user }}
      <el-form :model="user">
        <!-- 菜单名称 -->
        <el-form-item label="活动名称" label-width="100px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- =====================活动期限====================== -->
        <el-form-item label="活动期限" label-width="100px">
          <!--  is-range: 是否为时间范围选择; timestamp 指定为时间戳格式的数据-->
          <div class="block">
            <el-date-picker
              v-model="activeTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
              value-format="timestamp"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <!-- 上级菜单 -->
        <!-- 目录和菜单单选框禁用; 如果上级菜单选的是目录,类型就选中目录 -->
        <el-form-item label="一级分类" label-width="100px">
          <el-select v-model="user.first_cateid" @change="firstCateChange">
            <el-option label="请选择分类" value disabled></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="100px">
          <el-select
            v-model="user.second_cateid"
            @change="secondCateChange(user.second_cateid)"
          >
            <el-option label="请选择分类" value disabled></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="100px">
          <el-select v-model="user.goodsid">
            <el-option label="请选择商品" value disabled></el-option>
            <el-option
              v-for="item in secGoodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
        <el-button type="primary" @click="add" v-if="info.isadd"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// 引入二级路由集合
import { indexRoutes } from "../../../router/index";
// 引入http请求
import {
  reqCateList,
  reqGoodsList,
  reqSeckillAdd,
  reqSeckillEdit,
  reqSeckillUpdate,
} from "../../../utils/http";
// 引入封装的弹框
import { successAlert, errorAlert } from "../../../utils/myAlert";

export default {
  props: ["info", "seckillList"],
  data() {
    return {
      // 菜单添加需要请求的数据,初始化user
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      //活动期限
      activeTime: [],
      // 二级分类列表数据
      secondCateList: [],
      //   二级分类下 商品的数据
      secGoodsList: [],
    };
  },
  // 状态层
  computed: {
    ...mapGetters({
      //  分类列表数据
      cateList: "cate/cateList",
      goodsList: "goods/goodsList",
    }),
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqList",
      reqGoodsList: "goods/reqList",
    }),
    // ----------------------------活动期限----------------------
    // 获取活动期限的值
    timeChange() {
      // console.log(this.activeTime[0]);
      this.user.begintime = this.activeTime[0];
      this.user.endtime = this.activeTime[1];
    },
    // --------------------一级分类 、二级分类、商品-----------------
    // 点击选中"一级分类"数据,"二级分类"展示对应数据
    firstCateChange() {
      // 先把二级分类和商品的数据清空
      this.user.second_cateid = "";
      this.user.goodsid = "";
      this.secGoodsList = [];

      // 展示二级分类
      this.getSecondCate();
    },
    // 获取二级分类数据
    getSecondCate() {
      // 二级分类的pid对应的就是一级分类的id(就是本页的first_cateid)
      reqCateList({ pid: this.user.first_cateid }).then((res) => {
        if (res.data.code == 200) {
          this.secondCateList = res.data.list;
        }
      });
    },
    // 获取二级分类下的 商品数据
    secondCateChange(id) {
      //重新选择二级时, 商品清空
      this.user.goodsid = "";
      this.secGoodsList = [];
      // 调用 获取商品数据
      this.getGoods(id);
    },
    // 获取商品数据
    getGoods(id) {
      reqGoodsList({ second_cateid: this.user.second_cateid }).then((res) => {
        if (res.data.code == 200) {
          let goodsArr = res.data.list;
          goodsArr.forEach((item) => {
            if (item.second_cateid === id) {
              this.secGoodsList.push(item);
            }
          });
        }
      });
    },

    // 点击取消按钮 添加弹框消失
    cancel() {
      // 如果点的是"编辑"里的取消按钮,则清空数据;
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    // 清空弹框user的数据(回到初始值)
    empty() {
      (this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      }),
        //活动期限
        //活动期限
        (this.activeTime = []),
        // 二级分类列表数据
        (this.secondCateList = []),
        //   二级分类下 商品的数据
        (this.secGoodsList = []);
    },
    //add数据验证 封装
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.title === "") {
          errorAlert("活动名称不能为空");
          return;
        }
        if (this.user.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
        }
        if (this.user.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.user.goodsid === "") {
          errorAlert("商品不能为空");
          return;
        }

        resolve();
      });
    },
    // 点击添加按钮 添加菜单
    add() {
      this.checkProps().then(() => {
        reqSeckillAdd(this.user).then((res) => {
          // 判断 获取成功
          if (res.data.code === 200) {
            //跳一条成功的弹框
            successAlert(res.data.msg);
            //add弹框消失 调用cancel()
            this.cancel();
              console.log(this.activeTime);
            // user清空 调用empty
            this.empty();
            // 刷新列表数据 子传父
            this.$emit("init");
          
          }
        });
      });
    },
    // 父传子的getone事件 编辑事件
    getone(obj) {
      // 点哪条数据的编辑按钮,就请求哪一条数据
      reqSeckillEdit({ id: obj.id }).then((res) => {
        if (res.data.code === 200) {
          // 赋值
          this.user = res.data.list;
          
          
          // 展示二级分类
          this.getSecondCate();
          // 展示商品数据
          this.getGoods(obj.second_cateid);
          // 请求回来的这条数据,没有id,所以补id
          this.user.id = obj.id;
          
        }
        //活动期限
          this.activeTime[0] = Number(this.user.begintime);
          this.activeTime[1] = Number(this.user.endtime);
          console.log(this.activeTime);


      });

     
    },
    // 修改按钮
    update() {
      this.checkProps().then(() => {
        reqSeckillUpdate(this.user).then((res) => {
          // 弹成功消息
          successAlert(res.data.msg);
          // add消失
          this.cancel();
          // 清空弹框user数据
          this.empty();
          // 通知父组件刷新list
          this.$emit("init");
        });
      });
    },
  },
  mounted() {
    this.reqCateList();
    this.reqGoodsList();
  },
};
</script>

<style scope>
</style>