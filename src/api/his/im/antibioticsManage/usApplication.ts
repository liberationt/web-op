import request from '@/utils/request'

// 申请单删除
export const deleteBySqdh = (data: any) => {
  return request({
    url: '/mms-service/amqckjywsysq/deleteBySqdh',
    method: 'post',
    data,
  })
}

// 使用理由查询
export const sylyQueryPage = (data: any) => {
  return request({
    url: '/mms-service/amqcyskjywsyly/queryPage',
    method: 'post',
    data,
  })
}
