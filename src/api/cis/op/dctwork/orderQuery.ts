/*
 * @Date:
 * @LastEditors: dmj
 * @LastEditTime:
 * @description:
 */


import request from '@/utils/request'

export interface Iitem{
brxm:string |null,
deteFrom:string|null,
deteTo:string|null,
jzkh:string|null,
kslb:number|null,
sfz:string|null,
yyys:string|null,
zblx:string|null
}
export const queryList = (data: any) => {
  return request({
    url: '/op-service/yygl/loadAppointedInfo',
    method: 'post',
    data,
  })
}
