/*
 * @Author: 曹俊
 * @LastEditTime: 2020-04-16 20:29:13
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\router\modules\guidance.ts
 */
import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const guidanceData: RouteConfig = {
    path: '/guidanceData',
    name: 'guidanceData',
    component: Layout,
    redirect: 'noRedirect',
    meta: {
        title: '门诊导诊',
        icon: '',
        alwaysShow: true
    },
    children: [
        {
            path: 'reception',
            name: 'reception',
            meta: { title: '服务台设置' },
            component: () => import('@/views/his/op/guidance/reception/reception.vue')
        },
        {
            path: 'clinic',
            name: 'clinic',
            component: () => import('@/views/his/op/guidance/clinic/clinic.vue'),
            meta: { title: '诊室设置' }
        },
        {
            path: 'shift',
            name: 'shift',
            component: () => import('@/views/his/op/guidance/shift/shift.vue'),
            meta: { title: '班次时间设置' }
        },
        {
            path: 'queueNumber',
            name: 'shift',
            component: () => import('@/views/his/op/guidance/queueNumber/index.vue'),
            meta: { title: '诊室排队叫号' }
        },
    //     {
    //         path: 'diseaseDiagnose',
    //         name: 'diseaseDiagnose',
    //         component: () => import('@/views/his/dic/groupData/diseaseDiagnose/diseaseDiagnose.vue'),
    //         meta: { title: '疾病诊断ICD10' }
    //     },
    //     {
    //         path: 'chnDiseaseDiagnose',
    //         name: 'chnDiseaseDiagnose',
    //         component: () => import('@/views/his/dic/groupData/chnDiseaseDiagnose/chnDiseaseDiagnose.vue'),
    //         meta: { title: '中医疾病诊断' }
    //     },
    //     {
    //         path: 'operation',
    //         name: 'operation',
    //         component: () => import('@/views/his/dic/groupData/operation/operation.vue'),
    //         meta: { title: '手术操作ICD9' }
    //     },
    //     {
    //         path: 'healthService',
    //         name: 'healthService',
    //         component: () => import('@/views/his/dic/groupData/healthService/healthService.vue'),
    //         meta: { title: '健康服务项目' }
    //     },
    //     {
    //         path: 'drugDictionary',
    //         name: 'drugDictionary',
    //         component: () => import('@/views/his/dic/groupData/drugDictionary/drugDictionary.vue'),
    //         meta: { title: '药品字典' }
    //     },
    ]
}



export { guidanceData }

