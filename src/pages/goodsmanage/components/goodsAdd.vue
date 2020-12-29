<template>
  <div class="goodsAddForm">
    <!-- 商品管理 添加 -->
    <!-- @opened="openedAdd" 富文本编辑器什么时候创建 -->
    <el-dialog
      :title="info.isAdd ? '规格添加' : '规格修改'"
      :visible.sync="info.isshow"
      @closed="cancel"
      @opened="openedAdd"
    >
      <el-form :model="user">
        <el-form-item label="一级分类" label-width="100px">
          <el-select v-model="user.first_cateid">
            <el-option label="请选择" value disabled></el-option>
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="100px">
          <el-select v-model="user.second_cateid">
            <el-option label="请选择" value disabled></el-option>
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in specsList"
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
        <el-form-item label="图片" label-width="100px" v-if="user.pid !== 0">
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

         {{user}}

        <el-form-item label="商品规格" label-width="100px">
          <el-select v-model="user.specsid">
            <el-option label="请选择" value disabled></el-option>
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" label-width="100px">
          <el-select v-model="user.specsattr">
            <el-option label="请选择" value disabled></el-option>
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- 循环遍历""展示内容 -->
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
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
import { reqSpecsAdd, reqSpecsEdit, reqSpecsUpdate } from "../../../utils/http";
import { successAlert } from "../../../utils/myAlert";
// 引入path模块
import path from "path";
export default {
  props: ["info", "specsList"],

  data() {
    return {
      //  初始化user
      user: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price:"",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: "",
        ishot: "",
        status: 1
      },
      // 初始化新增规格属性的值
      attrsArr: [
        { value: "" }, //输入框的值value
      ],
      // 图片的url地址,展示
      imageUrl: "",
    };
  },
  computed: {
    ...mapGetters({}),
  },

  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqTotal: "goods/reqTotal",
    }),
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
        market_price:"",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: "",
        ishot: "",
        status: 1
      };
      // 图片地址清空
      this.imageUrl=""
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
    //  添加了
    add() {
      // 添加按钮之前,map遍历 赋值; 拿到的是数组, 再转为字符串数组
      this.user.attrs = JSON.stringify(this.attrsArr.map((item) => item.value));

      reqSpecsAdd(this.user).then((res) => {
        if (res.data.code == 200) {
          //   弹成功的消息
          successAlert(res.data.msg);
          //   清空数据
          this.empty();
          //   add页面隐藏
          this.cancel();
          //通知父组件,刷新页面,重新获取总数
          this.reqList();
          this.reqTotal();
        }
      });
    },
    // 编辑操作,接收父组件传过来的getOne
    getOne(id) {
      reqSpecsEdit({ id: id }).then((res) => {
        if (res.data.code == 200) {
          // 赋值
          this.user = res.data.list[0];
          // 规格属性 先将字符串数组转成数组
          this.user.attrs = JSON.parse(this.user.attrs);
          //处理图片
          this.imageUrl = this.$pre + this.user.img;
        }
      });
    },
    // 修改按钮
    update() {
      reqSpecsUpdate(this.user).then((res) => {
        // 弹成功消息
        successAlert(res.data.msg);
        // 页面隐藏
        this.cancel();
        // 数据清空
        this.empty();
        // 刷新页面
        this.reqList();
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
