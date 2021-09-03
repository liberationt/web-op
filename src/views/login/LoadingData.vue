<template>
	<div v-if="updPassOrLoad" class="centerDiv">
		<el-card class="box-card"  shadow="hover">
			<div slot="header" class="clearfix">
				<span class='title'>{{$t('loadData.title')}}</span>
			</div>
			<div>
				<span class="tips" >Tips：{{$t('loadData.tips')}}</span>
			</div>
			<div style="margin-top:16px">
				<el-form :model="ruleForm" :rules="rules" ref="formValidate" label-width="100px" class="demo-ruleForm">
					<el-form-item label="原密码" prop="oldpw">
						<el-input v-model="ruleForm.oldpw" show-password></el-input>
					</el-form-item>
					<el-form-item label="新密码" prop="newpw">
						<el-input v-model="ruleForm.newpw" show-password></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="qrpw">
						<el-input v-model="ruleForm.qrpw" show-password></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div style="width:100%;text-align:center">
				<el-button type="primary"  class="blue-gra" icon="icon his-save" @click="submitPw" >{{$t('loadData.submitPw')}}</el-button>
			</div>
		</el-card>
	</div>
	<div v-else class="loadPage" style="width:100%;height:100%" v-loading="fullscreenLoading" :element-loading-text="msg"></div>
</template>

<script lang='ts'>
import { Component, Watch, Vue } from "vue-property-decorator";
import { getRegion,getPrimaryDic,getHspbasicdata,getDicJson,getYwAllDic,regionJson,getJCJYAllData } from '@/api/his/basic'
import { dictExecuteSql } from '@/websql/functions'
import { updataPassWord } from '@/api/his/user/sysUser'
import { setToken } from '@/utils/cookies'
// import primarydata from "@/api/primarydata";

