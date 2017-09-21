import router from './router'
import { hasPermission } from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

/**
 * 路由是否不需要登录就能直接访问
 * @param route 要跳转到的路由
 */
function accessDirectly(route) {
  // 如果路由配了 meta:{access:true}，则表示不用登录就可以直接访问；其他的表示需要登录
  return route.meta && route.meta.access === true
}

/**
 * 如果有权限，进入，否则跳转到403
 * @param permissions
 * @param route
 * @param next
 */
function accessRedirect(permissions, route, next) {
  if (hasPermission(permissions, route)) {
    next()
  } else {
    next({ path: '/403' })
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (accessDirectly(to)) {
    // 如果不需要登录，直接访问
    next()
  } else {
    // 需要登录，我们检查store里面的权限组
    if (store.getters.permissions && store.getters.permissions.length) {
      // 有路由存储信息，说明已经登录过啦 ***注意：有可能是前一个登录用户没有清除的：比如用户退出没有清理permissions
      accessRedirect(store.getters.permissions, to, next)
    } else {
      // 没有登录信息，那么我们获取最新的用户信息；如果获取用户信息返回需要登录10302错误码，自动跳转到登录
      // 通过API获取用户信息 && 存储用户的权限组
      store.dispatch('GetUserInfo').then(res => {
        accessRedirect(store.getters.permissions, to, next)
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
