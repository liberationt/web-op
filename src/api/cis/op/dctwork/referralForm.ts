/*
 * @Author: dmj
 * @LastEditTime:
 * @LastEditors: dmj
 * @Description:院内转诊
 * @FilePath:
 */
import axios from '@/utils/request.ts'
export interface Iobject {
    brid: number | null//病人id
    brnl: string | null,//病人年龄
    brxb: string | null,//病人性别
    brxm: string | null,//病人姓名
    sqzd: string | null//诊断
    zzks:null|number//转诊科室
    zzmd:string|null//转诊目的
    jzkh:string|null//jzkh
    jzks:number|null//就诊科室
    jgid:number|null//机构id
    jzys:string|null//转诊医生
    // zfbz:number|null//作废
    // sqrq:string|null//转诊日期
}
//提交
export const handleSave = (data: any) =>
  axios.request({
    url: '/op-service/mzcf/saveYnzzsq',
    method: 'post',
    data,

  })
