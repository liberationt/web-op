/*
 * @Date:
 * @LastEditors: dmj
 * @LastEditTime:
 * @description:
 */


import request from '@/utils/request'

export const queryList = (data: any) => {
  return request({
    url: '/op-service/yygl/loadAppointedInfo',
    method: 'post',
    data,
  })
}
export interface IRecipeForm{
    brxm:string|null,
    dateFrom:string|null,
    dateTo:string|null,
    jzkh:string|null,
    kslb:number|null,
    sfz:string|null,
    yyys:string|null,
    zblx:string|null
}
