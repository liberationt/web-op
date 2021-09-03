/*
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-07 15:42:26
 * @Description:
 * @FilePath: \web-op\src\store\modules\webSqlDict.ts
 */
const webSqlDict = {
  state: {
    TABLE_NO_DICT: [], // 号表字典
    DIAG_ROOM_DICT: [], // 诊室字典
    DEPT_DICT: [], // 科室字典
    SYS_HOSPITAL_DICT: [], // 住院病区
    WARD_DICT: [], // 病区字典
    STOP_FLAG_DICT: [], // 停用标识
    TABLE_PATIENT_DICT: [], // 病人性质字典
    TABLE_DOCTOR_DICT: [], // 医生字典
    SEX_DICT: [], // 性别字典
    OUTP_JUDGE_DICT: [], // 出院判别字典
    DIAGNOSE_BODY_PART: [], // 诊断部位
    PAY_METHOD_DICT: [], // 缴款方式
    REDEPOSIT_JUDGE_DICT: [], // 转存判别
    DEP_CODE_DICT: [], //科室代码
    INPAT_MD_DICT: [], // 入院目的字典
    REGISTER_TYPE_DICT: [], // 登记类型字典
    INPAT_REQ_STATUS_DICT: [], // 住院登记申请状态字典
    OUTPATIENT_DEPARTMENT: [], //门诊科室列表字典
    CHECK_STATUS: [], //检查状态
    ZD_CATEGORY_DICT: [], // 诊断类别
    INPAT_HOSP_DICT: [], // 入院病情
    INPAT_HOSP_STATUS_DICT: [], // 入院情况
    RESILT_STATUS_DICT: [], // 结果情况
    ZZYS_DICT: [], // 主治医生字典
    USE_FLAG_DICT: [], // 使用标志
    FREQUENCY_DICT: [], // 频次字典
    PHARMACY_INPAT_DICT: [], // 住院药房字典
    DRUG_METHOD_DICT: [], // 药品用法字典
    CAST_FLAG_DICT: [], // 执行标志字典
    SYS_FLAG_DICT: [], // 完成标识字典
    END_FLAG_DICT: [], // 结束标志
    SUBMIT_FLAG_DICT: [], // 提交标志
    URGENT_FLAG_DICT: [], // 紧急标志
    PACK_STYLE_DICT: [], // 包装类别
    SUPER_ORGAN_DICT: [], // 上级机构
    SUPER_PHA_DICT: [], // 上级药房
    CORRES_PHA_DICTCORRES_PHA_DICT: [], // 对应药库
    HOSPITAL_DICT: [], // 医疗机构
    JZ_DICT: [], // 脚注字典
    DRUG_OUTCORRESPOND_DICT: [], //药库-出库对应方式
    DRUG_INPUTCORRESPOND_DICT: [], //药库-入库定价方式
    DRUG_DRUGTYPE_DICT: [], // 药库-药品类别字典
    DRUG_MEDICARECLASS_DICT: [], // 药库-医保分类字典
    DRUG_DRUGGRADE_DICT: [], // 药库-药品档次字典
    DRUG_DRUGCHARGES_DICT: [], // 药库-药品费别字典
    DRUG_DRUGDOSAGEFORM_DICT: [], // 药库-药品剂型字典
    DRUG_DRUGSTORAGE_DICT: [], // 药库-药品贮藏字典
    DRUG_DRUGMADEIN_DICT: [], // 药库-药品产地字典
    DRUG_SEPCIALDRUG_DICT: [], // 药库-特殊药品|指定药品字典
    DRUG_PRESCIBEDRUG_DICT: [], // 药库-处方药品
    DRUG_DRUGCLASS_DICT: [], // 药库-药品类型
    DRUG_RETAILPRICE_DICT: [], //药库-零售价格定价方式
    DRUG_GMPSIGN_DICT: [], // 药库-GMP标志
    DRUG_ENABLEFLAG_DICT: [], // 药库-医保信息启用标志
    DRUG_BASICTYPE_DICT: [], // 药库-基药类型
    DRUG_ANTIBIOTC_DICT: [], // 药库-抗生素标志
    DRUG_SKINTEST_DICT: [], // 药库-皮试判别
    DRUG_ROUNDING_DICT: [], // 药库-取整策略
    DRUG_BOOK_DICT: [], // 药库-账簿类别
    DRUG_BOOLEAN_DICT: [], // 药库-自备药标识-转方药品/抗菌药物管理分级 | 实现限制类抗菌药物以非限制类管理/注射药品
    DRUG_PAY_DICT: [], // 药库-支付
    DRUG_ALLERGY_DICT: [], // 药库-过敏药类别
    DRUG_CLASSIFICATION_DICT: [], // 药库-抗生药物分级
    DRUG_APPROVAL_DICT: [], // 药库-抗菌药物是否需要审批
    DRUG_UITRAVIRES_DICT: [], // 药库-抗菌药物越权使用方式
    DRUG_PHARMACY_DICT: [], // 药库-用药标识
    DRUG_BIDTYPE_DICT: [], // 药库-中标类型
    DRUG_LIMIT_DICT: [], //药库-用药限制
    DRUG_INVNATURE_DICT: [], //药库-库存性质
    DRUG_BUYTYPE_DICT: [], //药库-购入方式
    DRUG_SECONDS_DICT: [], //药品-次品类型
    DRUG_DAMAGE_DICT: [], //药品-损坏原因
    DRUG_MODIFYPRICE_DICT: [], //药品-调价方式
    DRUG_AUDITSTATUS_DICT: [], //药库-审核状态
    DRUG_PROCESSSTATUS_DICT: [], //药库-处理状态
    DRUG_INVENATURE_DICT: [], //药库-库存性质
    DRUG_PRESCRPTION_DICT: [], //药库-处方权限
    DRUG_PURCHASEUNIT_DICT: [], //药库-进货单位
    FREQUENCY_DAY_DICT: [], //频次-每日次数字典
    SETTLEMENT_TYPE_DICT: [], //结算类型字典
    PHA_SORT_DICT: [], // 药库类别
    USE_SIGN_DICT: [], // 使用标志
    OUTBOUND_STYLE_DICT: [], //领用方式
    PS_RESULT_DICT: [], // 皮试结果
    ZX_TYPE_DICT: [], //中西类别
    MZ_ZXKS_DICT: [], // 门诊 执行科室/转诊科室字典
    TJ_INPATIENT_DICT: [], // 提交病区
    FY_STYLE_DICT: [], // 发药方式
    SYS_FLAG_DATA: [], // 完成标识
    ZY_ZH_DICT: [], // 中医证候字典
    ZY_ZD_DICT: [], // 中医诊断字典
    REGISTERATION_DEPARTMENT_DICT: [], //挂号科室列表字典
    SYS_PRIMARY_DATA: [], //退药原因
    CHECKOUT_STYLE_DATA: [], // 药品出库方式
    DISPENSARY_DICT: [], // 发药药房
    APPOINTMENT_TYPE_DICT: [], // 挂号预约类型
    APPOINTMENT_STATUS_DICT: [], // 挂号预约状态
    HL_LEVEL_DICT: [], // 护理等级
    OUTP_TYPE_DICT: [], // 出院判别
    CATEGORY_DICT: [], // 所属类别
    DRUG_COSTTYPE_DICT: [], // 药品费别
    JCSB_DICT: [], //检查设备
    INTERFACE_TYPE_DICT: [], //接口类型
    BACK_MEDICINE_STYLE: [], // 退药方式
    CURING_INJURE_REASON: [], // 养护 - 损坏原因
    MZFF_DICT: [], //麻醉方法
    COST_CONSOLIDATION: [], // 费用归并
    OPERATION_KSDICT: [], //手术科室
    COST_DEPARTMENT: [], // 费用科室
    PROJECT_TYPE: [], // 项目类型
    REPORT_TOTAL: [], // 报表归并
    USERS_DICT: [], // 操作人员（用户）
    CARDTYPE_DICT: [], // 卡类型
    PATIENT_NATURE_DICT: [], // 病人性质
    SYS_YPQX: [], // 西药权限、中药权限、草药权限
    COST_TYPE_DICT: [], // 费用分类
    SYS_USING: [], // 启用判别
    CY_JF_DICT: [], // 煎法
    MEDICINE_ROOM_TYPE: [], // 对应药库类型
    ABO_XXDMX_DICT: [], // ABO血型代码表
    RH_XXDMX_DICT: [], // RH血型代码表
    SSS_FLAG_DICT: [], // 输血史标识字典
    MDXQSY_DICT: [], // 梅毒血清学试验结果代码表
    SXYY_DICT: [], // 输血原因
    STATUS_DICT: [], // 检查状态字典
    MERGE_CATEGORY_DICT: [], // 归并类别
    DISEASE_DISCRIMIN_DICT: [], // 疾病判别
    EXECUTION_TIME_DICT: [], // 执行时间
    DOSE_FREQUENCY_DICT: [], // 给药频次
    DOSE_CYCLE_DICT: [], // 给药周期
    REDUCTION_POLICY: [], // 减免政策
    CHARGE_TYPE: [], // 收费项目类别
    PAY_ACCURACY_DICT: [], // 付款精度
    ROUNDING_METHOD_DICT: [], // 舍入方式
    COST_CATEGORY_DICT: [], // 费用类别
    EVENT_CLASS_DICT: [], // 事件分类
    SYNDROME_TYPE_DICT: [], // 证侯分类
    DISEASE_CARD_DICT: [], // 疾病报告卡
    OUTPATIENT_TYPE: [], // 门诊类别
    MED_INS_ROUTE: [], // 医保线路
    FOOT_NOTE_DICT: [], // 脚注
    STATE_DICT: [], // 辅助报告--检验检查状态
    SET_IDCARD_DICT: [], // 身份证件类别字典
    SET_HJTYPE_DICT: [], // 户籍标志字典
    CRUE_DICT: [], // 治疗科室
    ACCOUNT_TYPE_DICT: [], // 核算分类
    DEPARTMENT_TYPE_DICT: [], // 科室分类
    DOCTOR_ADVICE_DICT: [], // 静脉配置医嘱类别
    INFUSION_DEPT: [], // 输液科室
    INJECTION_DEPT: [], // 注射科室
    ALLERGY_TW_DICT: [], // 体温单过敏药物分类
    TO_HOS_TYPE_DICT: [], //来源方式
    REALIZE_TYPE_DICT: [], //意识状态
    PATIENT_TYPE_DICT: [], // 病人分级
    TOWHERE_TYPE_DICT: [], // 病人去向
    SKINTEST_RESULT: [], // 皮试结果
    STATIC_STYLE_DICT: [], // 静配方式
    DOC_TITLE_DICT: [], // 医疗角色
    YBMZ_USING_DICT: [], // 医保门诊使用
    YBZY_USING_DICT: [], // 医保住院使用
    REGULAR_CROWD_DICT: [],// 医保数据-医保规则适用人群
    PAY_TERMS_DICT: [],// 医保数据-医保支付条件
    PURCHASE_METHOD_DICT: [],// 医保数据-医保采购方式
    PRICE_CROWD_DICT: [],// 医保数据-医保价格规则代码
    DRUG_ATTRIBUTE_DICT: [],// 医保数据-医保药品属性
    RELEASE_TYPE_DICT: [],// 医保数据-医保发布类型
    BRXZ_DICT: [], // 门诊建档病人性质
    SERIOUSILLNESS_ZLXM: [], // 医保大病项目
    SERIOUSILLNESS_JBZD: [], // 医保大病登记疾病诊断分类
    SERIOUSILLNESS_DBZL: [], // 大病子类
    YB_DJLB: [], // 医保登记类别
    SCHEDULE_TIME: [], // 班次
    REG_YYZBLB: [], // 挂号预约班次（不包括“全天”）
    SSJB_DICT: [],//手术级别
    TSSS_TYPE_DICT: [],//特殊手术
    GLBZ_TYPE_DICT: [],//隔离标志
    SSLX_TYPE_DICT: [],//手术类型
    OBSERVE_DEPARTMENT_DICT: [],//留观科室
    REFERRAL_DICT: [], // 医保转诊
    JTGXDMB_DICT: [], // 与患者关系
    PURPOSE_ADMISSION_DICT: [], // 入院目的 
  },
  mutations: {
    // set 号表字典
    SET_TABLE_NO_DICT(state: any, params: any) {
      state.TABLE_NO_DICT = params
    },
    // set 诊室字典
    SET_DIAG_ROOM_DICT(state: any, params: any) {
      state.DIAG_ROOM_DICT = params
    },
    // set 科室字典
    SET_DEPT_DICT(state: any, params: any) {
      state.DEPT_DICT = params
    },

    // set 住院病区
    SET_SYS_HOSPITAL_DICT(state: any, params: any) {
      state.SYS_HOSPITAL_DICT = params
    },
    // set 病区字典
    SET_WARD_DICT(state: any, params: any) {
      state.WARD_DICT = params
    },
    // set 停用标识
    SET_STOP_FLAG_DICT(state: any, params: any) {
      state.STOP_FLAG_DICT = params
    },
    // set 病人性质
    SET_TABLE_PATIENT_DICT(state: any, params: any) {
      state.TABLE_PATIENT_DICT = params
    },
    // set 医生字典
    SET_TABLE_DOCTOR_DICT(state: any, params: any) {
      state.TABLE_DOCTOR_DICT = params
    },
    // set 性别字典
    SET_SEX_DICT(state: any, params: any) {
      state.SEX_DICT = params
    },
    // set 出院判别字典
    SET_OUTP_JUDGE_DICT(state: any, params: any) {
      state.OUTP_JUDGE_DICT = params
    },
    //  set 诊断部位
    SET_DIAGNOSE_BODY_PART(state: any, params: any) {
      state.DIAGNOSE_BODY_PART = params
    },
    //  set 缴款方式
    SET_PAY_METHOD_DICT(state: any, params: any) {
      state.PAY_METHOD_DICT = params
    },
    //  set 转存判别
    SET_REDEPOSIT_JUDGE_DICT(state: any, params: any) {
      state.REDEPOSIT_JUDGE_DICT = params
    },
    SET_DEP_CODE_DICT(state: any, params: any) {
      state.DEP_CODE_DICT = params
    },
    //  set 入院目的
    SET_INPAT_MD_DICT(state: any, params: any) {
      state.INPAT_MD_DICT = params
    },
    //  set 登记类型
    SET_REGISTER_TYPE_DICT(state: any, params: any) {
      state.REGISTER_TYPE_DICT = params
    },
    //  set 住院登记申请状态
    SET_INPAT_REQ_STATUS_DICT(state: any, params: any) {
      state.INPAT_REQ_STATUS_DICT = params
    },
    //  set 门诊科室列表
    SET_OUTPATIENT_DEPARTMENT(state: any, params: any) {
      state.OUTPATIENT_DEPARTMENT = params
    },
    //检查状态
    SET_CHECK_STATUS(state: any, params: any) {
      state.CHECK_STATUS = params
    },
    //set 诊断类别
    SET_ZD_CATEGORY_DICT(state: any, params: any) {
      state.ZD_CATEGORY_DICT = params
    },
    //set 入院病情
    SET_INPAT_HOSP_DICT(state: any, params: any) {
      state.INPAT_HOSP_DICT = params
    },
    //set 入院情况
    SET_INPAT_HOSP_STATUS_DICT(state: any, params: any) {
      state.INPAT_HOSP_STATUS_DICT = params
    },
    //set 结果情况
    SET_RESILT_STATUS_DICT(state: any, params: any) {
      state.RESILT_STATUS_DICT = params
    },
    //set 主治医生
    SET_ZZYS_DICT(state: any, params: any) {
      state.ZZYS_DICT = params
    },
    //set 使用标志
    SET_USE_FLAG_DICT(state: any, params: any) {
      state.USE_FLAG_DICT = params
    },
    //set 频次字典
    SET_FREQUENCY_DICT(state: any, params: any) {
      state.FREQUENCY_DICT = params
    },
    //set 药房字典
    SET_PHARMACY_INPAT_DICT(state: any, params: any) {
      state.PHARMACY_INPAT_DICT = params
    },
    //set 药品用法字典
    SET_DRUG_METHOD_DICT(state: any, params: any) {
      state.DRUG_METHOD_DICT = params
    },
    //set 执行标志字典
    SET_CAST_FLAG_DICT(state: any, params: any) {
      state.CAST_FLAG_DICT = params
    },
    //set完成标识字典
    SET_SYS_FLAG_DICT(state: any, params: any) {
      state.SYS_FLAG_DICT = params
    },
    //set 结束标志
    SET_END_FLAG_DICT(state: any, params: any) {
      state.END_FLAG_DICT = params
    },
    //set 提交标志
    SET_SUBMIT_FLAG_DICT(state: any, params: any) {
      state.SUBMIT_FLAG_DICT = params
    },
    //set 紧急标志
    SET_URGENT_FLAG_DICT(state: any, params: any) {
      state.URGENT_FLAG_DICT = params
    },
    //set 包装类别
    SET_PACK_STYLE_DICT(state: any, params: any) {
      state.PACK_STYLE_DICT = params
    },
    //set 上级机构
    SET_SUPER_ORGAN_DICT(state: any, params: any) {
      state.SUPER_ORGAN_DICT = params
    },
    //set 上级药房
    SET_SUPER_PHA_DICT(state: any, params: any) {
      state.SUPER_PHA_DICT = params
    },
    //set 对应药库
    SET_CORRES_PHA_DICT(state: any, params: any) {
      state.CORRES_PHA_DICT = params
    },
    //set 医疗机构
    SET_HOSPITAL_DICT(state: any, params: any) {
      state.HOSPITAL_DICT = params
    },
    //set 脚注字典
    SET_JZ_DICT(state: any, params: any) {
      state.JZ_DICT = params
    },
    //set 药库-入库定价方式
    SET_DRUG_INPUTCORRESPOND_DICT(state: any, params: any) {
      state.DRUG_INPUTCORRESPOND_DICT = params
    },
    //set 药库-出库定价方式
    SET_DRUG_OUTCORRESPOND_DICT(state: any, params: any) {
      state.DRUG_OUTCORRESPOND_DICT = params
    },
    //set  药库-药品类别字典
    SET_DRUG_DRUGTYPE_DICT(state: any, params: any) {
      state.DRUG_DRUGTYPE_DICT = params
    },
    //set 药库-医保分类字典
    SET_DRUG_MEDICARECLASS_DICT(state: any, params: any) {
      state.DRUG_MEDICARECLASS_DICT = params
    },
    //set 药库-药品档次字典
    SET_DRUG_DRUGGRADE_DICT(state: any, params: any) {
      state.DRUG_DRUGGRADE_DICT = params
    },
    //set 药库-药品费别字典
    SET_DRUG_DRUGCHARGES_DICT(state: any, params: any) {
      state.DRUG_DRUGCHARGES_DICT = params
    },
    //set 药库-药品剂型字典
    SET_DRUG_DRUGDOSAGEFORM_DICT(state: any, params: any) {
      state.DRUG_DRUGDOSAGEFORM_DICT = params
    },
    //set 药库-药品贮藏字典
    SET_DRUG_DRUGSTORAGE_DICT(state: any, params: any) {
      state.DRUG_DRUGSTORAGE_DICT = params
    },
    //set 药库-药品产地字典
    SET_DRUG_DRUGMADEIN_DICT(state: any, params: any) {
      state.DRUG_DRUGMADEIN_DICT = params
    },
    // 药库-特殊药品|指定药品字典
    SET_DRUG_SEPCIALDRUG_DICT(state: any, params: any) {
      state.DRUG_SEPCIALDRUG_DICT = params
    },
    // 药库-处方药品
    SET_DRUG_PRESCIBEDRUG_DICT(state: any, params: any) {
      state.DRUG_PRESCIBEDRUG_DICT = params
    },
    // 药库-药品类型
    SET_DRUG_DRUGCLASS_DICT(state: any, params: any) {
      state.DRUG_DRUGCLASS_DICT = params
    },
    // 药库-零售价格定价方式
    SET_DRUG_RETAILPRICE_DICT(state: any, params: any) {
      state.DRUG_RETAILPRICE_DICT = params
    },
    // 药库-GMP标志
    SET_DRUG_GMPSIGN_DICT(state: any, params: any) {
      state.DRUG_GMPSIGN_DICT = params
    },
    // 药库-医保信息启用标志
    SET_DRUG_ENABLEFLAG_DICT(state: any, params: any) {
      state.DRUG_ENABLEFLAG_DICT = params
    },
    // 药库-基药类型
    SET_DRUG_BASICTYPE_DICT(state: any, params: any) {
      state.DRUG_BASICTYPE_DICT = params
    },
    // 药库-抗生素标志
    SET_DRUG_ANTIBIOTC_DICT(state: any, params: any) {
      state.DRUG_ANTIBIOTC_DICT = params
    },
    // 药库-皮试判别
    SET_DRUG_SKINTEST_DICT(state: any, params: any) {
      state.DRUG_SKINTEST_DICT = params
    },
    // 药库-取整策略
    SET_DRUG_ROUNDING_DICT(state: any, params: any) {
      state.DRUG_ROUNDING_DICT = params
    },
    // 药库-账簿类别
    SET_DRUG_BOOK_DICT(state: any, params: any) {
      state.DRUG_BOOK_DICT = params
    },
    // 药库-自备药标识-转方药品/抗菌药物管理分级 | 实现限制类抗菌药物以非限制类管理/注射药品
    SET_DRUG_BOOLEAN_DICT(state: any, params: any) {
      state.DRUG_BOOLEAN_DICT = params
    },
    // 药库-支付
    SET_DRUG_PAY_DICT(state: any, params: any) {
      state.DRUG_PAY_DICT = params
    },
    // 药库-过敏药类别
    SET_DRUG_ALLERGY_DICT(state: any, params: any) {
      state.DRUG_ALLERGY_DICT = params
    },
    // 药库-抗生药物分级
    SET_DRUG_CLASSIFICATION_DICT(state: any, params: any) {
      state.DRUG_CLASSIFICATION_DICT = params
    },
    // 药库-抗菌药物是否需要审批
    SET_DRUG_APPROVAL_DICT(state: any, params: any) {
      state.DRUG_APPROVAL_DICT = params
    },
    // 药库-抗菌药物越权使用方式
    SET_DRUG_UITRAVIRES_DICT(state: any, params: any) {
      state.DRUG_UITRAVIRES_DICT = params
    },
    // 药库-用药标识
    SET_DRUG_PHARMACY_DICT(state: any, params: any) {
      state.DRUG_PHARMACY_DICT = params
    },
    // 药库-中标类型
    SET_DRUG_BIDTYPE_DICT(state: any, params: any) {
      state.DRUG_BIDTYPE_DICT = params
    },
    // 药库-用药限制
    SET_DRUG_LIMIT_DICT(state: any, params: any) {
      state.DRUG_LIMIT_DICT = params
    },
    // 药库-库存性质
    SET_DRUG_INVNATURE_DICT(state: any, params: any) {
      state.DRUG_INVNATURE_DICT = params
    },
    // 药库-购入方式
    SET_DRUG_BUYTYPE_DICT(state: any, params: any) {
      state.DRUG_BUYTYPE_DICT = params
    },
    // 药库-次品类型
    SET_DRUG_SECONDS_DICT(state: any, params: any) {
      state.DRUG_SECONDS_DICT = params
    },
    // 药库-孙环原因
    SET_DRUG_DAMAGE_DICT(state: any, params: any) {
      state.DRUG_DAMAGE_DICT = params
    },
    // 药库-调价方式
    SET_DRUG_MODIFYPRICE_DICT(state: any, params: any) {
      state.DRUG_MODIFYPRICE_DICT = params
    },
    // 药库-处理状态
    SET_DRUG_PROCESSSTATUS_DICT(state: any, params: any) {
      state.DRUG_PROCESSSTATUS_DICT = params
    },
    // 药库-审核状态
    SET_DRUG_AUDITSTATUS_DICT(state: any, params: any) {
      state.DRUG_AUDITSTATUS_DICT = params
    },
    // 药库-库存性质
    SET_DRUG_INVENATURE_DICT(state: any, params: any) {
      state.DRUG_INVENATURE_DICT = params
    },
    // 药库-处方权限
    SET_DRUG_PRESCRPTION_DICT(state: any, params: any) {
      state.DRUG_PRESCRPTION_DICT = params
    },
    // 药库-进货单位
    SET_DRUG_PURCHASEUNIT_DICT(state: any, params: any) {
      state.DRUG_PURCHASEUNIT_DICT = params
    },
    //set 频次-每日次数字典
    SET_FREQUENCY_DAY_DICT(state: any, params: any) {
      state.FREQUENCY_DAY_DICT = params
    },
    //set 结算类型字典
    SET_SETTLEMENT_TYPE_DICT(state: any, params: any) {
      state.SETTLEMENT_TYPE_DICT = params
    },
    // set 药库类别
    SET_PHA_SORT_DICT(state: any, params: any) {
      state.PHA_SORT_DICT = params
    },
    // set 使用标志
    SET_USE_SIGN_DICT(state: any, params: any) {
      state.USE_SIGN_DICT = params
    },
    // set 领用方式
    SET_OUTBOUND_STYLE_DICT(state: any, params: any) {
      state.OUTBOUND_STYLE_DICT = params
    },
    // set 皮试结果
    SET_PS_RESULT_DICT(state: any, params: any) {
      state.PS_RESULT_DICT = params
    },
    //   中西类别
    SET_ZX_TYPE_DICT(state: any, params: any) {
      state.ZX_TYPE_DICT = params
    },
    // set 提交病区
    SET_TJ_INPATIENT_DICT(state: any, params: any) {
      state.TJ_INPATIENT_DICT = params
    },
    // set 发药方式
    SET_FY_STYLE_DICT(state: any, params: any) {
      state.FY_STYLE_DICT = params
    },
    //   门诊 执行科室/转诊科室字典
    SET_MZ_ZXKS_DICT(state: any, params: any) {
      state.MZ_ZXKS_DICT = params
    },
    // 完成标识字典
    SET_SYS_FLAG_DATA(state: any, params: any) {
      state.SYS_FLAG_DATA = params
    },
    //  中医证候字典
    SET_ZY_ZH_DICT(state: any, params: any) {
      state.ZY_ZH_DICT = params
    },
    // 中医诊断字典
    SET_ZY_ZD_DICT(state: any, params: any) {
      state.ZY_ZD_DICT = params
    },

    //  是/否
    SET_Y_OR_N_DICT(state: any, params: any) {
      state.Y_OR_N_DICT = params
    },
    // 挂号科室列表字典
    SET_REGISTERATION_DEPARTMENT_DICT(state: any, params: any) {
      state.REGISTERATION_DEPARTMENT_DICT = params
    },
    // 退药原因
    SET_SYS_PRIMARY_DATA(state: any, params: any) {
      state.SYS_PRIMARY_DATA = params
    },
    // 药品出库方式
    SET_CHECKOUT_STYLE_DATA(state: any, params: any) {
      state.CHECKOUT_STYLE_DATA = params
    },
    // 发药药房
    SET_DISPENSARY_DICT(state: any, params: any) {
      state.DISPENSARY_DICT = params
    },
    // 挂号预约类型
    SET_APPOINTMENT_TYPE_DICT(state: any, params: any) {
      state.APPOINTMENT_TYPE_DICT = params
    },
    // 挂号预约类型
    SET_APPOINTMENT_STATUS_DICT(state: any, params: any) {
      state.APPOINTMENT_STATUS_DICT = params
    },
    // 护理等级
    SET_HL_LEVEL_DICT(state: any, params: any) {
      state.HL_LEVEL_DICT = params
    },
    // 出院判别
    SET_OUTP_TYPE_DICT(state: any, params: any) {
      state.OUTP_TYPE_DICT = params
    },
    // 所属类别
    SET_CATEGORY_DICT(state: any, params: any) {
      state.CATEGORY_DICT = params
    },

    // 药品费别
    SET_DRUG_COSTTYPE_DICT(state: any, params: any) {
      state.DRUG_COSTTYPE_DICT = params
    },
    // 检查设备
    SET_JCSB_DICT(state: any, params: any) {
      state.JCSB_DICT = params
    },
    // 接口类型
    SET_INTERFACE_TYPE_DICT(state: any, params: any) {
      state.INTERFACE_TYPE_DICT = params
    },
    // 领药库房
    SET_CORRES_PHA_DICTCORRES_PHA_DICT(state: any, params: any) {
      state.CORRES_PHA_DICTCORRES_PHA_DICT = params
    },
    // 退药方式
    SET_BACK_MEDICINE_STYLE(state: any, params: any) {
      state.BACK_MEDICINE_STYLE = params
    },
    // 养护 - 损坏原因
    SET_CURING_INJURE_REASON(state: any, params: any) {
      state.CURING_INJURE_REASON = params
    },
    //麻醉方法
    SET_MZFF_DICT(state: any, params: any) {
      state.MZFF_DICT = params
    },
    // 费用归并
    SET_COST_CONSOLIDATION(state: any, params: any) {
      state.COST_CONSOLIDATION = params
    },
    // 手术科室
    SET_OPERATION_KSDICT(state: any, params: any) {
      state.OPERATION_KSDICT = params
    },
    // 项目类型
    SET_PROJECT_TYPE(state: any, params: any) {
      state.PROJECT_TYPE = params
    },
    // 费用科室
    SET_COST_DEPARTMENT(state: any, params: any) {
      state.COST_DEPARTMENT = params
    },
    // 报表归并
    SET_REPORT_TOTAL(state: any, params: any) {
      state.REPORT_TOTAL = params
    },

    // 操作人员(用户)
    SET_USERS_DICT(state: any, params: any) {
      state.USERS_DICT = params
    },

    // 卡类型
    SET_CARDTYPE_DICT(state: any, params: any) {
      state.CARDTYPE_DICT = params
    },

    // 病人性质
    SET_PATIENT_NATURE_DICT(state: any, params: any) {
      state.PATIENT_NATURE_DICT = params
    },

    //  西药权限、中药权限、草药权限
    SET_SYS_YPQX(state: any, params: any) {
      state.SYS_YPQX = params
    },

    // 费用分类
    SET_COST_TYPE_DICT(state: any, params: any) {
      state.COST_TYPE_DICT = params
    },

    //  启用判别
    SET_SYS_USING(state: any, params: any) {
      state.SYS_USING = params
    },
    //  启用判别
    SET_CY_JF_DICT(state: any, params: any) {
      state.CY_JF_DICT = params
    },
    // 对应药库类型
    SET_MEDICINE_ROOM_TYPE(state: any, params: any) {
      state.MEDICINE_ROOM_TYPE = params
    },
    // ABO血型
    SET_ABO_XXDMX_DICT(state: any, params: any) {
      state.ABO_XXDMX_DICT = params
    },
    // RH血型
    SET_RH_XXDMX_DICT(state: any, params: any) {
      state.RH_XXDMX_DICT = params
    },
    // 输血史标识字典
    SET_SSS_FLAG_DICT(state: any, params: any) {
      state.SSS_FLAG_DICT = params
    },
    // 梅毒血清学试验结果代码表
    SET_MDXQSY_DICT(state: any, params: any) {
      state.MDXQSY_DICT = params
    },
    // 输血原因
    SET_SXYY_DICT(state: any, params: any) {
      state.SXYY_DICT = params
    },
    // 检查状态字典
    SET_STATUS_DICT(state: any, params: any) {
      state.STATUS_DICT = params
    },
    // 归并类别
    SET_MERGE_CATEGORY_DICT(state: any, params: any) {
      state.MERGE_CATEGORY_DICT = params
    },
    // 疾病判别
    SET_DISEASE_DISCRIMIN_DICT(state: any, params: any) {
      state.DISEASE_DISCRIMIN_DICT = params
    },
    // 执行时间
    SET_EXECUTION_TIME_DICT(state: any, params: any) {
      state.EXECUTION_TIME_DICT = params
    },
    // 给药频次
    SET_DOSE_FREQUENCY_DICT(state: any, params: any) {
      state.DOSE_FREQUENCY_DICT = params
    },
    // 给药周期
    SET_DOSE_CYCLE_DICT(state: any, params: any) {
      state.DOSE_CYCLE_DICT = params
    },

    // 减免
    SET_REDUCTION_POLICY(state: any, params: any) {
      state.REDUCTION_POLICY = params
    },

    // 收费项目类别
    SET_CHARGE_TYPE(state: any, params: any) {
      state.CHARGE_TYPE = params
    },

    // 付款精度
    SET_PAY_ACCURACY_DICT(state: any, params: any) {
      state.PAY_ACCURACY_DICT = params
    },

    // 舍入方式
    SET_ROUNDING_METHOD_DICT(state: any, params: any) {
      state.ROUNDING_METHOD_DICT = params
    },

    // 费用类别
    SET_COST_CATEGORY_DICT(state: any, params: any) {
      state.COST_CATEGORY_DICT = params
    },
    // 费用类别
    SET_EVENT_CLASS_DICT(state: any, params: any) {
      state.EVENT_CLASS_DICT = params
    },

    // 证侯分类
    SET_SYNDROME_TYPE_DICT(state: any, params: any) {
      state.SYNDROME_TYPE_DICT = params
    },

    // 疾病报告卡
    SET_DISEASE_CARD_DICT(state: any, params: any) {
      state.DISEASE_CARD_DICT = params
    },

    // 门诊类别
    SET_OUTPATIENT_TYPE(state: any, params: any) {
      state.OUTPATIENT_TYPE = params
    },
    // 脚注字典
    SET_FOOT_NOTE_DICT(state: any, params: any) {
      state.FOOT_NOTE_DICT = params
    },

    // 医保线路
    SET_MED_INS_ROUTE(state: any, params: any) {
      state.MED_INS_ROUTE = params
    },
    // 状态
    SET_STATE_DICT(state: any, params: any) {
      state.STATE_DICT = params
    },
    // 护理记录类型
    SET_NURSE_RECORD_DICT(state: any, params: any) {
      state.NURSE_RECORD_DICT = params
    },

    // 输液科室
    SET_INFUSION_DEPT(state: any, params: any) {
      state.INFUSION_DEPT = params
    },
    // 注射科室
    SET_INJECTION_DEPT(state: any, params: any) {
      state.INJECTION_DEPT = params
    },

    // 就诊状态
    SET_JZZT_DICT(state: any, params: any) {
      state.JZZT_DICT = params
    },
    // 身份证件
    SET_IDCARD_DICT(state: any, params: any) {
      state.IDCARD_DICT = params
    },
    // 户籍标志
    SET_HJTYPE_DICT(state: any, params: any) {
      state.HJTYPE_DICT = params
    },
    // 核算分类
    SET_ACCOUNT_TYPE_DICT(state: any, params: any) {
      state.ACCOUNT_TYPE_DICT = params
    },
    // 科室分类
    SET_DEPARTMENT_TYPE_DICT(state: any, params: any) {
      state.DEPARTMENT_TYPE_DICT = params
    },
    //治疗科室
    SET_CRUE_DICT(state: any, params: any) {
      state.CRUE_DICT = params
    },
    // 静脉配置医嘱类别
    SET_DOCTOR_ADVICE_DICT(state: any, params: any) {
      state.DOCTOR_ADVICE_DICT = params
    },
    // 体温单过敏药物分类
    SET_ALLERGY_TW_DICT(state: any, params: any) {
      state.ALLERGY_TW_DICT = params
    },
    // 来院方式
    SET_TO_HOS_TYPE_DICT(state: any, params: any) {
      state.TO_HOS_TYPE_DICT = params
    },
    // 意识状态
    SET_REALIZE_TYPE_DICT(state: any, params: any) {
      state.REALIZE_TYPE_DICT = params
    },
    // 病人分级
    SET_PATIENT_TYPE_DICT(state: any, params: any) {
      state.PATIENT_TYPE_DICT = params
    },
    // 病人去向
    SET_TOWHERE_TYPE_DICT(state: any, params: any) {
      state.TOWHERE_TYPE_DICT = params
    },

    // 皮试结果
    SET_SKINTEST_RESULT(state: any, params: any) {
      state.SKINTEST_RESULT = params
    },

    // 静配方式
    SET_STATIC_STYLE_DICT(state: any, params: any) {
      state.STATIC_STYLE_DICT = params
    },
    // 医疗角色
    SET_DOC_TITLE_DICT(state: any, params: any) {
      state.DOC_TITLE_DICT = params
    },
    // 医保门诊使用
    SET_YBMZ_USING_DICT(state: any, params: any) {
      state.YBMZ_USING_DICT = params
    },
    // 医保住院使用
    SET_YBZY_USING_DICT(state: any, params: any) {
      state.YBZY_USING_DICT = params
    },
    // 医保数据-医保规则适用人群
    SET_REGULAR_CROWD_DICT(state: any, params: any) {
      state.REGULAR_CROWD_DICT = params
    },
    // 医保数据-医保支付条件
    SET_PAY_TERMS_DICT(state: any, params: any) {
      state.PAY_TERMS_DICT = params
    },
    // 医保数据-医保采购方式
    SET_PURCHASE_METHOD_DICT(state: any, params: any) {
      state.PURCHASE_METHOD_DICT = params
    },
    // 医保数据-医保价格规则代码
    SET_PRICE_CROWD_DICT(state: any, params: any) {
      state.PRICE_CROWD_DICT = params
    },
    // 医保数据-医保药品属性
    SET_DRUG_ATTRIBUTE_DICT(state: any, params: any) {
      state.DRUG_ATTRIBUTE_DICT = params
    },
    // 医保数据-医保发布类型
    SET_RELEASE_TYPE_DICT(state: any, params: any) {
      state.RELEASE_TYPE_DICT = params
    },

    // 门诊建档病人性质
    SET_BRXZ_DICT(state: any, params: any) {
      state.BRXZ_DICT = params
    },

    // 医保大病项目
    SET_SERIOUSILLNESS_ZLXM(state: any, params: any) {
      state.SERIOUSILLNESS_ZLXM = params
    },

    // 医保大病登记疾病诊断分类
    SET_SERIOUSILLNESS_JBZD(state: any, params: any) {
      state.SERIOUSILLNESS_JBZD = params
    },

    // 大病子类
    SET_SERIOUSILLNESS_DBZL(state: any, params: any) {
      state.SERIOUSILLNESS_DBZL = params
    },

    // 医保登记类别
    SET_YB_DJLB(state: any, params: any) {
      state.YB_DJLB = params
    },

    // 班次
    SET_SCHEDULE_TIME(state: any, params: any) {
      state.SCHEDULE_TIME = params
    },

    // 挂号预约班次（不包括“全天”）
    SET_REG_YYZBLB(state: any, params: any) {
      state.REG_YYZBLB = params
    },

    // 手术级别
    SET_SSJB_DICT(state: any, params: any) {
      state.SSJB_DICT = params
    },
    // 特殊手术
    SET_TSSS_TYPE_DICT(state: any, params: any) {
      state.TSSS_TYPE_DICT = params
    },
    // 特殊手术
    SET_GLBZ_TYPE_DICT(state: any, params: any) {
      state.GLBZ_TYPE_DICT = params
    },
    // 特殊手术
    SET_SSLX_TYPE_DICT(state: any, params: any) {
      state.SSLX_TYPE_DICT = params
    },
    // 留观科室
    SET_OBSERVE_DEPARTMENT_DICT(state: any, params: any) {
      state.OBSERVE_DEPARTMENT_DICT = params
    },
    // 医保转诊 
    SET_REFERRAL_DICT(state: any, params: any) {
      state.REFERRAL_DICT = params
    },
    // 与患者关系 
    SET_JTGXDMB_DICT(state: any, params: any) {
      state.JTGXDMB_DICT = params
    },
    // 入院目的
    SET_PURPOSE_ADMISSION_DICT(state: any, params: any) {
      state.PURPOSE_ADMISSION_DICT = params
    }
  },
  actions: {},
}
export default webSqlDict;
