/*
 * @Author: 张文奇
 * @Date: 2020-04-16 11:22:42
 * @LastEditTime: 2020-04-22 09:34:38
 * @LastEditors: 曹俊
 * @Description: 医保数据管理路由
 * @FilePath: \web-op\src\router\modules\medinsuinterface.ts
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const medinsuinterface: RouteConfig = {
  path: '/medinsuinterface',
  component: Layout,
  redirect: 'noRedirect',
  name: 'medinsuinterface',
  meta: {
    title: '医保数据管理',
    icon: '',
    alwaysShow: true
  },
  children: [
    {
      path: 'medicareData',
      name: 'medicareData',
      component: () => import('@/views/his/medinsuinterface/medicareData/medicareData.vue'),
      meta: { title: '医保数据代码表' }
    },
    {
      path: 'medicalDevice',
      name: 'medicalDevice',
      component: () => import('@/views/his/medinsuinterface/medicalDevice/medicalDevice.vue'),
      meta: { title: '医疗器材信息' }
    },
    {
      path: 'treatmentItems',
      name: 'treatmentItems',
      component: () => import('@/views/his/medinsuinterface/treatmentItems/treatmentItems.vue'),
      meta: { title: '诊疗项目信息' }
    },
    {
      path: 'physicianRegister',
      name: 'physicianRegister',
      component: () => import('@/views/his/medinsuinterface/physicianRegister/physicianRegister.vue'),
      meta: { title: '医师注册信息' }
    },
    {
      path: 'pharmacyDrugsInfo',
      name: 'pharmacyDrugsInfo',
      component: () => import('@/views/his/medinsuinterface/pharmacyDrugsInfo/pharmacyDrugsInfo.vue'),
      meta: { title: '药事药品信息' }
    }

  ]
}

export default medinsuinterface
