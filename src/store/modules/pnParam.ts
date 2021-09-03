
const pnParam = {
  state: {
    PN_PARAM:{}, // 患者管理卡片 (医生站)
  },
  mutations:{
    SET_PN_PARAM(state: any, params: any){
      state.PN_PARAM = { ...params }
    }
  },
  actions: {}
}
export default pnParam;
