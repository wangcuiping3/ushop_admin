<template>
  <div class="goodsAddForm">
    <!-- 商品管理 添加 -->
    <!-- @opened="openedAdd" 富文本编辑器什么时候创建 -->
    <el-dialog
      :title="info.isAdd ? '商品添加' : '商品修改'"
      :visible.sync="info.isshow"
      @closed="cancel"
      @opened="openedAdd"
    >
      <el-form :model="user">
        <el-form-item label="一级分类" label-width="100px">
          <el-select v-model="user.first_cateid" @change="firstCateChange">
            <el-option label="请选择" value disabled></el-option>
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
          <el-select v-model="user.second_cateid">
            <el-option label="请选择" value disabled></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="100px">
          <el-input v-model="user.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px">
          <el-input v-model="user.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="100px">
          <el-input v-model="user.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片 -->
        <!-- v-if="user.pid!==0" 图片一般用于二级分类-->
        <el-form-item label="图片" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        {{ user }}

        <el-form-item label="商品规格" label-width="100px">
          <el-select v-model="user.specsid" @change="specsidChange">
            <el-option label="请选择" value disabled></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :value="item.id"
              :label="item.specsname"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" label-width="100px">
          <el-select v-model="user.specsattr" multiple>
            <el-option label="请选择" value disabled></el-option>
            <!-- 循环遍历  展示内容 -->
            <el-option
              v-for="item in specsAttrsShow"
              :key="item"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" label-width="100px">
          <el-radio v-model="user.isnew" :label="1">是</el-radio>
          <el-radio v-model="user.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="100px">
          <el-radio v-model="user.ishot" :label="1">是</el-radio>
          <el-radio v-model="user.ishot" :label="2">否</el-radio>
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

        <!-- 富文本编辑器 -->
        <el-form-item label="商品描述" label-width="100px">
          <div id="editor" v-if="info.isshow"></div>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.isAdd" @click="add"
          >添 加</el-button
        >
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入富文本编辑器
import E from "wangeditor";

