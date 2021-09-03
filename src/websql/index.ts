/*
 * @Author: wangyao
 * @LastEditTime: 2020-06-29 19:13:45
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\websql\index.ts
 */
import Vue from 'vue'

const WebSql = function(){
    if(window.openDatabase){
        var dataBase = window.openDatabase('basicData', '1.0','基础数据',60*1024*1024);
        Vue.prototype.$db = dataBase;
        Vue.prototype.tableList = ['TB_REGION', 'SYS_PRIMARY_DATA', 'SYS_FLAG_DATA', 'SYS_DICT_CONFIG','GY_JBBM_VERSION']
        if (!dataBase){
            console.log("数据库创建失败！");
        }else{
            console.log("数据库创建成功！");
        }
    }else{
        console.log('不支持本地存储！');
    }
};
export default WebSql;