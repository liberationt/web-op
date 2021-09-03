// 挂号科室维护
import axios from '@/utils/request'

export interface IRegDept {
  ksdm: number|null // 科室代码
  ksmc: string
  mzks: number|null
  ptmz: number|string
  zjmz: number|string
  zkmz: number|string
  txmz: number|string
  pydm: string
  wbdm: string
  szdm: string
  jxdm: string
  ghf: number
  zlf: number
  mzlb: number|null
  ddxx: string
  ksfjh: string
  sfqy: number|string
  lrjkbk: number|string
}

// 新增
export const aDeptAdd = (data: any) => {
  return axios.request({
    url: '/op-service/opghks/add',
    method: 'post',
    data,
    headers:{
      "Content-Type": "application/json",
		}
  })
}

// 修改
export const aDeptEdit = (data: any) => {
  return axios.request({
    url: '/op-service/opghks/edit',
    method: 'post',
    data,
    headers:{
			"Content-Type": "application/json",
		}
  })
}

// 删除
export const aDeptDel = (data: any) => {
  return axios.request({
    url: '/op-service/opghks/delete',
    method: 'post',
    data
  })
}
//判断是否为互联网科室
export const interMzks = (data: any) => {
  return axios.request({
    url: '/op-service/opghks/isInternet',
    method: 'post',
    data
  })
}
//项目名称
export const getMzProject = () => {
  return axios.request({
    url: '/op-service/opghks/projectList',
    method: 'post'
  })
}