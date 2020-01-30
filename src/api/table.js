import $axios from './index'

export function getPageTab1(params) {
  const url =
    'https://www.fastmock.site/mock/e876fd174751b3c01365da9911f2ff19/admin/getPageData1'
  return $axios.get(url, params)
}
export function getPageTab2() {
  // const url = '/getPageData2'
  const url =
    'https://www.fastmock.site/mock/e876fd174751b3c01365da9911f2ff19/admin/getPageData2'
  return $axios.get(url)
}
