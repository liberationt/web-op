import request from '@/utils/request'

// 抗菌药物会诊专家列表
export const queryAmqctsjkjywhzzj = (data: any) => {
  return request({
    url: '/mms-service/amqctsjkjywhzzj/queryPage',
    method: 'post',
    data
  })
}
