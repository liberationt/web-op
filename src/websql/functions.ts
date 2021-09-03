import Vue from 'vue';
import { customPageReq } from '@/api/his/basic/index.ts';
// import { log } from '/console';
import pnParam from '@/store/modules/pnParam';
import { UserModule } from '@/store/modules/user'

// const tableList = ['TB_REGION', 'PRIMARY_DIC_MAIN', 'HSP_DATA_MAIN', 'SYS_FLAG_DATA', 'SYS_DICT_CONFIG']
const tableNameKV: any = {
	SYS_PRIMARY_DATA: 'SYS_PRIMARY_DATA_VALUE',
	SYS_FLAG_DATA: 'SYS_FLAG_DATA_VALUE',
	SYS_DICT_CONFIG: 'SYS_DICT_CONFIG_VALUE',
	GY_JBBM_VERSION: 'GY_JBBM'
};
// 删除指定表
export function clearDBtable(tbName: string) {
	const strSQL = 'DROP TABLE ' + tbName;
	Vue.prototype.$db.transaction(function(tr: any) {
		tr.executeSql(
			strSQL,
			[],
			function(tr: any, re: any) {
				// //console.log(tbName + '表成功删除');
			},
			function(tr: any, er: any) {
				// //console.log(tbName + '表删除失败，错误信息:' + er.message);
			}
		);
	});
}

/**
 * 字典的ExecuteSql函数封装
 * @param strSQL 执行的SQL
 * @param succCB sql执行成功回调
 * @param errCB  sql执行失败回调
 */
export function dictExecuteSql(strSQL: string, succCB: any = Function, errCB: any = Function) {
	Vue.prototype.$db.transaction(function(tr: any) {
		tr.executeSql(strSQL, [], succCB, errCB);
	});
}

/**
 * 获取字典数据
 * @param tableName  表名(主表)
 * @param kid  字典主id
 * @param strSql 原查询SQL
 * @param succCB 调用函数页面用于处理数据的函数
 */
export function getTableData(tableName: string, kid: string | number, strSql: string, succCB: any = Function) {
	dictExecuteSql(
		strSql,
		function(tx: any, results: any) {
			// //console.log('直接查询', strSql, results)
			var nowData: any = [];
			for (var i = 0; i < results.rows.length; i++) {
				nowData.push(results.rows.item(i));
			}
			if (tableName == 'SYS_DICT_CONFIG') {
				// 业务字典返回json转义后的扩展字段
				const nowArr: Array<any> = [];
				nowData.forEach((ele: any, i: any) => {
					if (ele.ex) {
						nowArr.push(JSON.parse(ele.ex));
					} else {
						nowArr.push(ele);
					}
				});
				succCB(nowArr);
			} else {
				succCB(nowData);
			}
		},
		function(tx: any, err: any) {
			var nowData: any = [];
			//console.log('查询出错', err);
			if (tableName == 'SYS_DICT_CONFIG') {
				// 业务字典返回json转义后的扩展字段
				const nowArr: Array<any> = [];
				nowData.forEach((ele: any, i: any) => {
					if (ele.ex) {
						nowArr.push(JSON.parse(ele.ex));
					} else {
						nowArr.push(ele);
					}
				});
				succCB(nowArr);
			} else {
				succCB(nowData);
			}
		}
	);
}

/*

*/
export function getNewDict() {
	const tableArr = [
		{
			tableName: 'SYS_PRIMARY_DATA',
			dataUrl: '/dic/sys/sysprimarydata/getAllMainDic',
			newDataUrl: '/dic/sys/sysprimarydata/getNewData'
		},
		{
			tableName: 'SYS_FLAG_DATA',
			dataUrl: '/dic/sys/sysflagdata/getAllMainDic',
			newDataUrl: '/dic/sys/sysflagdata/getNewData'
		},
		{
			tableName: 'SYS_DICT_CONFIG',
			dataUrl: '/dic/sysdictconfig/getAllMainDic',
			newDataUrl: '/dic/sysdictconfig/getNewData'
		},
		{ tableName: 'GY_JBBM_VERSION', dataUrl: '/dic/gyjbbm/getAllMainDic', newDataUrl: '/dic/gyjbbm/getNew' }
	];
	tableArr.some((item: any) => {
        if(item.tableName=='SYS_DICT_CONFIG'){
           if(!UserModule.token){
               return false;
           }
        }
		customPageReq(item.dataUrl, {}, 'post').then((res: any) => {
			// //console.log(res.data, item.tableName);
			res.data.map((data: any) => {
				dictExecuteSql(
					`select dversion from ${item.tableName} where dk = '${data.dk}'`,
					function(tx: any, results: any) {
						if (results.rows[0] && results.rows[0].dversion) {
							if (data.dversion == results.rows[0].dversion) {
								//本地最新
							} else {
								const param = {
									dk: data.dk,
									dversion: 0
								};
								customPageReq(item.newDataUrl, param, 'post').then((res1: any) => {
									if (item.tableName == 'GY_JBBM_VERSION') {
										dataConversion('GY_JBBM_VERSION', data.dk, res1.data);
									} else {
										dataConversionPub(item.tableName, data.dk, res1.data);
									}
								});
							}
						} else {
							const param = {
								dk: data.dk,
								dversion: 0
							};
							customPageReq(item.newDataUrl, param, 'post').then((res1: any) => {
								if (item.tableName == 'GY_JBBM_VERSION') {
									dataConversion('GY_JBBM_VERSION', data.dk, res1.data);
								} else {
									dataConversionPub(item.tableName, data.dk, res1.data);
								}
							});
						}
					},
					function(tx: any, error: any) {
						//console.log(`select dversion from ${item.tableName} where dk = '${data.dk}'absolute-center`);
						//console.log('查询失败:' + error.message);
					}
				);
			});
		});
	});
}

