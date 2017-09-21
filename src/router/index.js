import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

 /**
  * icon : the icon show in the sidebar
  * hidden : if `hidden:true` will not show in the sidebar
  * redirect : if `redirect:noredirect` will not redirct in the levelbar
  * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
  * meta : `{ role: ['admin'] }`  will control the page role
  **/
export const publicRouters = [
  { path: '/login', component: _import('login/index'), hidden: true, meta: { access: true }},
  { path: '/404', component: _import('404'), hidden: true, meta: { access: true }},
  { path: '/403', component: _import('404'), hidden: true, meta: { access: true }}
]

export const menuRouters = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: 'Example',
    icon: 'zujian',
    children: [
      { path: 'index', name: 'Form', icon: 'zonghe', component: _import('page/form') }
    ]
  },

  {
    path: '/table',
    component: Layout,
    redirect: '/table/index',
    icon: 'tubiao',
    noDropdown: true,
    children: [{ path: 'index', name: 'Table', component: _import('table/index'), meta: { permission: 'admin.table' }}]
  },

  { path: '*', redirect: '/404', hidden: true, meta: { access: true }}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: publicRouters.concat(menuRouters)
})

/**
 * 通过meta.permission判断是否与当前用户权限匹配
 * @param permissions 权限集合
 * @param route
 */
export function hasPermission(permissions, route) {
  // meta:{permission:'user.add'} 表示这个路由需要 user.add 权限；没有配置的话说明都有权限
  if (route.meta && route.meta.permission && permissions.indexOf(route.meta.permission) < 0) {
    // 如果配置了meta.permission 而且 permissions里面没有route需要的权限，那么这个权限组没有这条路由的权限
    return false
  }
  return true // 默认有权限
}