import { mapActions, mapGetters } from "vuex";
import {
  reqCateList,
  reqGoodsAdd,
  reqGoodsEdit,
  reqGoodsUpdate,
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/myAlert";
// 引入path模块
import path from "path";
export default {
  props: ["info"],

  data() {
    return {
      //  初始化user
      user: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      // 初始化图片的url地址,展示
      imageUrl: "",
      // 二级分类列表数据
      secondCateList: [],
      // 规格属性的展示列表
      specsAttrsShow: [],
    };
  },
  // 状态层
  computed: {
    ...mapGetters({
      //  分类列表数据
      cateList: "cate/cateList",
      // 商品规格数据
      specsList: "specs/specsList",
    }),
  },

  methods: {
    ...mapActions({
      reqCateList: "cate/reqList",
      reqSpecsList: "specs/reqList",
      reqGoodsList: "goods/reqList",
      reqTotal: "goods/reqTotal",
    }),
    // --------------------一级分类 、二级分类-----------------
    // 点击选中"一级分类"数据,"二级分类"展示对应数据
    firstCateChange() {
      // 先把二级分类数据清空
      this.user.second_cateid = "";

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
    //---------------------- 商品规格、规格属性-------------------
    // 当点击"商品规格"的数据,"规格属性"展示对应的
    specsidChange() {
      // 先把规格属性的数据清空
      this.specsAttrsShow = "";
      // 展示"规格属性"数据,调用
      this.getSpecsAttrsShow();
    },

    // 获取规格属性的列表展示的数据
    getSpecsAttrsShow() {
      // 选中的"商品规格"是user.specsid,"规格属性"得是specsList中id与user.specsid一样的那条数据的attrs
      let obj = this.specsList.find((item) => item.id == this.user.specsid);
      // 如果找到了, 就返回对应那一项的规格属性(attrs),否则undefined,则做[]处理,然后赋值
      this.specsAttrsShow = obj ? obj.attrs : [];
    },

    // 点击取消按钮 添加弹框消失
    cancel() {
      // 如果点的是"编辑"里的取消按钮,则清空数据;
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //清空数据
    empty() {
      this.user = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      };

      // 图片地址清空
      this.imageUrl = "";
      this.secondCateList = [],
        // 规格属性 清空
      this.specsAttrsShow = [];
    },
    // 图片
    changeImg(ev) {
      // console.log(ev);
      // 选中的那张图片文件
      let file = ev.raw;

      //限制文件大小 1M=1024KB 1KB=1024B
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件大小不能超过2M");
        return;
      }
      //限制文件类型--后缀名
      let extname = path.extname(file.name);
      let arr = [".png", ".gif", ".jpg", ".jpeg"];
      if (!arr.some((item) => item === extname)) {
        errorAlert("请上传图片类型的文件");
        return;
      }
      // 将图片文件生成url地址并赋值,展示
      this.imageUrl = URL.createObjectURL(file);
      // 将图片文件 赋值给img
      this.user.img = file;
    },

    //add数据验证 封装
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
        }

        if (this.user.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.user.goodsname === "") {
          errorAlert("商品名称不能为空");
          return;
        }

        if (this.user.price === "") {
          errorAlert("商品价格不能为空");
          return;
        }

        if (this.user.market_price === "") {
          errorAlert("商品市场价格不能为空");
          return;
        }

        if (!this.user.img) {
          errorAlert("请上传图片");
          return;
        }
        if (this.user.specsid === "") {
          errorAlert("商品规格不能为空");
          return;
        }

        if (this.user.specsattr.length === 0) {
          errorAlert("请选择规格属性");
          return;
        }
        if (this.editor.txt.html() == "") {
          errorAlert("请输入商品描述");
          return;
        }
        resolve();
      });
    },

    //  添加了
    add() {
      this.checkProps().then(() => {
        // 请求之前取出富文本编辑器的内容  赋值给description
        this.user.description = this.editor.txt.html();
        // 由于后端要的specsattr是数组字符串，前端需要是数组，所以要拷贝、处理一下，再发送；但是由于有对象（img）,所以不能使用JSON.parse(JSON.stringify())拷贝，需要使用...
        let data = {
          ...this.user,
          specsattr: JSON.stringify(this.user.specsattr),
        };
        reqGoodsAdd(data).then((res) => {
          if (res.data.code == 200) {
            successAlert(res.data.msg);
            this.empty();
            this.cancel();
            //通知父组件,刷新页面,重新获取总数
            this.reqGoodsList();
            this.reqTotal();
          }
        });
      });
    },

    // 编辑操作,接收父组件传过来的getOne
    getOne(id) {
      reqGoodsEdit({ id: id }).then((res) => {
        if (res.data.code == 200) {
          // 赋值
          this.user = res.data.list;
          // 展示二级分类数据 调用
          this.getSecondCate();
          // 图片
          this.imageUrl = this.$pre + this.user.img;
          // 展示规格属性数据
          this.getSpecsAttrsShow();
          //规格属性选中的list
          this.user.specsattr = JSON.parse(this.user.specsattr);
          //补id
          this.user.id = id;
          // 将description的数据赋值给富文本编辑器
          if (this.editor) {
            this.editor.txt.html(this.user.description);
          }
        }
      });
    },

    // 修改按钮
    update() {
      this.checkProps().then(() => {
        //取出富文本编辑器的内容，赋值给user
        this.user.description = this.editor.txt.html();
        // specsattr数据类型处理
        let data = {
          ...this.user,
          specsattr: JSON.stringify(this.user.specsattr),
        };

        reqGoodsUpdate(data).then((res) => {
          // 弹成功消息
          successAlert(res.data.msg);
          // 页面隐藏
          this.cancel();
          // 数据清空
          this.empty();
          // 刷新页面
          this.reqGoodsList();
        });
      });
    },

    //当点击"添加"按钮以后 才开始创建富文本编辑器
    openedAdd() {
      //创建编辑器
      this.editor = new E("#editor");
      this.editor.create();
      //赋值
      this.editor.txt.html(this.user.description);
    },
  },
  mounted() {
    // 如果没有请过商品分类的数据
    if (this.cateList.length === 0) {
      this.reqCateList();
    }
    //获取商品规格的数据: bool传true,就是获取全部的数据 不分页
    this.reqSpecsList(true);
  },
};
</script>

<style scoped lang="stylus">
// ui库样式修改不起作用,用stylus穿透
.goodsAddForm >>>.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
