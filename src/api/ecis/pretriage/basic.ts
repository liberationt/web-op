import request from '@/utils/request'

// 查询主诉类别
export const queryTreeData = (data: any) => {
  return request({
    url: '/op-service/erprezslb/findList',
    method: 'post',
    data,
  })
}

// 添加节点
export const addTreeNode = (data: any) => {
  return request({
    url: '/op-service/erprezslb/add',
    method: 'post',
    data,
  })
}

// 删除主诉类别节点
export const deleteTreeNode = (data: any) => {
  return request({
    url: '/op-service/erprezslb/delete',
    method: 'post',
    data,
  })
}

// 根据节点id 查询主诉
export const findListById = (data: any) => {
  return request({
    url: '/op-service/erprezsjl/findList',
    method: 'post',
    data,
  })
}
//  新增主诉
export const addZs = (data: any) => {
  return request({
    url: '/op-service/erprezsjl/add',
    method: 'post',
    data,
  })
}
//  编辑主诉
export const editZs = (data: any) => {
  return request({
    url: '/op-service/erprezsjl/edit',
    method: 'post',
    data,
  })
}

//  删除主诉
export const deleteZs = (data: any) => {
  return request({
    url: '/op-service/erprezsjl/delete',
    method: 'post',
    data,
  })
}


//  根据主诉描述查询主诉
export const queryList = (data: any) => {
  return request({
    url: '/op-service/erprezsjl/findListByZsms',
    method: 'post',
    data,
  })
}




//  根据主诉描述查询主诉
export const addTriage = (data: any) => {
  return request({
    url: '/op-service/erpreyjfz/add',
    method: 'post',
    data,
    headers: {
			"Content-Type": "application/json"
		}
  })
}



