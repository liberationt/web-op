/**
 * @Description:
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/6/30
*/

import request from '@/utils/request'


//新增
export const add = (data: any) => {
  return request({
    url: '/op-service/mzzydj/saveHosReg',
    method: 'post',
    data,
  })
}

//edit
export const edit = (data: any) => {
  return request({
    url: '/op-service/mzzydj/updateHosReg',
    method: 'post',
    data,
  })
}

//delete
export const deleteById = (data: any) => {
  return request({
    url: '/op-service/mzzydj/deleteById',
    method: 'post',
    data,
  })
}

/**
 * @Description: updateStatus
 * @author: zhml
 * @param {type}: djid , sqzt 登记id。申请状态
 * @return:
 * @date 2020/7/1
*/
export const updateStatus = (data: any) => {
  return request({
    url: '/op-service/mzzydj/updateHosRegStatus',
    method: 'post',
    data,
  })
}

export const printModel = (data: any) => {
  return request({
    url: `/op-service/mzzydj/getRydjPrintData?djid=${data}`,
    method: 'get',
  })
}

// 获取患者信息
export const queryPatientInfo = (data: any) => {
  return request({
    url: '/op-service/opghksManage/doQueryPersonByCardno',
    method: 'post',
    data,
  })
}

// 获取医院logo
export const queryLogo = (data: any) => {
    return request({
        url: `/system-service/dicyljg/logo?hospitalId=${data}`,
        method: 'post',
    })
}

// 读卡获取患者就诊卡信息
export const getCardInfo = (data: any) => {
  return request({
    url: '/op-service/opghksManage/readPatientMedicareAccountInfo',
		method: 'post',
		data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}