// 输液工作量
import axios from '@/utils/request'

// 日期人次查询
export const aQueryAllDjCount = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/doQueryAllDjCount',
    method: 'post',
    data
  })
}
