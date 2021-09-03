/*
 * @Author: wangyao
 * @LastEditTime: 2020-07-03 19:04:17
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\his\im\ims\admissionRegistration.ts
 */
import axios from '@/utils/request.ts'
//表单数据
// export interface Iitem {
//     bahm:string|null
//     ybkh:number|null,
//     brxz:string|null,
//     brxm:string|null
//     zjlx:"",
//     sfzh:"",
//     brxb:"",
//     csny:"",
//     rynl:"",
//     gjdm:"",
//     mzdm:"",
//     hyzk:"",
//     jtdh:"",
//     csdSqs:"",
//     jgdmSqs:"",
//     xzzQtdz:"",
//     xzzdh:"",
//     xzzyb:"",
//     hkdzSqs:"",
//     hkyb:"",
//     gzdw:"",
//     dwdh:"",
//     dwyb:"",
//     lxrm:"",
//     lxgx:"",
//     lxdh:"",
//     lxdz:"",
//     brks:"",
//     brch:"",
//     ryrq:"",
//     ryqk:"",
//     szys:"",
//     zsys:"",
//     ryzd:"",
//     dbjfbz:"",

// }
//获取住院号码/病案号码/收据号码
export const getAllNumber = (data: any) => {
  return axios({
    url: '/op-service/imhzry/getRydjPublicParam',
    method: 'post',
    data
  })
}

//获取卡号数据
export const getData = (data: any) => {
  return axios({
    url: '/op-service/imhzry/queryBrxxByCardno',
    method: 'post',
    data
  })
}

//保存登记信息
export const keepData = (data: any) => {
  return axios({
    url: '/op-service/imhzry/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 根据病人科室和病人性别查询可分配的床位信息
export const queryCwListByBrksAndBrxb = (data: any) => {
  return axios({
    url: '/op-service/imhzry/queryCwListByBrksAndBrxb',
    method: 'post',
    data
  })
}
