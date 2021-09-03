/*
 * @Author: wangyao
 * @LastEditTime: 2020-07-16 16:53:53
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\api\his\im\residentDoctor\patientManage.ts
 */
import request from '@/utils/request'

// 查询病人基本信息
export const queryPatientInfo = (data: any) => {
  return request({
    url: '/op-service/imhzrybydctwork/getPatientInfoById',
    method: 'post',
    data
  })
}
// 删除诊断
export const delDiagnose = (data: any) => {
  return request({
    url: '/op-service/imhzrybydctwork/deleteByCompositeKeys',
    method: 'post',
    data
  })
}
// 删除过敏药物
export const deleteAllergicDrugsById = (data: any) => {
  return request({
    url: '/op-service/imhzrybydctwork/deleteAllergicDrugsById',
    method: 'post',
    data
  })
}

// 病人管理转科前信息查询校验
export const queryTransferVerification = (data: any) => {
  return request({
    url: '/op-service/imzkjl/queryTransferVerification',
    method: 'post',
    data
  })
}


// 病人管理查询是否转科以及转科内容
export const querySfzk = (data: any) => {
  return request({
    url: '/op-service/imzkjl/querySfzk',
    method: 'post',
    data
  })
}
// 查询不符合该病人的转科条件的记录
export const queryUnvalidRecord = (data: any) => {
  return request({
    url: '/op-service/imzkjl/queryUnvalidRecord',
    method: 'post',
    data
  })
}

// 病人管理保存转科记录
export const saveZyzkjl = (data: any) => {
  return request({
    url: '/op-service/imzkjl/saveZyzkjl',
    method: 'post',
    data
  })
}

// 病人管理取消转科
export const cancelsaveZyzkjl = (data: any) => {
  return request({
    url: '/op-service/imzkjl/cancelsaveZyzkjl',
    method: 'post',
    data
  })
}
// 病区病人管理查询是否设置发药药房
export const loadHospitalParams = (data: any) => {
  return request({
    url: '/op-service/imhzrybydctwork/loadHospitalParams',
    method: 'post',
    data
  })
}
