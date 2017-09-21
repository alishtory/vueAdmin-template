import { getUserInfo } from '@/api/user'
import { menuRouters, hasPermission } from '@/router'

function filterMenus(permissions, routers) {
  const accessMenus = routers.filter(route => {
    if (hasPermission(permissions, route)) {
      if (route.children && route.children.length) {
        route.children = filterMenus(permissions, route.children)
      }
      return true
    }
    return false
  })
  return accessMenus
}

const permission = {
  state: {
    permissions: [],
    permission_menus: []
  },
  mutations: {
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
      state.permission_menus = filterMenus(permissions, JSON.parse(JSON.stringify(menuRouters))) // 实现深拷贝
    }
  },
  actions: {
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data
          commit('SET_PERMISSIONS', data.permissions)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
