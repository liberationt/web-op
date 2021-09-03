/*
 * @Author: 张文奇
 * @Date: 2020-04-16 11:37:28
 * @LastEditTime: 2020-04-16 15:36:55
 * @Description:
 * @FilePath: \web-op\src\api\his\medinsuinterface\treatmentItems.ts
 */
import axios from '@/utils/request'

export interface itemTreament {
    autName: string, //计价单位
    beginDate: string, //信息起效日期
    costType: string, //费用类别
    dataVersion: number, //版本号
    endDate: string, //信息失效日期
    excludedContent: string, //除外内容
    gmtCreate: string, //创建时间
    gmtModify: string, //最后更新时间
    hospitalId: number, //医疗机构ID
    itemConnotation: string, //项目内涵
    itemName: string, //项目名称
    limitedContent: string, //限定内容
    payType: string, //支付办法
    price: number, //收费标准
    priceNo: string, //物价编码
    remark: string, //备注
    status: string, //状态
    ybCode: string, //医保编码
    ybitemdataId: number	 //医保项目ID
}

/**
 * @description: add 诊疗项目
 * @param {type}
 * @return:
 */
export const addTreament = (data: any) => {
    return axios.request({
        url: "/op-service/shybzlxmxx/add",
        data,
        method: "post"
    })
};


/**
 * @description: edit  诊疗项目
 * @param {type}
 * @return:
 */
export const editTreament = (data: any) => {
    return axios.request({
        url: "/op-service/shybzlxmxx/edit",
        data,
        method: "post"
    })
};
