import $axios from './index'
//分类接口
export function getAllCategory(data) {
  const url = '/category/list'
  return $axios.get(url, data)
}
export function updCategory(data) {
  const url = '/category/upd'
  return $axios.post(url, data)
}
export function addCategory(data) {
  const url = '/category/add'
  return $axios.post(url, data)
}
export function delCategory(data) {
  const url = '/category/del'
  return $axios.post(url, data)
}
//列表接口
export function listGoods(data) {
  const url = '/goods/list'
  return $axios.get(url, data)
}
