import $axios from './index'
export function getAllRolse() {
  const url = '/roles/getRoles'
  return $axios.get(url)
}
export function updRolse(data) {
  const url = '/roles/updRoles'
  return $axios.post(url, data)
}
export function addRolse(data) {
  const url = '/roles/addRoles'
  return $axios.post(url, data)
}
export function delRolse(data) {
  const url = '/roles/delRoles'
  return $axios.post(url, data)
}
