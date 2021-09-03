// 本地大病登记
import axios from '@/utils/request'

// 新增
export const aAdd = (data: any) => {
  return axios.request({
    url: '/ybapi-service/shybMzdb/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
