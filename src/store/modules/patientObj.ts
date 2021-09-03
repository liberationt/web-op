/*
 * @Author: wangyao
 * @LastEditTime: 2020-07-12 14:39:58
 * @LastEditors: wangyao
 * @Description:患者相关内容
 * @FilePath: \web-op\src\store\modules\patientObj.ts
 */
const patientObj = {
    state: {
        PATIENT_CARD_DOC:{}, // 患者管理卡片 (医生站)
    },
    mutations:{
        SET_PATIENT_CARD_DOC(state: any, params: any){
            state.PATIENT_CARD_DOC = params
        }
    },
    actions: {}
}
export default patientObj