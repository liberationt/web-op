// 报表
import axios from '@/utils/request'

// 挂号日报
export const aRegReport = (data: any) => {
  return axios.request({
    url: '/op-service/ghrbReport/registerDailyTableView',
    method: 'post',
    data
  })
}