/**
 * 非检查检验字典的数据转换
 * @param tableName  表名(主表)
 * @param kid  字典主id
 * @param resData 查询返回数据
 */
function dataConversionPub(tableName: string, kid: any, resData: any) {
	dictExecuteSql(
		`select dk from ${tableName} ${tableName}  where dk = '${kid}';`,
		(tx: any, results: any) => {
			if (results.rows.length > 0) {
				dictExecuteSql(
					`delete from  ${tableName}  where dk = '${kid}';`,
					function() {
						dictExecuteSql(
							'insert into ' +
								tableName +
								" (dk,dname,dversion)values('" +
								resData.dk +
								"','" +
								resData.dname +
								"','" +
								resData.dversion +
								"')",
							function() {
								//console.log('主表插入成功');
							},
							function() {
								//console.log('主表插入失败');
							}
						);
					},
					function() {
						//console.log('主表删除失败');
					}
				);
			} else {
				dictExecuteSql(
					'insert into ' +
						tableName +
						" (dk,dname,dversion)values('" +
						resData.dk +
						"','" +
						resData.dname +
						"','" +
						resData.dversion +
						"')",
					function() {
						//console.log('主表插入成功');
					},
					function() {
						//console.log('主表插入失败');
					}
				);
			}
		},
		() => {
			//console.log('查询出错');
		}
	);
	dictExecuteSql(
		`select dv from ${tableNameKV[tableName]} where dk= '${kid}'`,
		(tx: any, results: any) => {
			if (results.rows.length > 0) {
				dictExecuteSql(
					`delete from ${tableNameKV[tableName]} where dk= '${kid}'`,
					function() {
						if (tableName == 'SYS_DICT_CONFIG') {
							resData.son.forEach((ele: any) => {
								var sonStr = JSON.stringify(ele);
								dictExecuteSql(
									'insert into ' +
										tableNameKV[tableName] +
										" (dk,dv,dn,ex,wb,py)values('" +
										resData.dk +
										"','" +
										ele.dv +
										"','" +
										ele.dn +
										"','" +
										sonStr +
										"','" +
										ele.wb +
										"','" +
										ele.py +
										"')",
									function() {
										//console.log('子表插入成功');
									},
									function() {
										"','" + ele.dn;
										//console.log('子表插入失败');
									}
								);
							});
						} else {
							resData.son.forEach((ele: any) => {
								dictExecuteSql(
									'insert into ' +
										tableNameKV[tableName] +
										" (dk,dv,dn,wb,py)values('" +
										resData.dk +
										"','" +
										ele.dv +
										"','" +
										ele.dn +
										"','" +
										ele.wb +
										"','" +
										ele.py +
										"')",
									function() {
										//console.log('子表插入成功');
									},
									function() {
										//console.log('子表插入失败');
									}
								);
							});
						}
					},
					function() {
						//console.log('delete from ' + tableNameKV[tableName] + ' where dk=' + kid);
						//console.log('子表删除失败');
					}
				);
			} else {
				if (tableName == 'SYS_DICT_CONFIG') {
					resData.son.forEach((ele: any) => {
						var sonStr = JSON.stringify(ele);
						dictExecuteSql(
							'insert into ' +
								tableNameKV[tableName] +
								" (dk,dv,dn,ex,wb,py)values('" +
								resData.dk +
								"','" +
								ele.dv +
								"','" +
								ele.dn +
								"','" +
								sonStr +
								"','" +
								ele.wb +
								"','" +
								ele.py +
								"')",
							function() {
								//console.log('子表插入成功');
							},
							function() {
								"','" + ele.dn;
								//console.log('子表插入失败');
							}
						);
					});
				} else {
					resData.son.forEach((ele: any) => {
						dictExecuteSql(
							'insert into ' +
								tableNameKV[tableName] +
								" (dk,dv,dn,wb,py)values('" +
								resData.dk +
								"','" +
								ele.dv +
								"','" +
								ele.dn +
								"','" +
								ele.wb +
								"','" +
								ele.py +
								"')",
							function() {
								//console.log('子表插入成功');
							},
							function() {
								//console.log('子表插入失败');
							}
						);
					});
				}
			}
		},
		() => {
			//console.log('查询失败');
		}
	);
}

