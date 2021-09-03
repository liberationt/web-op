// 诊室信息维护
import axios from '@/utils/request'

// 新增
export const aAddRoom = (data: any) => {
  return axios.request({
    url: '/op-service/opmzzs/add',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 编辑
export const aEditRoom = (data: any) => {
  return axios.request({
    url: '/op-service/opmzzs/edit',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 删除
export const aDelRoom = (data: any) => {
  return axios.request({
    url: '/op-service/opmzzs/delete',
    method: 'post',
    data
  })
}

// 诊室id查重
export const aValidRoomId = (data: any) => {
  return axios.request({
    url: '/op-service/opmzzs/validZsIdExist',
    method: 'post',
    data,
    headers: {
      'Res-Type': 'special'
    }
  })
}

// 查询服务台列表（不分页）
export const aqueryFwtList = (data: any) => {
  return axios.request({
    url: '/mtdms-service/opfwtxx/queryList',
    method: 'post',
    data
  })
}
