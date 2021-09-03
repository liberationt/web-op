

import request from '@/utils/request'


//查询使用理由列表
export const queryReasonPage = (data: any) => {
  return request({
    url: '/mms-service/amqcyskjywsyly/queryPage',
    method: 'post',
    data
  })
}
