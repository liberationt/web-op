import request from '@/utils/request';

// 分页组件调用
export const customPageReq = (url: string, data: any, method: any) => {
	return request({ url, data, method });
};

export const customPageReqs = (url: string, data: any) => {
	return request({
		url: url,
		data,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

// 获取登录用户科室
export const getUserDept = () => {
	return request({
		url: '/system-service/hrpersonnel/queryRyKsInfo',
		method: 'post'
	});
};
// 获取行政区划
export const getRegion = () => {
	return request({
		url: '/sysdictconfig/getRegion',
		method: 'post'
	});
};

// 获取标准数据主记录
export const getPrimaryDic = () => {
	return request({
		url: '/dic/sys/sysprimarydata/getAllDic',
		method: 'post'
	});
};

// 获取医院字典
export const getHspbasicdata = () => {
	return request({
		url: '/dic/hspbasicdata/getAllDic',
		method: 'post'
	});
};

// 获取医院字典最新数据
export const getHspNewData = (data: any) => {
	return request({
		url: '/hspbasicdata/getNewData',
		data,
		method: 'post'
	});
};

// 获取标识字典最新数据
export const getSysNewData = (data: any) => {
	return request({
		url: '/sys/sysflagdata/getNewData',
		data,
		method: 'post'
	});
};

// 获取检查检验最新数据
export const getJCJYNewData = (data: any) => {
	return request({
		url: '/dic/gyjbbm/getNew',
		data,
		method: 'post'
	});
};
// 获取检查检验全部数据
export const getJCJYAllData = (data: any) => {
	return request({
		url: '/dic/gyjbbm/findList',
		data,
		method: 'post'
	});
};

// 获取最新业务字典
export const getYwNewData = (data: any) => {
	return request({
		url: '/sysdictconfig/getNewData',
		data,
		method: 'post'
	});
};

// 获取所有标识字典
export const getDicJson = (data: any) => {
	return request({
		url: '/dic/sys/sysflagdata/getAllDic',
		data,
		method: 'post'
	});
};

// 获取所有业务字典
export const getYwAllDic = (data: any) => {
	return request({
		url: '/dic/sysdictconfig/getAllDic',
		data,
		method: 'post'
	});
};

// 获取行政区划
export const regionJson = () => {
	return request({
		url: '/region.js',
		method: 'get'
	});
};

// 获取当前时间
export const getNow = () => {
	return request({
		url: '/system-service/commonsCtr/getCurrentDate',
		method: 'post'
	});
};

// 获取查询定义
export const getDesign = (name: any) => {
	return request({
		url: `/system-service/quecxfb/getDesign?enName=${name}`,
		method: 'post'
	});
};

// 分页查询
export const customPageRequest = (data: any) => {
	return request({
		url: `/system-service/quecxfb/queryPage`,
		method: 'post',
		data
		// headers: {
		// 	"Content-Type": "application/json"
		// }
	});
};
//新增一个 挂号收费---组套
export const queryPage = (data: any) => {
	return request({
	  url: '/op-service/opzt01/queryPage',
	  method: 'post',
	  data,
	})
  }

// 无分页查询
export const customNoPageRequest = (data: any) => {
	return request({
		url: `/system-service/quecxfb/findList`,
		method: 'post',
		data
		// headers: {
		// 	"Content-Type": "application/json"
		// }
	});
};

// 生成拼音五笔
export const pywb = (word: any) => {
	return request({
		url: '/system-service/sysuser/pywbTool',
		method: 'post',
		data: { word: word }
	});
};

//  获取系统参数
export const getParams = (data: any) => {
	return request({
		url: '/system-service/system/public/get/params',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

// 药房发药查询药品库存数量
export const queryfyKc = (data: any) => {
	return request({
		url: '/op-service/drugsypxx/queryfyKc',
		method: 'post',
		data
	});
};

//获取书写病历树 mode:1门诊医生；2、住院医生；3、住院护士
export const getEmrTree = (data: any) => {
	return request({
		url: '/im-service/emrTree/getTree',
		method: 'post',
		data
	});
};

//查询药房是否初始化
export const init = (data: any) => {
	return request({
		url: '/op-service/pharmacy/public/init/check',
		method: 'post',
		data,
		headers: {
			'Res-Type': 'special'
		}
	});
};

// 病人医保读卡
export const aReadMedAcc = (data: any) => {
  return request({
    url: '/op-service/opghksManage/readPatientMedicareAccountInfo',
		method: 'post',
		data,
    headers: {
      // 'Res-Type': 'special'
    }
  })
}

// 病人医保读卡拿身份证
export const aReadMedAccInfo = (data: any) => {
	return request({
	  url: '/op-service/opghksManage/readPatientAccountInfo',
		  method: 'post',
		  data,
	  headers: {
		// 'Res-Type': 'special'
	  }
	})
  }
//校验卡的唯一性
//  获取系统参数
export const checkCardInfo = (data: any) => {
	return request({
		url: '/op-service/opghksManage/checkCardInfo',
		method: 'post',
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
};



