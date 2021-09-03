import request from '@/utils/request'

// 新增/修改其他医嘱
export const newEditQtyz = (data: any) => {
  return request({
    url: '/op-service/nisqtyz/add',
    method: 'post',
    data
  })
}
// 删除医嘱
export const delqtyz = (data: any) => {
  return request({
    url: '/op-service/nisqtyz/deleteByYzxh',
    method: 'post',
    data
  })
}
