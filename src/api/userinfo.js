import fetch from '@/utils/fetch'

export function getUserInfo() {
  return fetch({
    url: '/user_info',
    method: 'get'
  })
}

export function login(user) {
  return fetch({
    url: '/login',
    method: 'post',
    data: {
      ...user
    }
  })
}
