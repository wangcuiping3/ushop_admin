<template>
  <div>
    <!-- 大index -->
    <el-container class="con">
      <!-- 侧边导航 -->
      <el-aside width="200px" class="aside">
        <!--
          unique-opened	是否只保持一个子菜单的展开;
          router 开启路由模式，index就是配置path
         -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#20222a"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <!-- 动态权限 -->
          <div v-for="item in userInfo.menus" :key="item.id">
            <!-- 权限只有某个菜单 -->
            <el-menu-item v-if="!item.children" :index="item.url">{{
              item.title
            }}</el-menu-item>
            <!-- 权限有目录，也有菜单 -->
            <el-submenu :index="item.id + ''" v-if="item.children">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="i in item.children"
                  :key="i.id"
                  :index="i.url"
                  >{{ i.title }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <span>{{ userInfo.username }}</span>
          <el-button type="danger" size="mini" @click="logout"
            >退出登录</el-button
          >
        </el-header>

        <!-- 中间内容区 -->
        <el-main class="main">
          <!-- 面包屑导航 -->
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="$route.name"
          >
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 二级路由出口 -->
          <router-view class="secRouter"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    // 退出登录
    logout() {
      this.changeUser({});
      this.$router.replace("/login");
    },
  },
  mounted() {},
};
</script>

<style scoped>
.con {
  width: 100vw;
  height: 100vh;
}
.aside {
  background: #20222a;
}
.header {
  line-height: 60px;
  background: #b3c0d1;
  position: relative;
}
.el-button--danger {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(-50%, -50%);
}
/* 给所有二级路由设置的 */
.secRouter {
  padding-top: 20px;
}
</style>