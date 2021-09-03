/*
 * @Author: dmj
 * @LastEditTime:
 * @LastEditors: dmj
 * @Description:手术申请
 * @FilePath:
 */
import axios from '@/utils/request.ts'
// export interface Iobject {
//     brks: number | null//病人科室
//     brnn: string | null,//病人年龄
//     brxb: string | null,//病人性别
//     brxm: string | null,//病人姓名
//     mzhm: string | null,//门诊号码
//     mzmc: number | null,//麻醉方法
//     mzys: number | null,//麻醉医师
//     sjys: number | null,//上级医师
//     sqrq: number | null,//申请日期
//     sqys: number | null//申请医师
//     sqzd: string | null//诊断
//     ssbz: string | null//手术备注
//     ssez: string | null//手术二助
//     ssjb: number | null//手术等级
//     ssnm: null | number//手术内码
//     ssrq: string | null//手术日期
//     sssz: string | null//手术三助
//     ssys: string | null//手术医师
//     ssyz: string | null//手术一助
//     sqlx: number | null//申请类型
//     ssmc: string | null//手术名称
// }
export const handleSave = (data: any) =>
  axios.request({
    url: '/op-service/optsssq/saveSssq',
    method: 'post',
    data,
    headers: {
        'Content-Type': 'application/json',
    }
  })
