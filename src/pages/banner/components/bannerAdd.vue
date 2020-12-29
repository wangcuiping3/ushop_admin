<template>
  <div class="cateAddForm">
    <!-- 轮播图管理  添加 -->
    <el-dialog
      :title="info.isAdd ? '轮播图添加' : '轮播图修改'"
      :visible.sync="info.isshow"
      @closed="cancel"
    >
      <el-form :model="user">
        {{ user }}
        <el-form-item label="标题" label-width="100px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片 -->
        <!-- v-if="user.pid!==0" 图片一般用于二级分类-->
        <el-form-item label="图片" label-width="100px" v-if="user.pid !== 0">
          <!-- <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->

          <!-- 轮播图2 -->
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="changeImg"
            
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="imageUrl" alt="" />
          </el-dialog>
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
        <el-button type="primary" v-if="info.isAdd" @click="add"
          >添 加</el-button
        >
        <el-button type="primary" v-else @click="updata">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqBannerAdd,
  reqBannerEdit,
  reqBannerUpdate,
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
        title: "", //轮播图名称
        img: null, //图片(文件)
        status: 1, //状态  1正常2禁用 number
      },
      // 图片的url地址,展示
      imageUrl: "",
      // 轮播图后一个弹框出现/隐藏
      dialogVisible: false,
    };
  },
  methods: {
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
        title: "", //轮播图名称
        img: null, //图片(文件)
        status: 1, //状态  1正常2禁用 number
      };
      // 图片地址清空
      this.imageUrl = "";
    },
    //ele-ui上传文件
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

      // 下一个添加图片文件的框框出现
      this.dialogVisible = true;
    },
    //   添加了
    add() {
      reqBannerAdd(this.user).then((res) => {
        if (res.data.code == 200) {
          //   弹成功的消息
          successAlert(res.data.msg);
          //   清空数据
          this.empty();
          //   add页面隐藏
          this.cancel();
          //通知父组件,刷新页面
          this.$emit("init");
        }
      });
    },
    // 编辑操作,接收父组件传过来的getOne
    getOne(id) {
      reqBannerEdit({ id: id }).then((res) => {
        if (res.data.code == 200) {
          // 赋值
          this.user = res.data.list;
          //补id
          this.user.id = id;
          //处理图片
          this.imageUrl = this.$pre + this.user.img;
        }
      });
    },
    updata() {
      reqBannerUpdate(this.user).then((res) => {
        // 弹成功消息
        successAlert(res.data.msg);
        // 页面隐藏
        this.cancel();
        // 数据清空
        this.empty();
        // 通知父组件 刷新页面
        this.$emit("init");
      });
    },

    // --------轮播图2---------
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    // },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    // -----------------
  },
};
</script>

<style scoped lang="stylus">
// ui库样式修改不起作用,用stylus穿透
.cateAddForm >>>.el-upload {
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