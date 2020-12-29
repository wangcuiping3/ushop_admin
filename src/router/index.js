import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 导出 二级路由规则
export let indexRoutes = [
  {
    path: "menu",
    component: () => import("../pages/menu/menu.vue"),
    name:"菜单管理"
  },
  {
    path: "role",
    component: () => import("../pages/role/role.vue"),
    name:"角色管理"
  },
  {
    path: "manage",
    component: () => import("../pages/manage/manage.vue"),
    name:"管理员管理"
  },
  {
    path: "cate",
    component: () => import("../pages/cate/cate.vue"),
    name:"商品分类"
  },
  {
    path: "specs",
    component: () => import("../pages/specs/specs.vue"),
    name:"商品规格"
  },
  {
    path: "goodsmanage",
    component: () => import("../pages/goodsmanage/goodsmanage.vue"),
    name:"商品管理"
  },
  {
    path: "member",
    component: () => import("../pages/member/member.vue"),
    name:"会员管理"
  },
  {
    path: "banner",
    component: () => import("../pages/banner/banner.vue"),
    name:"轮播图管理"
  },
  {
    path: "seckill",
    component: () => import("../pages/seckill/seckill.vue"),
    name:"秒杀活动"
  }
]

export default new Router({
  routes: [
    //  定义一级路由规则,使用懒加载
    {
      path: "/login",
      component: () => import("../pages/login/login.vue")
    },
    {
      path: "/",
      component: () => import("../pages/index/index.vue"),
      // 二级路由规则
      children: [
        {
          path: "",
          component: () => import("../pages/home/home.vue")
        },
        // 二级路由提出去, 再展开放回来
        ...indexRoutes
      ]
      // 或者用routes.concat(indexRoutes)将二级路由的数组拼接回来
    },
  ]
})
