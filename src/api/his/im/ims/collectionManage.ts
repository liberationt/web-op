import axios from '@/utils/request.ts';

// 查询催款管理信息
export const collectionQuery = (data: any) =>
	axios.request({
		url: '/op-service/debtManage/queryDebtInventoryPage',
		method: 'post',
		data
	});

// 住院管理-缴费管理(获取系统默认的催款金额)
export const queryDefaultDebtInventory = () =>
	axios.request({
		url: '/op-service/debtManage/queryDefaultDebtInventory',
		method: 'post'
	});
