import $axios from './index'

export function getCardsData() {
  const url =
    'https://www.fastmock.site/mock/e876fd174751b3c01365da9911f2ff19/admin/getCardsData'
  return $axios.get(url)
}
export function getLineData() {
  const url =
    'https://www.fastmock.site/mock/e876fd174751b3c01365da9911f2ff19/admin/getLineData'
  return $axios.get(url)
}
export function getTableData() {
  const url =
    'https://www.fastmock.site/mock/e876fd174751b3c01365da9911f2ff19/admin/getTableList'
  return $axios.get(url)
}
export function getBarData() {
  const url =
    'https://www.fastmock.site/mock/e876fd174751b3c01365da9911f2ff19/admin/getBarData'
  return $axios.get(url)
}
