<template>
  <div>
    <!-- 菜单添加页 -->
    <!-- 判断点的是添加/编辑按钮 -->
    <!-- 点击叉号或者蒙版自己,也清空数据 用closed事件 -->
    <el-dialog
      :title="info.isadd ? '添加菜单' : '编辑菜单'"
      :visible.sync="info.isshow"
      @closed="cancel"
    >
      <el-form :model="user">
        <!-- 菜单名称 -->
        <el-form-item label="菜单名称" label-width="100px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 上级菜单 -->
        <!-- 目录和菜单单选框禁用; 如果上级菜单选的是目录,类型就选中目录 -->
        <el-form-item label="上级菜单" label-width="100px">
          <el-select v-model="user.pid" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="item in menuList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" label-width="100px">
          <el-radio v-model="user.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="user.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>

        <!-- 菜单图标 -->
        <!-- 如果添加的是目录,就只显示菜单图标; 如果是菜单,就显示菜单地址 -->
        <el-form-item
          label="菜单图标"
          label-width="100px"
          v-if="user.type === 1"
        >
          <el-select v-model="user.icon">
            <el-option :value="item" v-for="item in icons" :key="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 菜单地址 -->
        <el-form-item label="菜单地址" label-width="100px" v-else>
          <el-select v-model="user.url">
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :value="'/' + item.path"
              :label="item.name + '--/' + item.path"
            >
            </el-option>
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
        <!-- 验证数据 {{user}} -->
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
// 引入二级路由集合
import { indexRoutes } from "../../../router/index";
// 引入http请求
import { reqMenuAdd, reqMuneEdit, reqMenuUpdate } from "../../../utils/http";
// 引入封装的弹框
import { successAlert } from "../../../utils/myAlert";
export default {
  props: ["info", "menuList"],
  data() {
    return {
      // 菜单添加需要请求的数据,初始化user
      user: {
        pid: 0, //上级分类编号 顶级菜单-0, number类型
        title: "", //菜单名称
        icon: "", //图标
        type: 1, //类型,1 目录, 2 菜单 number类型
        url: "", //菜单地址
        status: 1, //状态 1正常2禁用 number类型
      },
      // 菜单图标集合
      icons: [
        "el-icon-setting",
        "el-icon-user-solid",
        "el-icon-star-off",
        "el-icon-camera-solid",
      ],
      // 菜单地址集合
      indexRoutes,
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
    // 清空弹框user的数据(回到初始值)
    empty() {
      this.user = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    // 点击添加按钮 添加菜单
    add() {
      reqMenuAdd(this.user).then((res) => {
        // 判断 获取成功
        if (res.data.code === 200) {
          //跳一条成功的弹框
          successAlert(res.data.msg);
          //add弹框消失 调用cancel()
          this.cancel();
          // user清空 调用empty
          this.empty();
          // 刷新列表数据 子传父
          this.$emit("init");
        }
      });
    },
    // 上级菜单pid改变, 上面是change事件
    changePid() {
      if (this.user.pid == 0) {
        // 如果上级菜单选的是顶级菜单,类型单选框就选中目录;
        this.user.type = 1;
      } else {
        // 否则上级菜单选中的就是目录,类型单选框就选中菜单
        this.user.type = 2;
      }
    },
    // 父传子的getone事件 编辑事件
    getone(id) {
      // 点哪条数据的编辑按钮,就请求哪一条数据
      reqMuneEdit({ id: id }).then((res) => {
        if (res.data.code === 200) {
          this.user = res.data.list;
          // 请求回来的这条数据,没有id,所以补id
          this.user.id = id;
        }
      });
    },
    // 修改按钮
    update() {
      reqMenuUpdate(this.user).then((res) => {
        // 弹成功消息
        successAlert(res.data.msg);
        // menuadd消失
        this.cancel();
        // 清空弹框user数据
        this.empty();
        // 通知父组件刷新menulist
        this.$emit("init");
      });
    },
  },
};
</script>

<style>
</style>