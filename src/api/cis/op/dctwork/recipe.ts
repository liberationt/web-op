import axios from '@/utils/request.ts'
import request from "@/utils/request";

export interface IRecipeForm {
  bzmc: string,
  bzxx: string,
  cfsb: number | null,
  cfts: number | null,
  dcypjxzts: number | null,
  dcypjxzzs: number | null,
  fphm: string,
  fygb: number | null,
  gmywlb: number | null,
  gytj: number | null | string,
  hjje: number | null,
  jf: number | null,
  jldw: string,
  jylx: number | null,
  kpdy: number | null,
  ksbz: number | null,
  mrcs: number | null,
  psjg: string,
  pspb: number | null,
  sfjg: number | null,
  sqys: string,
  syyy: string,
  tsyp: number | null,
  type: number | null,
  xdzfjbz: string,
  ycjl: number | null,
  ycyl: number | null,
  yfbz: number | null,
  yfdw: string,
  yfgg: string,
  ypcd: number | null,
  ypdc: number | null,
  ypdj: number | null,
  ypjl: number | null,
  ypjxz: number | null,
  ypmc: string,
  ypmrz: number | null,
  ypsl: number | null,
  ypxh: number | null,
  ypyf: string,
  ypzh: number | null,
  ypzs: number | null,
  yqsy: number | null,
  ysycjl: string,
  yybs: number | null,
  yyts: number | null,
  zby: number | null,
  zfbl: number | null,
  zfpb: number | null,
  zfyp: number | null
}

export interface ISvaeObj {
  // webSortNumber: number | null,
  zfyp: number,
  bzxx: string,
  djzt: number | null,
  dzbl: number | null,
  fygb: number | null,
  fymc: string,
  hjje: number | null,
  jb: number | null, // 几倍剂量
  gytj: number | string | null, // 用法
  ypyf: number | string, // 频次
  mrcs: number, // 每日次数
  ypdj: number | string,
  jgid: number | null,
  jlsl: number | null,
  jlxh: number | null,
  mzxh: number | null,
  opStatus: string,
  psjg: number | null,
  pageNum: number | null,
  pageSize: number | null,
  sbxh: number | null,
  spbh: number | null,
  sqdh: number | null,
  xflsh: string,
  xmlx: number | null,
  yjxh: number | null,
  yjzh: number | null,
  yjzx: number | null,
  yldj: number | null,
  ylsl: number | null,
  ylxh: number | null,
  ypzh: number | null,
  yxms: number | null,
  yyts: number | null,
  zfbl: number | null,
  zfpb: number | null,
  zhje: number | null,
  zkbl: number | null,
  zkje: number | null,
  ztbh: number | null,
  ztbz: number | null,
  ztyzsbxh: number | null,
  zxpb: number | null
}


/**
 * @Description:  查询明细
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/1
 */
export const queryDetail = (data: any) =>
  axios.request({
    url: '/op-service/opcf01/findDetails',
    method: 'post',
    data
  })

/**
 * @Description: 查询处方列表
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/1
 */
export const queryData = (data: any) =>
  axios.request({
    url: '/op-service/opcf01/findList',
    method: 'post',
    data
  })

/**
 * @Description: 保存处方
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/1
 */
export const saveCf01 = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })

/**
 * @Description: 获取费用自付比例
 * @author: zhml
 * @param {type}: { brxz：'',fygb: '',fyxh: '',type:'' }
 * @return:
 * @date 2020/7/2
 */
export const getPayProp = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/getPayProportion',
    method: 'post',
    data
  })

/**
 * @Description: 查询处方列表
 * @author: zhml
 * @param {type}:
 * @return: cfsb
 * @date 2020/7/9
*/
export const findList = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/findList',
    method: 'post',
    data
  })

/**
 * @Description: 查询复制处方列表
 * @author: zhml
 * @param {type}:
 * @return: cfsb
 * @date 2020/7/9
 */
export const findListNoJzlsh = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/findListNoJzlsh',
    method: 'post',
    data
  })
/**
 * @Description: 检验处方复制信息
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/21
*/
export const checkCopyInfo = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/perscriptionCopyCheck',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })


export const checkDetailInfo = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/checkInventory',
    method: 'post',
    data
  })


/**
 * @Description: 查询明细
 * @author: zhml
 * @param {type}: cfsb
 * @return:
 * @date 2020/7/9
*/
export const findDetails = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/findDetails',
    method: 'post',
    data
  })

/**
 * @Description: 处方首页  载入附加项目
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/22
*/
export const findAddition = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/loadAddition',
    method: 'post',
    data
  })



/**
 * @Description:  根据组套载入组套明细信息
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/16
*/
export const loadPersonalSet = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/loadPersonalSet',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })

/**
 * @Description: 根据药品序号获取药品信息（助手方式）
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/16
*/
export const loadMedcineInfo = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/loadMedcineInfo',
    method: 'post',
    data
  })


export const removeMedcineInfo = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/removeClinicInfo',
    method: 'post',
    data
  })


/**
 * @Description: 获取公共参数
 * @author: zhml
 * @param {type}: commons :['HLYYIP', 'SFQYHLYY', 'ZYKS']
 * @return: data
 * @date 2020/7/29
*/
export const getPubParams = (data: any) =>
  axios.request({
    url: '/system-service/system/public/get/params',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })


// 查询上级病人性质
export const querySjBrxz = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/querySjBrxz',
    method: 'post',
    data
  })

// 获取皮试历史信息
export const getSkinTest = (data: any) =>
  axios.request({
    url: '/op-service/skinxm/doQueryPsxmHz ',
    method: 'post',
    data
  })

// 获取医生权限
export const getDoctPersimmion = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/loadOutClinicInitParams',
    method: 'post',
    data
  })




// 打印发票
export const PrintRecipe = (data: any) => {
  return axios.request({
    url: '/op-service/mzcf/cfPrint',
    method: 'post',
    data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}

/**
 * @Description: 根据处方识别查询处方皮试
 * @author: zhml
 * @param {type}: cfsb
 * @return: list
 * @date 2020/11/3
 */
export const queryFjxm = (data: any) => {
  return request({
    url: '/op-service/opcfps/findList',
    method: 'post',
    data,
  })
}

// 通过处方药品查询皮试药品列表
export const getPsxmByDrugs = (data: any) => {
  return request({
    url: '/op-service/skinxm/getPsxmByDrugsForNew',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 保存后的处方获取其附加项目
export const getPsxmList = (data: any) => {
  return request({
    url: '/op-service/skinxm/getPsxmList',
    method: 'post',
    data
  })
}


// 通过药品信息判断当前医生是否可以开当前药品
export const isUse = (data: any) => {
  return request({
    url: '/op-service/mzcf/isUse',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
      'Res-Type': 'special'
    }
  })
}

// 另存组套
export const addzt = (data: any) => {
  return request({
    url: '/op-service/opzt01/addzt',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

// 处方打印（前端写）
export const getCfPrintData = (data: any) => {
  return request({
    url: `/op-service/mzcf/getCfPrintData?cfsb=${data}`,
    method: 'post',
  })
}

// 获取医院logo
export const queryLogo = (data: any) => {
    return request({
        url: `/system-service/dicyljg/logo?hospitalId=${data}`,
        method: 'post',
    })
}

// 医保智能提醒(录入处方)
export const smartRemind = (data: any) => {
      return request({
          url: '/op-service/ybtspost/lrcf',
          method: 'post',
          data,
          headers: {
            'Content-Type': 'application/json',
          }
      })
  }