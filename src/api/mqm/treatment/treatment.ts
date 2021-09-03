import request from '@/utils/request.ts'

export const addTreatmentType = (data: any) => {
  return request({
    url: '/op-service/zllb/add',
    method: 'post',
    data,
  })
}

export const editTreatmentType = (data: any) => {
  return request({
    url: '/op-service/zllb/edit',
    method: 'post',
    data,
  })
}

export const delTreatmentType = (data: any) => {
  return request({
    url: '/op-service/zllb/delete',
    method: 'post',
    data,
  })
}

export const getTreatmentType = (data: any) => {
  return request({
    url: '/mtdms-service/zllb/queryPage',
    method: 'post',
    data,
  })
}

export const addZlxm = (data: any) => {
  return request({
    url: '/op-service/zlxm/add',
    method: 'post',
    data,
  })
}

export const editZlxm = (data: any) => {
  return request({
    url: '/op-service/zlxm/edit',
    method: 'post',
    data,
  })
}

export const deleteZlxm = (data: any) => {
  return request({
    url: '/op-service/zlxm/delete',
    method: 'post',
    data,
  })
}

export const updateZtZlxm = (data: any) => {
  return request({
    url: '/op-service/zlxm/updateZt',
    method: 'post',
    data,
  })
}

export const getProject = (data: any) => {
  return request({
    url: '/mtdms-service/zlxm/queryPage',
    method: 'post',
    data,
  })
}

export const findPlanList = (data: any) => {
  return request({
    url: '/op-service/zlxmzljh/findList',
    method: 'post',
    data,
  })
}

export const addPlanItem = (data: any) => {
  return request({
    url: '/op-service/zlxmzljh/add',
    method: 'post',
    data,
  })
}

export const delPlanItem = (data: any) => {
  return request({
    url: '/op-service/zlxmzljh/delete',
    method: 'post',
    data,
  })
}

export const editPlanItem = (data: any) => {
  return request({
    url: '/op-service/zlxmzljh/edit',
    method: 'post',
    data,
  })
}

export const findSFXMList = (data: any) => {
  return request({
    url: '/mtdms-service/zlxmldsfxm/findList',
    method: 'post',
    data,
  })
}
export const addSFXMItem = (data: any) => {
  return request({
    url: '/op-service/zlxmldsfxm/add',
    method: 'post',
    data,
  })
}
export const delSFXMItem = (data: any) => {
  return request({
    url: '/op-service/zlxmldsfxm/delete',
    method: 'post',
    data,
  })
}
export const editSFXMItem = (data: any) => {
  return request({
    url: '/op-service/zlxmldsfxm/edit',
    method: 'post',
    data,
  })
}

export const addZLSQ = (data: any) => {
  return request({
    url: '/mtdms-service/zlsqdzb/add',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const zfZLSQ = (data: any) => {
  return request({
    url: '/mtdms-service/zlsqdzb/delete',
    method: 'post',
    data,
  })
}

export const queryZLSQ = (data: any) => {
  return request({
    url: '/op-service/zlsqdzb/getDetail',
    method: 'post',
    data,
  })
}

export const editZLSQ = (data: any) => {
  return request({
    url: '/op-service/zlsqdzb/edit',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const findZLNR = (data: any) => {
  return request({
    url: '/op-service/zlsqdxmzlnr/findList',
    method: 'post',
    data,
  })
}

export const findZLYY = (data: any) => {
  return request({
    url: '/op-service/zlsqdyyzx/findList',
    method: 'post',
    data,
  })
}

export const saveOrUpdateZlyyAndZlnr = (data: any) => {
  return request({
    url: '/op-service/zlsqdyyzx/saveOrUpdateZlyy',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export const queryZlyyzxXmxq = (data: any) => {
  return request({
    url: '/op-service/zlsqdyyzx/queryZlyyzxXmxq',
    method: 'post',
    data,
  })
}

export const addZLZJ = (data: any) => {
  return request({
    url: '/op-service/zljlxjzj/add',
    method: 'post',
    data,
  })
}

export const findJlList = (data: any) => {
  return request({
    url: '/op-service/zljlxjzj/findJlList',
    method: 'post',
    data,
  })
}

export const editZLJL = (data: any) => {
  return request({
    url: '/op-service/zljlxjzj/edit',
    method: 'post',
    data,
  })
}

export const delZLJL = (data: any) => {
  return request({
    url: '/op-service/zljlxjzj/delete',
    method: 'post',
    data,
  })
}

export const queryZLZJ = (data: any) => {
  return request({
    url: '/op-service/zljlxjzj/queryFinish',
    method: 'post',
    data,
  })
}

export const cancelFinish = (data: any) => {
  return request({
    url: '/op-service/zljlxjzj/cancelFinish',
    method: 'post',
    data,
  })
}

export const finishSave = (data: any) => {
  return request({
    url: '/op-service/zljlxjzj/finishSave',
    method: 'post',
    data,
  })
}

export const cancelZX = (data: any) => {
  return request({
    url: '/op-service/zlsqdyyzx/cancelZx',
    method: 'post',
    data,
  })
}
