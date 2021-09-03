/*
 * @Author: 张文奇
 * @Date: 2020-04-16 11:38:08
 * @LastEditTime: 2020-04-16 16:18:35
 * @Description:
 * @FilePath: \web-op\src\api\his\medinsuinterface\medicalDevice.ts
 */
import axios from '@/utils/request'

export interface itemEquipment {
    ybCode: string;	//医保编码
    payType: string;//支付方式
    materialName: string;//项目名称
    materialSpec: string;//规格
    autName: string;//计价单位
    firstLevel: string;	//一级目录
    secondLevel: string;//二级目录
}

/**
 * @description: add 医疗器材
 * @param {type}
 * @return:
 */
export const addEquipment = (data: any) => {
    return axios.request({
        url: "/op-service/shybzlxmxx/add",
        data,
        method: "post"
    })
};

/**
 * @description: edit 医疗器材
 * @param {type}
 * @return:
 */
export const editEquipment = (data: any) => {
    return axios.request({
        url: "/op-service/shybzlxmxx/edit",
        data,
        method: "post"
    })
};