/**
 * 检查检验字典的数据转换
 * @param tableName  表名(主表)
 * @param kid  字典主id
 * @param resData 查询返回数据
 */
function dataConversion(tableName: string, kid: any, resData: any) {
	dictExecuteSql(
		`select from  + ${tableName} +  where dk = '${kid}'`,
		(tx: any, results: any) => {
			if (results.rows.length > 0) {
				dictExecuteSql(
					'delete from ' + tableName + ' where dk =' + kid,
					function() {
						dictExecuteSql(
							'insert into ' +
								tableName +
								" (dk,dname,dversion)values('" +
								resData.dk +
								"','" +
								resData.dname +
								"','" +
								resData.dversion +
								"')",
							function() {
								//console.log('主表插入成功');
							},
							function() {
								//console.log('主表插入失败');
							}
						);
					},
					function() {
						//console.log('主表删除失败');
					}
				);
			} else {
				dictExecuteSql(
					'insert into ' +
						tableName +
						" (dk,dname,dversion)values('" +
						resData.dk +
						"','" +
						resData.dname +
						"','" +
						resData.dversion +
						"')",
					function() {
						//console.log('主表插入成功');
					},
					function() {
						//console.log('主表插入失败');
					}
				);
			}
		},
		() => {
			//console.log('查询失败');
		}
	);
	dictExecuteSql(
		'delete from ' + tableNameKV[tableName] + ' where dk=' + kid,
		(tx: any, results: any) => {
			if (results.rows.length > 0) {
				dictExecuteSql(
					'delete from ' + tableNameKV[tableName] + ' where dk=' + kid,
					function() {
						resData.son.forEach((ele: any) => {
							dictExecuteSql(
								'insert into ' +
									tableNameKV[tableName] +
									" (JBXH,DMLB,JBMC,JBPB,JBBGK,CDMZZD,PYDM,JBLB ,ICD_CODE,QTXM,FJBM,BZXX,XBXZ,YXZY,YXHZ,YXWY,YXSW,YXQT,KZFS,ZFBZ )values('" +
									ele.jbxh +
									"','" +
									ele.dmlb +
									"','" +
									ele.jbmc +
									"','" +
									ele.jbpb +
									"','" +
									ele.jbbgk +
									"','" +
									ele.cdmzzd +
									"','" +
									ele.pydm +
									"','" +
									ele.jblb +
									"','" +
									ele.icdCode +
									"','" +
									ele.qtxm +
									"','" +
									ele.fjbm +
									"','" +
									ele.bzxx +
									"','" +
									ele.xbxz +
									"','" +
									ele.yxzy +
									"','" +
									ele.yxhz +
									"','" +
									ele.yxwy +
									"','" +
									ele.yxsw +
									"','" +
									ele.yxqt +
									"','" +
									ele.kzfs +
									"','" +
									ele.zfbz +
									"')",
								function() {
									//console.log('子表插入成功');
								},
								function() {
									//console.log('子表插入失败');
								}
							);
						});
					},
					function() {
						//console.log('子表删除失败');
					}
				);
			} else {
				resData.son.forEach((ele: any) => {
					dictExecuteSql(
						'insert into ' +
							tableNameKV[tableName] +
							" (JBXH,DMLB,JBMC,JBPB,JBBGK,CDMZZD,PYDM,JBLB ,ICD_CODE,QTXM,FJBM,BZXX,XBXZ,YXZY,YXHZ,YXWY,YXSW,YXQT,KZFS,ZFBZ )values('" +
							ele.jbxh +
							"','" +
							ele.dmlb +
							"','" +
							ele.jbmc +
							"','" +
							ele.jbpb +
							"','" +
							ele.jbbgk +
							"','" +
							ele.cdmzzd +
							"','" +
							ele.pydm +
							"','" +
							ele.jblb +
							"','" +
							ele.icdCode +
							"','" +
							ele.qtxm +
							"','" +
							ele.fjbm +
							"','" +
							ele.bzxx +
							"','" +
							ele.xbxz +
							"','" +
							ele.yxzy +
							"','" +
							ele.yxhz +
							"','" +
							ele.yxwy +
							"','" +
							ele.yxsw +
							"','" +
							ele.yxqt +
							"','" +
							ele.kzfs +
							"','" +
							ele.zfbz +
							"')",
						function() {
							//console.log('子表插入成功');
						},
						function() {
							//console.log('子表插入失败');
						}
					);
				});
			}
		},
		() => {
			//console.log('查询失败');
		}
	);
}