@Component({
	name: "LoadingData",
	//组件引用
	components: {
	},
	filters: {}
})
export default class extends Vue {
	//声明变量默认值（原data中数据）
	private msg: string= "正在加载"
	private fullscreenLoading:boolean = false
	private updPassOrLoad:boolean = false
	private tableList:Array<any> = []
	private failedList:Array<any> = []
	private tableList_FB:Array<any> = []
	private primaryList:Array<any> = [] // 标识数据表
	private regionList:Array<any> = [] // 行政区划表
	private dicJsonList:Array<any> = [] // 标识字典
	private configJsonList:Array<any> = [] // 业务字典
	private jcjyList:Array<any> = [] // 检查检验字典
	private ruleForm:any = {
		oldpw:'',
		newpw:'',
		qrpw:'',
	}
	private validateOldPw  = (rule: any, value: any, callback: any)=>{
		var regLetter = /[A-Za-z]/;
		var regNum = /[0-9]/;
		var regTeShu =new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？+-]");
		var complex = 0;
		if (regLetter.test( value)){
			++complex;
		}
		if (regNum.test( value)){
			++complex;
		}
		if (regTeShu.test( value)){
			++complex;
		}
		if(this.ruleForm.oldpw  === this.ruleForm.newpw){
			callback(new Error('新密码与旧密码重复，请设置新密码！'))
		}else if (value.length < 8 || complex < 3){
			callback('密码最少8位，且必须包含字母、数字、字符!')
		}else {
			callback()
		}
	}
	private validatePw = (rule: any, value: any, callback: any)=>{
		if(this.ruleForm.qrpw !== this.ruleForm.newpw){
			callback(new Error('两次输入密码不一致！'))
		}else{
			callback()
		}
	}
	private rules:any = {
		oldpw: [ { required: true, message: '请输入原密码！', trigger: 'blur' } ],
		newpw: [ { required: true, message: '请输入新密码！', trigger: 'blur' },
		 {validator: this.validateOldPw , trigger: 'blur'}],
		qrpw: [ { required: true, message: '请输入确认密码！', trigger: 'blur' },
		 {validator: this.validatePw , trigger: 'blur'} ],
	}


	get userInfo() {
		return JSON.parse(localStorage.userInfo)
	}
	//钩子函数
	created() {
		if(this.userInfo.changPasswd == 1 || this.userInfo.changPasswd == null) this.updPassOrLoad = true
	}
	mounted() {
		if(!this.updPassOrLoad) this.init()
	}

	@Watch('updPassOrLoad')
  	private updPassOrLoadChange(value: any) {
		if(!value) this.init()
	}

	//原methods中的方法
	private init() {
		this.fullscreenLoading = true
		const _that = this  // 赋值this指向
		_that.tableList = Vue.prototype.tableList
		_that.tableList_FB = []
		// 开始进行websql事务
		Vue.prototype.$db.transaction(function (tx:any) {
			// _that.tableList.forEach(item => {
			for(let i=0;i<_that.tableList.length;i++){
				tx.executeSql('SELECT * FROM ' + _that.tableList[i], [],
					function (tx:any, results:any) {
						// 查询成功
						console.log('查到'+_that.tableList[i])
						_that.tableList_FB.push(_that.tableList[i])
						if(_that.tableList_FB.length == _that.tableList.length) { // 表创建结束
							_that.msg = '正在加载'
							_that.updPassOrLoad = false
							_that.$router.push({path:'dashboard'}).catch((err)=>{})  // 回到首页
						}
					},
					function (tx:any, error:any) {
						// console.log( _that.tableList[i] + '查询失败: ' + error.message )
						switch(_that.tableList[i]){
							case 'TB_REGION':
								_that.getRegionFun(_that);
							break;
							case 'SYS_PRIMARY_DATA':
								_that.getPrimaryDicFun(_that);
							break;
							// case 'HSP_DATA_MAIN':
							// 	_that.getHspbasicdataFun(_that);
							// break;
							case 'SYS_FLAG_DATA':
								_that.getDicJsonFun(_that);
							break;
							case 'SYS_DICT_CONFIG':
								_that.getYwAllDicFun(_that);
							break;
							case 'GY_JBBM_VERSION':
								_that.getJCJYAllDataFun(_that);
							break;
						}
					}
				);
			}
		});
		// _that.$router.push({path:'dashboard'})  // 回到首页
	}

	submitPw () {
		(this.$refs.formValidate as any).validate((valid: any) => {
			if(valid){
				updataPassWord(this.ruleForm).then((res:any) => {
					this.userInfo.changPasswd = 2
					localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
					setToken(localStorage.token)
					this.updPassOrLoad = false
				})
			}else{

			}
		})
	}
	// 行政区划表
	private getRegionFun(_that:any){
		_that.regionList = JSON.parse(localStorage.regionList)
		// console.log(_that.regionList)
		// 创建行政区划表
		Vue.prototype.$db.transaction(function(tx:any){
			_that.msg = '创建行政区划表'
			tx.executeSql('CREATE TABLE IF NOT EXISTS TB_REGION (kid INT PRIMARY KEY,kname varchar(50),klevel INT,parentId INT ,wb varchar(10),py varchar(20))',[],
				function (tx:any, result:any) { //执行成功的回调函数
					// 添加行政区划数据
					_that.msg = '行政区划表数据导入'
					_that.regionList.forEach((ele:any,i:number) => {
						tx.executeSql("insert into TB_REGION (kid,kname,klevel,parentId,wb,py)values('"+ele.id+"','"+ele.name+"','"+ele.level+"','"+ele.parentId+"','"+ele.wbCode+"','"+ele.pyCode+"')",[],function (tx:any, result:any) {

						},function (tx:any, error:any) { //执行失败的回调函数string
							const errMsg = '行政区划表【'+ele.name+'】导入失败'
							_that.failedList.push(errMsg)
							_that.msg = ele.name + '导入失败'+ error.message
						});
						if(_that.regionList.length - 1 == i) {
							_that.msg = '行政区划表数据导入完成'
							_that.tableList_FB.push('TB_REGION')
							if(_that.tableList_FB.length == _that.tableList.length) { // 表创建结束
								_that.msg = '正在加载'
								_that.updPassOrLoad = false
								_that.$router.push({path:'dashboard'}).catch(()=>{})  // 回到首页
							}
						}
					});
				},
				function (tx:any, error:any) { //执行失败的回调函数
					alert('创建失败: ' + error.message);
				}
			);
		});
	}

	// 标识数据表
	private async getPrimaryDicFun(_that:any){
		const res =await getPrimaryDic()
		_that.primaryList = res.data
		// console.log(_that.primaryList)
		Vue.prototype.$db.transaction(function(tx:any){
			_that.msg = '创建标识数据主表'
			tx.executeSql('CREATE TABLE IF NOT EXISTS SYS_PRIMARY_DATA (dk varchar(100),dname varchar(20),dversion INT)',[],
				function (tx:any, result:any){
					// 创建主表成功
					_that.msg = '创建标识数据子表'
					tx.executeSql('CREATE TABLE IF NOT EXISTS SYS_PRIMARY_DATA_VALUE (dk varchar(100),dv varchar(20),dn varchar(50),wb varchar(10),py varchar(20),showOrder INT,stop varchar(20))',[],
						function(tx:any, result:any){
							// 创建子表成功
							_that.msg = '标识数据记录表数据导入'
							_that.primaryList.forEach((item:any,index:number) => {
								tx.executeSql("insert into SYS_PRIMARY_DATA (dk,dname,dversion)values('"+item.dk+"','"+item.dname+"','"+item.dversion+"')",[],
									function (tx:any, result:any) {
										// _that.msg = '标识数据主记录表数据导入完成'
									},
									function (tx:any, error:any) { //执行失败的回调函数string
										const errMsg = '标识数据主记录表【'+item.dname+'】导入失败'
										_that.failedList.push(errMsg)
										_that.msg = item.dname + '导入失败'+ error.message
									}
								);
								item.son.forEach((ele:any,i:number) => {
									tx.executeSql("insert into SYS_PRIMARY_DATA_VALUE (dk,dv,dn,wb,py,showOrder,stop)values('"+item.dk+"','"+ele.dv+"','"+ele.dn+"','"+(ele.wb?ele.wb.toUpperCase():ele.wb)+"','"+(ele.py?ele.py.toUpperCase():ele.py)+"','"+ele.showOrder+"','"+ele.stop+"')",[],
										function (tx:any, result:any) {
											// _that.msg = '标识数据主记录表数据导入完成'
										},
										function (tx:any, error:any) { //执行失败的回调函数string
											const errMsg = '标识数据主记录表【'+ele.dn+'】导入失败'
											console.log("*****:",errMsg,error)
											_that.failedList.push(errMsg)
											_that.msg = ele.dn + '导入失败'+ error.message
										}
									);
								});
								if(index == _that.primaryList.length -1) { // 执行索引
									_that.msg = '标识数据记录表数据导入完成'
									dictExecuteSql('CREATE INDEX dk1_index ON SYS_PRIMARY_DATA (dk)',function (tx:any, result:any) {
										console.log('CREATE INDEX dk1_index ON SYS_PRIMARY_DATA (dk) 成功执行')
										dictExecuteSql('CREATE INDEX pid_index ON SYS_PRIMARY_DATA_VALUE (dk)',function (tx:any, result:any) {
											console.log('CREATE INDEX pid_index ON SYS_PRIMARY_DATA_VALUE (dk) 成功执行')
											_that.msg = '标识数据记录表索引创建完成'
											_that.tableList_FB.push('PRIMARY_DIC_MAIN')
											// console.log(_that.tableList_FB.length)
											// console.log(_that.tableList.length)
											if(_that.tableList_FB.length == _that.tableList.length) { // 表创建结束
												_that.msg = '正在加载'
												_that.updPassOrLoad = false
												_that.$router.push({path:'dashboard'}).catch(()=>{})  // 回到首页
											}
										})
									})
								}
							})
						}, function(tx:any, error:any){
							console.log('创建子表失败')
						},
					);
				},function (tx:any, result:any){
					console.log('创建主表失败')
				}
			);
		});
	}

	// 医院字典
	// private getHspbasicdataFun(_that:any){
	// 	getHspbasicdata().then(res=> {
	// 		_that.hspbasicdata = res.data
	// 		// console.log(_that.hspbasicdata)
	// 		Vue.prototype.$db.transaction(function(tx:any){
	// 			_that.msg = '创建医院字典主表'
	// 			tx.executeSql('CREATE TABLE IF NOT EXISTS HSP_DATA_MAIN (dk INT,dname varchar(20),dversion INT)',[],
	// 				function (tx:any, result:any){
	// 					// 创建主表成功
	// 					_that.msg = '创建医院字典子表'
	// 					tx.executeSql("CREATE TABLE IF NOT EXISTS HSP_DATA_SON (pid INT,dv varchar(20),dn varchar(50),wb varchar(10),py varchar(20))",[],
	// 						function(tx:any, result:any){
	// 							// 创建子表成功
	// 							_that.msg = '医院字典数据导入'
	// 							if(_that.hspbasicdata.length == 0) {
	// 								_that.$router.push({path:'dashboard'})  // 回到首页
	// 							}
	// 							_that.hspbasicdata.forEach((item:any,index:any) => {
	// 								tx.executeSql("insert into HSP_DATA_MAIN (dk,dname,dversion)values('"+item.dk+"','"+item.dname+"','"+item.dversion+"')",[],
	// 									function (tx:any, result:any) {
	// 										// _that.msg = '标识数据主记录表数据导入完成'
	// 									},
	// 									function (tx:any, error:any) { //执行失败的回调函数string
	// 										const errMsg = '医院字典主表【'+item.dname+'】导入失败'
	// 										_that.failedList.push(errMsg)
	// 										_that.msg = item.dname + '导入失败'+ error.message
	// 									}
	// 								);
	// 								item.son.forEach((ele:any,i:any) => {
	// 									tx.executeSql("insert into HSP_DATA_SON (pid,dv,dn,wb,py)values('"+item.dk+"','"+ele.dv+"','"+ele.dn+"','"+ele.wb+"','"+ele.py+"')",[],
	// 										function (tx:any, result:any) {
	// 											// _that.msg = '标识数据主记录表数据导入完成'
	// 										},
	// 										function (tx:any, error:any) { //执行失败的回调函数string
	// 											const errMsg = '医院字典子表【'+ele.dn+'】导入失败'
	// 											_that.failedList.push(errMsg)
	// 											_that.msg = ele.dn + '导入失败'+ error.message
	// 										}
	// 									);
	// 								});
	// 								if(index == _that.hspbasicdata.length -1) { // 执行索引
	// 									_that.msg = '医院字典表数据导入完成';
	// 									dictExecuteSql("CREATE INDEX dk2_index ON HSP_DATA_MAIN (dk)",function (tx:any, result:any) {
	// 									},function (tx:any, err:any) {
	// 										console.log('索引创建失败',err.message)
	// 									})
	// 									dictExecuteSql("CREATE INDEX pid2_index ON HSP_DATA_SON (pid)",function (tx:any, result:any) {
	// 										// console.log('索引(pid) 成功执行')
	// 										_that.msg = '医院字典表索引创建完成';
	// 									},function (tx:any, err:any) {
	// 										console.log('索引创建失败',err.message)
	// 									})
	// 									_that.tableList_FB.push('HSP_DATA_MAIN');
	// 									if(_that.tableList_FB.length == _that.tableList.length) { // 表创建结束
	// 										console.log('字典表')
	// 										_that.msg = '正在加载';
	// 										_that.$router.push({path:'dashboard'})  // 回到首页
	// 									}
	// 								}
	// 							})
	// 						}, function(tx:any, error:any){
	// 							console.log('创建子表失败')
	// 						},
	// 					);
	// 				},function (tx:any, result:any){
	// 					console.log('创建主表失败')
	// 				}
	// 			);
	// 		});
	// 	})
	// }

	// 标识字典
	private getDicJsonFun(_that:any){
		getDicJson(null).then((res:any)=> {
			_that.dicJsonList = res.data
			// console.log(_that.dicJsonList)
			Vue.prototype.$db.transaction(function(tx:any){
				_that.msg = '创建标识字典主表'
				tx.executeSql('CREATE TABLE IF NOT EXISTS SYS_FLAG_DATA (dk varchar(100),dname varchar(20),dversion INT)',[],
					function (tx:any, result:any){
						// 创建主表成功
						_that.msg = '创建标识字典子表'
						tx.executeSql('CREATE TABLE IF NOT EXISTS SYS_FLAG_DATA_VALUE (dk varchar(100),dv varchar(20),dn varchar(50),wb varchar(10),py varchar(20),showOrder INT,stop varchar(20))',[],
							function(tx:any, result:any){
								// 创建子表成功
								_that.msg = '标识字典数据导入'
								if(_that.dicJsonList.length == 0) {
									_that.updPassOrLoad = false
									_that.$router.push({path:'dashboard'})  // 回到首页
								}
								_that.dicJsonList.forEach((item:any,index:any) => {
									tx.executeSql("insert into SYS_FLAG_DATA (dk,dname,dversion)values('"+item.dk+"','"+item.dname+"','"+item.dversion+"')",[],
										function (tx:any, result:any) {
											// _that.msg = '标识数据主记录表数据导入完成'
										},
										function (tx:any, error:any) { //执行失败的回调函数string
											const errMsg = '标识字典主表【'+item.dname+'】导入失败'
											_that.failedList.push(errMsg)
											_that.msg = item.dname + '导入失败'+ error.message
										}
									);
									item.son.forEach((ele:any,i:any) => {
										tx.executeSql("insert into SYS_FLAG_DATA_VALUE (dk,dv,dn,wb,py,showOrder,stop)values('"+item.dk+"','"+ele.dv+"','"+ele.dn+"','"+(ele.wb?ele.wb.toUpperCase():ele.wb)+"','"+(ele.py?ele.py.toUpperCase():ele.py)+"','"+ele.showOrder+"','"+ele.stop+"')",[],
											function (tx:any, result:any) {
												// _that.msg = '标识数据主记录表数据导入完成'
											},
											function (tx:any, error:any) { //执行失败的回调函数string
												const errMsg = '标识字典子表【'+ele.dn+'】导入失败'
												_that.failedList.push(errMsg)
												_that.msg = ele.dn + '导入失败'+ error.message
											}
										);
									});
									if(index == _that.dicJsonList.length -1) { // 执行索引
										_that.msg = '标识字典表数据导入完成';
										dictExecuteSql("CREATE INDEX dk_bs_index ON SYS_FLAG_DATA (dk)",function (tx:any, result:any) {
										},function (tx:any, err:any) {
											console.log('索引创建失败',err.message)
										})
										dictExecuteSql("CREATE INDEX pid_bs_index ON SYS_FLAG_DATA_VALUE (dk)",function (tx:any, result:any) {
											// console.log('索引(pid) 成功执行')
											_that.msg = '标识字典表索引创建完成';
										},function (tx:any, err:any) {
											console.log('索引创建失败',err.message)
										})
										_that.tableList_FB.push('SYS_FLAG_DATA');
										if(_that.tableList_FB.length == _that.tableList.length) { // 表创建结束
											console.log('字典表')
											_that.msg = '正在加载';
											_that.updPassOrLoad = false
											_that.$router.push({path:'dashboard'}).catch(()=>{})  // 回到首页
										}
									}
								})
							}, function(tx:any, error:any){
								console.log('创建子表失败')
							},
						);
					},function (tx:any, result:any){
						console.log('创建主表失败')
					}
				);
			});
		})
	}

	// 业务字典
	private getYwAllDicFun(_that:any){
		getYwAllDic(null).then(res=> {
			_that.configJsonList = res.data
			// console.log(_that.configJsonList)
			// return
			Vue.prototype.$db.transaction(function(tx:any){
				_that.msg = '创建业务字典主表'
				tx.executeSql('CREATE TABLE IF NOT EXISTS SYS_DICT_CONFIG (dk varchar(100),dname varchar(20),dversion INT)',[],
					function (tx:any, result:any){
						// 创建主表成功
						_that.msg = '创建业务字典子表'
						tx.executeSql('CREATE TABLE IF NOT EXISTS SYS_DICT_CONFIG_VALUE (dk varchar(100),dv varchar(20),dn varchar(50),ex varchar(2000),wb varchar(10),py varchar(20),showOrder INT,stop varchar(20))',[],
							function(tx:any, result:any){
								// 创建子表成功
								_that.msg = '业务字典数据导入'
								if(_that.configJsonList.length == 0) {
									_that.updPassOrLoad = false
									_that.$router.push({path:'dashboard'})  // 回到首页
								}
								_that.configJsonList.forEach((item:any,index:any) => {
									tx.executeSql("insert into SYS_DICT_CONFIG (dk,dname,dversion)values('"+item.dk+"','"+item.dname+"','"+item.dversion+"')",[],
										function (tx:any, result:any) {
											// _that.msg = '业务字典主表数据导入完成'
										},
										function (tx:any, error:any) { //执行失败的回调函数string
											const errMsg = '业务字典主表【'+item.dname+'】导入失败'
											_that.failedList.push(errMsg)
											_that.msg = item.dname + '导入失败'+ error.message
										}
									);
									item.son.forEach((ele:any,i:any) => {
										var sonStr = JSON.stringify(ele)
										tx.executeSql("insert into SYS_DICT_CONFIG_VALUE (dk,dv,dn,ex,wb,py,showOrder,stop)values('"+item.dk+"','"+ele.dv+"','"+ele.dn+"','"+sonStr+"','"+(ele.wb?ele.wb.toUpperCase():ele.wb)+"','"+(ele.py?ele.py.toUpperCase():ele.py)+"','"+ele.showOrder+"','"+ele.stop+"')",[],
											function (tx:any, result:any) {
												// _that.msg = '业务字典子表导入成功'
											},
											function (tx:any, error:any) { //执行失败的回调函数string
												const errMsg = '业务字典子表【'+ele.dn+'】导入失败'
												_that.failedList.push(errMsg)
												_that.msg = ele.dn + '导入失败'+ error.message
											}
										);
									});
									if(index == _that.configJsonList.length -1) { // 执行索引
										_that.msg = '业务字典表数据导入完成';
										dictExecuteSql("CREATE INDEX dk_yw_index ON SYS_DICT_CONFIG (dk)",function (tx:any, result:any) {
										},function (tx:any, err:any) {
											console.log('索引创建失败',err.message)
										})
										dictExecuteSql("CREATE INDEX pid_yw_index ON SYS_DICT_CONFIG_VALUE (dk)",function (tx:any, result:any) {
											// console.log('索引(pid) 成功执行')
											_that.msg = '业务字典表索引创建完成';
										},function (tx:any, err:any) {
											console.log('索引创建失败',err.message)
										})
										_that.tableList_FB.push('SYS_DICT_CONFIG');
										if(_that.tableList_FB.length == _that.tableList.length) { // 表创建结束
											console.log('字典表')
											_that.msg = '正在加载';
											_that.updPassOrLoad = false
											_that.$router.push({path:'dashboard'}).catch(()=>{})  // 回到首页
										}
									}
								})
							}, function(tx:any, error:any){
								console.log('创建业务字典子表失败')
							},
						);
					},function (tx:any, result:any){
						console.log('创建主表失败')
					}
				);
			});
		})
	}

	// 检查检验字典
	private getJCJYAllDataFun(_that:any){
		getJCJYAllData(null).then(res=> {
			_that.jcjyList = [res.data]
			console.log(_that.jcjyList)
			Vue.prototype.$db.transaction(function(tx:any){
				_that.msg = '创建检验检查主表';
				tx.executeSql('CREATE TABLE IF NOT EXISTS GY_JBBM_VERSION (dk varchar(100),dname varchar(20),dversion INT)',[],
					function (tx:any, result:any){
						// 创建主表成功
						_that.msg = '创建检验检查子表';
						tx.executeSql('CREATE TABLE IF NOT EXISTS GY_JBBM (JBXH INT,DMLB INT,JBMC varchar(150), JBPB varchar(30), JBBGK varchar(10), CDMZZD INT,PYDM varchar(100),JBLB INT,ICD_CODE varchar(30) ,QTXM  varchar(20) ,FJBM varchar(20),BZXX  varchar(100),XBXZ int,YXZY int,YXHZ int,YXWY int,YXSW int, YXQT int, KZFS int,ZFBZ INT)',[],
							function(tx:any, result:any){
								// 创建子表成功
								_that.msg = '检验检查数据导入';
								if(_that.jcjyList.length == 0) {
									_that.updPassOrLoad = false;
									_that.$router.push({path:'dashboard'});  // 回到首页
								}
								_that.jcjyList.forEach((item:any,index:any) => {
									tx.executeSql("insert into GY_JBBM_VERSION (dk,dname,dversion)values('"+item.dk+"','"+item.dname+"','"+item.dversion+"')",[],
										function (tx:any, result:any) {
											_that.msg = '检验检查主表数据导入完成';
										},
										function (tx:any, error:any) { //执行失败的回调函数string
											const errMsg = '检验检查主表【'+item.dname+'】导入失败';
											_that.failedList.push(errMsg);
											_that.msg = item.dname + '导入失败'+ error.message;
											console.log(_that.msg);
										}
									);
									item.son.forEach((ele:any,i:any) => {
										tx.executeSql("insert into GY_JBBM (JBXH,DMLB,JBMC,JBPB,JBBGK,CDMZZD,PYDM,JBLB ,ICD_CODE,QTXM,FJBM,BZXX,XBXZ,YXZY,YXHZ,YXWY,YXSW,YXQT,KZFS,ZFBZ )values('"+ele.jbxh+"','"+ele.dmlb+"','"+ele.jbmc+"','"+ele.jbpb+"','"+ele.jbbgk+"','"+ele.cdmzzd+"','"+ele.pydm+"','"+ele.jblb +"','"+ele.icdCode+"','"+ele.qtxm+"','"+ele.fjbm+"','"+ele.bzxx+"','"+ele.xbxz+"','"+ele.yxzy+"','"+ele.yxhz+"','"+ele.yxwy+"','"+ele.yxsw+"','"+ele.yxqt+"','"+ele.kzfs+"','"+ele.zfbz+"')",[],
											function (tx:any, result:any) {
												if(i == item.son.length -1) { // 执行索引
													_that.msg = '检验检查数据导入完成';
													console.log('检验检查数据导入完成');
													dictExecuteSql("CREATE INDEX dk_jbbm_index ON GY_JBBM (JBXH)",function (tx:any, result:any) {
													},function (tx:any, err:any) {
														console.log('索引创建失败',err.message);
													})
													_that.tableList_FB.push('GY_JBBM_VERSION');
													if(_that.tableList_FB.length == _that.tableList.length) { // 表创建结束
														console.log('字典表错误内容：',_that.failedList);
														_that.msg = '正在加载';
														_that.updPassOrLoad = false;
														_that.$router.push({path:'dashboard'}).catch(()=>{}); // 回到首页
													}
												}else{
													_that.msg = '检验检查数据正在导入';
												}
											},
											function (tx:any, error:any) { //执行失败的回调函数string
												// console.log(ele.jbmc)
												const errMsg = '检验检查子表【'+ele.jbmc+'】导入失败';
												_that.failedList.push(errMsg);
												_that.msg = ele.jbmc + '导入失败'+ error.message;
											}
										);
									});

								})
							}, function(tx:any, error:any){
								console.log('创建子表失败');
							},
						);
					},function (tx:any, result:any){
						console.log('创建主表失败');
					}
				);
			});
		})
	}
}
</script>

<style lang='scss'>
.loadPage .el-icon-loading:before {
    font-size: 60px!important;
}
.centerDiv{
	width:600px;
    height:400px;
    position:fixed;
    left:50%;
    top:50%;
	margin:-300px 0 0 -300px;

	.title{
		font-weight: bold;
		font-size: 24px;
	}
	.tips{
		padding-left:16px ;
		font-weight: bold;
		font-size: 14px;
		color: red;
	}
}

</style>