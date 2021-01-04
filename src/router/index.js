import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
// 引入仓库
import store from "../store"
import { errorAlert } from '../utils/myAlert';

// 封装的路由独享守卫
function checkEnter(path, next) {
  if (store.state.userInfo.menus_url.includes(path)) {
    next()
  } else {
    next("/")
  }
}

// 导出 二级路由规则
export let indexRoutes = [
  {
    path: "menu",
    component: () => import("../pages/menu/menu.vue"),
    name: "菜单管理",
    // 路由独享守卫
    beforeEnter(to,from,next){
      checkEnter("/menu",next)
     }
  },
  {
    path: "role",
    component: () => import("../pages/role/role.vue"),
    name: "角色管理",
    beforeEnter(to, from, next) {
      checkEnter("/role", next)
    }
  },
  {
    path: "manage",
    component: () => import("../pages/manage/manage.vue"),
    name: "管理员管理",
    beforeEnter(to, from, next) {
      checkEnter("/manage", next)
    }
  },
  {
    path: "cate",
    component: () => import("../pages/cate/cate.vue"),
    name: "商品分类",
    beforeEnter(to, from, next) {
      checkEnter("/cate", next)
    }
  },
  {
    path: "specs",
    component: () => import("../pages/specs/specs.vue"),
    name: "商品规格",
    beforeEnter(to, from, next) {
      checkEnter("/specs", next)
    }
  },
  {
    path: "goodsmanage",
    component: () => import("../pages/goodsmanage/goodsmanage.vue"),
    name: "商品管理",
    beforeEnter(to, from, next) {
      checkEnter("/goodsmanage", next)
    }
  },
  {
    path: "member",
    component: () => import("../pages/member/member.vue"),
    name: "会员管理",
    beforeEnter(to, from, next) {
      checkEnter("/member", next)
    }
  },
  {
    path: "banner",
    component: () => import("../pages/banner/banner.vue"),
    name: "轮播图管理",
    beforeEnter(to, from, next) {
      checkEnter("/banner", next)
    }
  },
  {
    path: "seckill",
    component: () => import("../pages/seckill/seckill.vue"),
    name: "秒杀活动",
    beforeEnter(to, from, next) {
      checkEnter("/seckill", next)
    }
  }
]

let router = new Router({
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

//登录拦截
router.beforeEach((to, from, next) => {
  //如果去的是登录 就next
  if (to.path === "/login") {
    next()
    return
  }
  //去的不是登录，判断是否登录了，登录了，就next
  if (store.state.userInfo.id) {
    next()
    return;
  }
  //否则
  next("/login")
})

export default router
