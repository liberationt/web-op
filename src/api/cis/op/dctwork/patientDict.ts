export const tabStatusList = [
    {
        name: '1',
        title: '待诊',
    },
    {
        name: '2',
        title: '诊中',
    },
    {
        name: '3',
        title: '束诊',
    },
]

export const zdStatus = [
    {
        value: 1,
        label: '待查',
    },
    {
        value: 2,
        label: '复查',
    },
]

export const folderList = [
    // {
    //   id: 1,
    //   tName: '知情同意书',
    //   childrenList: [
    //     {
    //       id: 31,
    //       tName: '宫腔镜手术知情同意书'
    //     },
    //     {
    //       id: 32,
    //       tName: '门诊手术知情同意书'
    //     },
    //     {
    //       id: 33,
    //       tName: '宫内节育器取出手术知情同意书'
    //     },
    //     {
    //       id: 34,
    //       tName: '宫内节育器放置手术知情同意书'
    //     }
    //   ]
    // },
    {
        id: 2,
        tName: '诊疗记录',
        childrenList: [
            {
                id: 11,
                tName: '就诊历史',
            },
            {
                id: 12,
                tName: '检查申请',
            },
            {
                id: 13,
                tName: '检验申请',
            },
            // {
            //     id: 14,
            //     tName: '手术申请',
            // },
            //治疗申请 id 31
            {
                id: 31,
                tName: '康复治疗申请',
            },
            {
                id: 32,
                tName: '抗菌药物申请',
            },
            {
                id: 15,
                tName: '检查申请单查询',
            },
            {
                id: 35,
                tName: '检验申请单查询', 
            },
            // {
            //     id: 16,
            //     tName: '手术申请单查询',
            // },
            {
                id: 17,
                tName: '诊间预约',
            },
            {
                id: 18,
                tName: '预约查询',
            },
            // 8.19 晚需求    电子病历首页的功能已有，不需要这两个入口
            //
            // {
            //   id: 19,
            //   tName: '病历模板'
            // },
            // {
            //   id: 20,
            //   tName: '诊疗方案'
            // },
            // {
            //     id: 21,
            //     tName: '诊间结算',
            // },
            // {
            //     id: 22,
            //     tName: '诊间结费记录',
            // },
            {
                id: 27,
                tName: '病情证明单',
            },
            {
                id: 36,
                tName: '疾病证明单'
            },
            {
                id: 28,
                tName: '入院申请单',
            },
            // {
            //     id: 30,
            //     tName: '转诊申请单',
            // },宏德不需要  
            {
                id: 31,
                tName: '留观登记单',
            }, 
            // 宏德不需要
        ],
    },
]
