import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const groupData: RouteConfig = {
    path: '/groupData',
    component: Layout,
    redirect: 'noRedirect',
    name: 'groupData',
    meta: {
        title: '集团数据管理',
        icon: '',
        alwaysShow: true
    },
    children: [
        {
            path: 'healthInstitution',
            name: 'healthInstitution',
            component: () => import('@/views/his/dic/groupData/healthInstitution/healthInstitution.vue'),
            meta: { title: '医疗卫生机构' }
        },
        {
            path: 'standardDictionary',
            name: 'standardDictionary',
            component: () => import('@/views/his/dic/groupData/standardDictionary/standardDictionary.vue'),
            meta: { title: '国家标准字典' }
        },
        {
            path: 'standardDepartment',
            name: 'standardDepartment',
            component: () => import('@/views/his/dic/groupData/standardDepartment/standardDepartment.vue'),
            meta: { title: '标准科室' }
        },
        {
            path: 'diseaseDiagnose',
            name: 'diseaseDiagnose',
            component: () => import('@/views/his/dic/groupData/diseaseDiagnose/diseaseDiagnose.vue'),
            meta: { title: '疾病诊断ICD10' }
        },
        {
            path: 'chnDiseaseDiagnose',
            name: 'chnDiseaseDiagnose',
            component: () => import('@/views/his/dic/groupData/chnDiseaseDiagnose/chnDiseaseDiagnose.vue'),
            meta: { title: '中医疾病诊断' }
        },
        {
            path: 'operation',
            name: 'operation',
            component: () => import('@/views/his/dic/groupData/operation/operation.vue'),
            meta: { title: '手术操作ICD9' }
        },
        {
            path: 'healthService',
            name: 'healthService',
            component: () => import('@/views/his/dic/groupData/healthService/healthService.vue'),
            meta: { title: '健康服务项目' }
        },
        {
            path: 'drugDictionary',
            name: 'drugDictionary',
            component: () => import('@/views/his/dic/groupData/drugDictionary/drugDictionary.vue'),
            meta: { title: '药品字典' }
        },
    ]
}

const hospitalData: RouteConfig = {
    path: '/hospitalData',
    component: Layout,
    redirect: 'noRedirect',
    name: 'hospitalData',
    meta: {
        title: '医院数据管理',
        icon: '',
        alwaysShow: true
    },
    children: [
        {
            path: 'hospitalDictionary',
            name: 'hospitalDictionary',
            component: () => import('@/views/his/dic/hospitalData/hospitalDictionary/hospitalDictionary.vue'),
            meta: { title: '医院数据字典' }
        },
    ]
}

export { groupData,hospitalData }

