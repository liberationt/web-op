// 输液接药登记
import axios from '@/utils/request'

// 登记查询（根据卡号/发票号查询病人已收费、已发药、未输液注射的处方）
export const aQueryUnregistList = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/doQueryUnregistList',
    method: 'post',
    data
  })
}

// 登记
export const aSySaveRegist = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/doSySaveRegist',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}

// 查看处方详情
export const aQueryRegistList = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/doQueryRegistList',
    method: 'post',
    data
  })
}

// 输液开始
export const aStartShuYe = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/startShuYe',
    method: 'post',
    data
  })
}

// 输液完成
export const aUpdateSyZt = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/doUpdateSyZt',
    method: 'post',
    data
  })
}

// 打印瓶签/巡回单
export const aPrintSyptdy = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/doPrintSyptdy',
    method: 'post',
    data
  })
}

//新增瓶贴打印
export const doPrintSyptdyByYpxhList = (data: any) => {
  return axios.request({
    url: '/op-service/syjydjzb/doPrintSyptdyByYpxhList',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json"
		}
  })
}