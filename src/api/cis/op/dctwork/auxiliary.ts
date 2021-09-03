import request from '@/utils/request'



export interface ISaveList {
  index: number,
  bzxx: string //	备注信息
  djzt:	number | null //
  dzbl: number | null //	打折比例
  fphm: string //	发票号码
  fydw: string //	费用单位
  fygb:	number | null //
  fymc: string //	项目名称
  hjje: number | null | string //	划价金额
  jgid:	number | null //
  jlsl: number | null //	记录数量
  jlxh:	number | null //
  ksdm:	number | null //
  mzxh:	number | null //
  opStatus: string //	操作类型
  pageNum:			number | null //
  pageSize:			number | null //
  sbxh:	number | null //
  spbh:	number | null //
  sqdh:	number | null //
  sqwh: number | null //	申请文号
  xflsh: string //	xflsh
  xmlx:	number | null //
  yjjk:	number | null | boolean //
  yjxh:	number | null //
  yjzh:	number | null //
  yjzx:	number | null //
  bzjg: number | null //	医疗单价
  ylsl: number | null //	医疗数量
  ylxh:number | null //
  ypzh:	number | null //
  yxms:	number | null //
  zfbl: number | null //	自负比例
  zfbz:	number | null //
  zfpb:	number | null //
  zhje: number | null //	折后金额
  zkbl: number | null //	折扣比例
  zkje: number | null //	折扣金额
  ztbh:	number | null //
  ztbz:number | null // 组套标志) 0非组套标志，1组套标志
  ztyzsbxh:	number | null // (MS_YJ02_ZT表SBXH)
  zxks:	number | null //
  zxpb:	number | null //
  zxrq: string //	执行时间
  pxh: number | null // 排序号
}





export const saveCZ = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/save',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}


export const queryListCZ = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/queryDisposalEntryList',
    method: 'post',
    data,
  })
}


/**
 * @Description: pkey  => sbxh
 * @author: zhml
 * @param {type}: pkey  => sbxh
 * @return:
 * @date 2020/7/24
*/
export const removeAuxiliary = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/removeDisposalEntry',
    method: 'post',
    data,
  })
}

/**
 * @Description: 组套传入数据的校验
 * @author: zhml
 * @param {type}: object
 * @return: success
 * @date 2020/7/24
*/
export const loadPersonalSet = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/loadPersonalSet',
    method: 'post',
    data,
  })
}

/**
 * @Description:
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/29
*/
export const saveDisposalSet = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/saveDisposalSet',
    method: 'post',
    data,
  })
}


/**
 * @Description:
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/29
*/
export const insertDisposalSet = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/insertDisposalSet',
    method: 'post',
    data,
  })
}


export const saveBeforeCheck = (data: any) => {
  return request({
    url: '/op-service/opyjcf01/saveCheck',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

//执行科室列表
export const depTList = (data: any) => {
  return request({
      url: '/system-service/treatmentItems/executeDeptList',
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


// 获取处置项目打印数据
export const queryPrintData = (data: any) => {
      return request({
          url: '/op-service/opyjcf01/getCzPrintData',
          method: 'post',
          data,
          headers: {
            'Content-Type': 'application/json'
          }
      })
  }

  // 获取处置组套数据总金额
  export const queryDisposalTotalFee = (data: any) => {
    return request({
      url: '/op-service/opyjcf01/queryDisposalTotalFee',
      method: 'post',
      data,
    })
  }
