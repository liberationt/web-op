/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-01 10:25:15
 * @LastEditors: 曹俊
 * @Description:
 * @FilePath: \web-op\src\api\his\pha\im_herbpharmacy\inventory.ts
 */
import request from '@/utils/request'
import { log } from 'console'

export interface Iitem {
    pdrq?: string | null
    pdzt?: string | null
    wcrq?: string | null
    czgh?: string | null
    pqje?: number | null,
    phje?: number | null,
    pyje?: number | null,
    pkje?: number | null,
}

export interface Iobj {
    PHAR_YK02_YFSB: number | null
    PHAR_YK02_CKBH: number | null
    PHAR_YK02_PDDH: number | null
    DRUGS_TYPK_PYDM?: string | null
}

export interface Iobject {
    pdwc: number | null
    hzwc: number | null
}

export interface Isearch {
    PHAR_YK01_JGID: number | null
    PHAR_YK01_YFSB: number | null
}

export interface Irkd {
    PHAR_RK01_JGID: number | null
    PHAR_RK01_YFSB: number | null
    PHAR_RK01_RKPB: number | null
}

export interface Ickd {
    PHAR_CK01_JGID: number | null
    PHAR_CK01_YFSB: number | null
    PHAR_CK01_CKPB: number | null
}

export interface Idbrkd {
    PHAR_DB01_CKBZ: number | null
    PHAR_DB01_RKBZ: number | null
    PHAR_DB01_TYPB: number | null
    PHAR_DB01_SQYF: number | null
}

export interface Idbtyd {
   PHAR_DB01_CKBZ: number | null
   PHAR_DB01_RKBZ: number | null
   PHAR_DB01_TYPB: number | null
   PHAR_DB01_MBYF: number | null
}

export interface Isld {
    DRUGS_CK01_CKPB: number | null
    DRUGS_CK01_LYPB: number | null
    DRUGS_CKFS_DYFS: number | null
    DRUGS_CK01_YFSB: number | null
    DRUGS_CK01_JGID: number | null
}

export interface Ityd {
    DRUGS_CK01_CKPB: number | null
    DRUGS_CK01_LYPB: number | null
    DRUGS_CKFS_DYFS: number | null
    DRUGS_CK01_YFSB: number | null
    DRUGS_CK01_JGID: number | null
}

export interface Ifyd {
    OP_CF01_FYBZ: number | null
    OP_CF01_YFSB: number | null
    OP_CF01_ZFPB: number | null
    OP_CF01_FPHM: number | null
}

export interface Ipdfp {
    ckbh: number | null
    pddh: number | null
    yfsb: number | null
    pydm?: number | null
}

export interface Iparam {
    ckbh: number | null
    pddh: number | null
    yfsb: number | null
    hzwc: number | null
    pdwc: number | null
}

export interface Iform {
    pylsje: number | null
    pklsje: number | null
    pyjhje: number | null
    pkjhje: number | null
}

export interface Iforms {
    ypmc: string | null
    ypgg: string | null,
    ypdw: string | null,
    cdmc: string | null,
    lsjg: number | null,
    jhjg: number | null,
    pqsl: number | null,
    spsl: number | null,
    bz: string | null
}

export interface Imodify {
    yf_yk02_grlr_KCSB?: number | null,
    yf_yk02_grlr_YFSB: number | null,
    yf_yk02_grlr_PDDH: number | null,
    yf_yk02_grlr_YPXH: number | null,
    yf_yk02_grlr_YPCD: number | null,
    yf_yk02_grlr_LRBZ: number | null
}

// queryPdData-查询盘点信息(盘点盈亏金额)
export const queryPdData = (data: any) => {
    return request({
        url: `/op-service/check/process/query/data?ckbh=${data.ckbh}&pddh=${data.pddh}&yfsb=${data.yfsb}&hzwc=${data.hzwc}&pdwc=${data.pdwc}`,
        method: 'post',
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}

// queryStatePc-获取盘点状态(是否完成 是否汇总,谁完成)
export const queryStatePc = (data: any) => {
    return request({
        url: `/op-service/check/process/query/state?ckbh=${data.ckbh}&pddh=${data.pddh}&yfsb=${data.yfsb}&hzwc=${data.hzwc}&pdwc=${data.pdwc}`,
        method: 'post',
        // data,
        // headers: {
        //     "Content-Type": "application/json"
        // }
    })
}

// savePharmacyInventoryProcessing-盘点开始
export const startProcess = (data: number) => {
    return request({
        url: `/op-service/check/process/start?yfsb=${data}`,
        method: 'post',
        headers: {
            "Res-Type": "special"
        }
    })
}


// queryKcpdPc-查询药房盘点参数
export const queryKcpdPc = (data: number) => {
    return request({
        url: `/op-service/check/process/query/param?yfsb=${data}`,
        method: 'post',
    })
}
// saveDispensing-发药
export const saveDispensing = (data: any) => {
    return request({
        url: '/op-service/pharmacy/direct/grant/do/save/dispensing',
        method: 'post',
        data
    })
}

// querySfpdfp-查询是否可以分配盘点药品
export const querySfpdfp = (data: any) => {
    return request({
        url: '/op-service/check/process/query/sfpdfp',
        method: 'post',
        data
    })
}

// savePharmacyInventoryFP-保存盘点分配人员信息
export const savePharmacyInventoryFP = (data: any) => {
    return request({
        url: '/op-service/check/process/pdfp/save',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}


// removePharmacyInventoryProcessing-删除盘点单
export const romoveProcess = (data: any) => {
    return request({
        url: '/op-service/check/process/remove',
        method: 'post',
        data
    })
}

// savePharmacyInventoryProcessingHz-盘点汇总(取消汇总)
export const summaryProcess = (data: any) => {
    return request({
        url: '/op-service/check/process/summary',
        method: 'post',
        data
    })
}

// queryPharmacyInventoryProcessingWc-盘点处理完成盈亏金额查询
export const queryWcje = (data: any) => {
    return request({
        url: '/op-service/check/process/query/wcje',
        method: 'post',
        data
    })
}

// savePharmacyInventoryProcessingWc-盘点处理完成确认
export const savePdwc = (data: any) => {
    return request({
        url: '/op-service/check/process/save/pdwc',
        method: 'post',
        data
    })
}

// savePharmacyInventoryProcessingXgsl-药房盘点修改数量
export const updatePdsl = (data: any) => {
    return request({
        url: '/op-service/check/process/update/pdsl',
        method: 'post',
        data,
        headers: {
            "Content-Type": "application/json"
        }
    })
}

