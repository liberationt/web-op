import axios from '@/utils/request.ts'

// 在院病人
export const inHospitalPatientReport = (data: any) =>
  axios.request({
    url: '/op-service/zyReport/inHospitalPatientReport',
    method: 'post',
    data,
  })

// 出院病人
export const dischargedPatientReport = (data: any) =>
  axios.request({
    url: '/op-service/zyReport/dischargedPatientReport',
    method: 'post',
    data,
  })

// 病区收入
export const bqPatientReport = (data: any) =>
  axios.request({
    url: '/op-service/zyReport/bqPatientReport',
    method: 'post',
    data,
  })
