import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const dicManage: RouteConfig = {
  path: '/dicManage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'dicManage',
  meta: {
    title: '字典管理',
    icon: '',
    alwaysShow: true
  },
  children: [
    {
      path: 'healthInstitutionSetting',
      name: 'healthInstitutionSetting',
      component: () => import('@/views/his/dic/healthInstitutionSetting/healthInstitutionSetting.vue'),
      meta: { title: '医疗卫生机构设置' }
    },
    {
      path: 'departmentSetting',
      name: 'departmentSetting',
      component: () => import('@/views/his/dic/departmentSetting/departmentSetting.vue'),
      meta: { title: '科室设置' }
    },
    {
      path: 'hospitalDataSetting',
      name: 'hospitalDataSetting',
      component: () => import('@/views/his/dic/hospitalDataSetting/hospitalDataSetting.vue'),
      meta: { title: '医院数据构设置' }
    },
    {
      path: 'standardDiagnose',
      name: 'standardDiagnose',
      component: () => import('@/views/his/dic/standardDiagnose/standardDiagnose.vue'),
      meta: { title: '标准疾病诊断' }
    },
    {
      path: 'westMedicineDiagnose',
      name: 'westMedicineDiagnose',
      component: () => import('@/views/his/dic/westMedicineDiagnose/westMedicineDiagnose.vue'),
      meta: { title: '医院西医疾病诊断' }
    },
    {
      path: 'chnMedicineDiagnose',
      name: 'chnMedicineDiagnose',
      component: () => import('@/views/his/dic/chnMedicineDiagnose/chnMedicineDiagnose.vue'),
      meta: { title: '医院中医疾病诊断' }
    },
    {
      path: 'standardOperation',
      name: 'standardOperation',
      component: () => import('@/views/his/dic/standardOperation/standardOperation.vue'),
      meta: { title: '标准手术操作编码' }
    },
    {
      path: 'hospitalOperation',
      name: 'hospitalOperation',
      component: () => import('@/views/his/dic/hospitalOperation/hospitalOperation.vue'),
      meta: { title: '医院手术操作编码' }
    },

  ]
}

export default dicManage
