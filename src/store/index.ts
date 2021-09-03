/*
 * @Author: wangyao
 * @LastEditTime: 2020-07-12 14:13:27
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\store\index.ts
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'
import { ITagsViewState } from './modules/tags-view'
import { IErrorLogState } from './modules/error-log'
import { IPermissionState } from './modules/permission'
import { ISettingsState } from './modules/settings'
import webSqlDict from './modules/webSqlDict'
import patientObj from './modules/patientObj'
import pnParam from './modules/pnParam'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  tagsView: ITagsViewState
  errorLog: IErrorLogState
  permission: IPermissionState
  settings: ISettingsState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({
  modules:{
    webSqlDict, // 前端数据库字典store
    patientObj, // 患者相关内容store
    pnParam, // 门诊医生站
  }
})
