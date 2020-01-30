import $axios from './index'

export function login(data) {
  const url = '/auth/login'
  return $axios.post(url, data)
}
export function getInfo() {
  const url = '/auth/getInfo'
  return $axios.get(url)
}
