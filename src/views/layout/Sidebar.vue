<template>
  <el-menu mode="vertical" theme="dark" :default-active="$route.path">
    <sidebar-item :routes='permission_routers'></sidebar-item>
  </el-menu>
</template>

<script>
// import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { getUserInfo } from '@/api/userinfo'
import { asyncRouterMap } from '@/router'
export default {
  components: { SidebarItem },
  data() {
    return {
      permission_routers: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getUserInfo().then(response => {
        this.permission_routers = filterAsyncRouter(asyncRouterMap, response.data.permissions) // response.data.permissions.filter()
        console.log(this.permission_routers)
      })
    }
  }
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routerMap
 * @param roles
 */
function filterAsyncRouter(routerMap, permissions) {
  console.log(permissions)
  const accessedRouters = routerMap.filter(route => {
    if (route.meta && route.meta.permission && permissions.indexOf(route.meta.permission) < 0) {
      return false
    } else {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permissions)
      }
      return true
    }
  })
  return accessedRouters
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
  min-height: 100%;
}
</style>
