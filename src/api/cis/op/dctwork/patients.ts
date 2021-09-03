import request from '@/utils/request'

export interface IPatientForm {
  pdhm: number
  brxm: string
  brxb: number
}

export interface IPatientHistory {
  brbh: number //	病人编号
  fzrq: string //	复诊日期
  ghfz: number //	挂号复诊
  ghxh: number //	挂号序号
  jgid: string //	机构代码
  jssj: string //	结束时间
  jzxh: number //	就诊序号
  jzzt: number //			就诊状态 | 1.就诊中 2.挂起 9.结束就诊
  ksdm: number //	科室代码
  kssj: string //	开始时间
  scbz: string //	scbz
  sfdy: number //	sfdy
  sfjk: number //	sfjk
  ysdm: string //	医生代码
  yyxh: number //	复诊预约序号
  zyzd: number //	主要诊断
}


export interface IBlxxForm {
  bmi: number
  bqgz: string
  brid: number
  dpy: string
  ft: boolean
  fx: boolean
  fzjc: string
  h: number
  hxkn: boolean
  jkcfs: [
    {
      diagnoseid: string
      diagnosename: string
      empiid: string
      examineunit: string
      guideUserText: string
      guideWayText: string
      guidedate: string
      guideuser: string
      guideway: string
      healthteach: string
      icd10: string
      id: string
      inputUnitText: string
      inputUserText: string
      inputdate: string
      inputunit: string
      inputuser: string
      lastModifyUnitText: string
      lastModifyUserText: string
      lastmodifydate: string
      lastmodifyunit: string
      lastmodifyuser: string
      phrid: string
      recipename: string
      recordid: string
      wayid: string
    }
  ]
  jws: string
  jzxh: number
  ks: boolean
  leftcorrectedvision: number
  leftvision: number
  mxb: string
  ot: boolean
  p: number
  pageNum: number
  pageSize: number
  pz: boolean
  qtlcbx: string
  r: number
  rightcorrectedvision: number
  rightvision: number
  rsbz: number
  ssy: number
  szy: number
  t: number
  tgjc: string
  w: number
  xbs: string
  yt: boolean
  zsxx: string
}


export interface IBrzdObj {
  'webSortNumber': number | null,
  'webSortStatus': boolean,
  'brid': number | null,
  'cflx': number | null,
  'deep': number,
  'fbrq': string,
  'fzbz': number | null | string,
  'icd10': string,
  'jbpb': string,
  'jgid': number | null,
  'jlbh': number | null,
  'jzxh': number | null,
  'plxh': number | null,
  'sjzd': number | null,
  'zdbw': string | number,
  'zdlb': number | null,
  'zdmc': string,
  'zdsj': string,
  'zdxh': number | null | string,
  'zdys': string,
  'zgqk': number | null,
  'zgsj': string,
  'zzbz': number | null,
  'ffbz': number,
  'blzd': number
}

/**
 * @LastEditors: zhml
 * @Description: 查询患者列表
 * @param {type} params
 * @return:
 */
export const queryPatientList = (data: any) => {
  return request({
    url: '/op-service/opghmx/queryPatientList',
    method: 'post',
    data
  })
}

/**
 * @LastEditors: zhml
 * @Description: 查询患者档案，载入病历首页信息
 * @param {type} params
 * @return:
 */
export const queryPatientFile = (data: any) => {
  return request({
    url: '/op-service/opghmx/loadClinicInfo',
    method: 'post',
    data
  })
}

/**
 * @LastEditors: zhml
 * @Description: 患者的就诊历史
 * @param {type} params
 * @return:
 */
export const queryPatientHistory = (data: any) => {
  return request({
    url: '/op-service/opysjzls/findList',
    method: 'post',
    data
  })
}

/**
 * @LastEditors: zhml
 * @Description: 选择病人后，初始化病人就诊信息
 * @param {type} params
 * @return:
 */
export const initPatientFile = (data: any) => {
  return request({
    url: '/op-service/opghmx/saveInitClinicInfo',
    method: 'post',
    data
  })
}

/**
 * @LastEditors: zhml
 * @Description: 保存病人病历信息
 * @param {type} params
 * @return:
 */
export const savePatientFile = (data: any) => {
  return request({
    url: '/op-service/msbcjl/saveMsBcjl',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
  /**
   * @Description: /msbcjl/saveClinicFinish
   * @author: zhml
   * @param {type}:
   * @return:
   * @date 2020/7/27
  */
export const handleOn = (data: any) => {
  return request({
    url: '/op-service/msbcjl/saveClinicFinish',
    method: 'post',
    data,
  })
}

/**
 * @Description: 载入结算明细
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/27
*/ 
export const loadInfo = (data: any) => {
  return request({
    url: '/op-service/msbcjl/loadSettlementInfo',
    method: 'post',
    data,
  })
}

/**
 * @Description: 保存诊间预约信息
 * @author: zhml
 * @param {type}:   object
 * @return: object
 * @date 2020/7/27
*/
export const saveYyxx = (data: any) => {
  return request({
    url: '/op-service/msbcjl/saveYyxx',
    method: 'post',
    data,
  })
}



/**
 * @Description: 初始化诊断信息
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/6/23
 */
export const queryMsbrzd = (data: any) => {
  return request({
    url: '/op-service/opbrzd/findList',
    method: 'post',
    data
  })
}

/**
 * @Description: 保存病历诊断信息
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/6/24
*/
export const saveMsbrzd = (data: any) => {
  return request({
    url: '/op-service/opbrzd/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


export const deleteMsbrzd = (data: any) => {
  return request({
    url: '/op-service/opbrzd/delete',
    method: 'post',
    data,

  })
}


// 清空
export const aRemoveBcjl = (data: any) => {
  return request({
    url: '/op-service/msbcjl/removeBcjl',
    method: 'post',
    data,
  })
}

/*
*@Description: 检查是否有主诉
*@param: jzlsh
*@response: data
*@Author: zhml
*@Date: 2020-09-25 11:16:46
*/
export const checkZsIsExit = (data: any) => {
  return request({
    url: '/op-service/opghmx/queryBcjlByEmr',
    method: 'post',
    data,
  })
}

// 下一个
export const nextPatient = (data: any) => {
  return request({
    url: '/op-service/opghmx/nextPatient',
    method: 'post',
    data,
  })
}

// 判断在线状态 
export const onLineStatus = (data: any) => {
  return request({
    url: '/op-service/msbcjl/getOnLineStatus',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 加载信息(原方法类OutPharmacyLoad)查询药房识别信息
export const aGetYfsb = (data: any) => {
  return request({
    url: '/op-service/sysxtcs/load',
    method: 'post',
    data
  })
}

// 获取医生权限
export const getDoctPersimmion = (data: any) => {
  return request({
    url: '/op-service/mzcf/loadOutClinicInitParams',
    method: 'post',
    data
  })
}
  
// 查询计算机MAC地址是否添加
export const queryMac = (data: any) => {
  return request({
    url: '/op-service/sysmac/getMac',
    method: 'post',
    data
  })
}

// 保存计算机MAC地址
export const SaveMac = (data: any) => {
  return request({
    url: '/op-service/sysmac/add',
    method: 'post',
    data
  })
}

// 获取树功能节点数据
export const getZlTreeOn = (data: any) => {
  return request({
    url: '/op-service/opzltree/getZlTreeOn',
    method: 'post',
    data
  })
}

// 获取医生工作量数据
export const getWorkloadData = (data: any) => {
  return request({
    url: '/op-service/mzcf/doctorWorkLoad',
    method: 'post',
    data
  })
}