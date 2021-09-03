/*
 * @Author: 曹俊
 * @LastEditTime: 2020-09-15 14:11:58
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\components\global-components.ts
 */
import Vue from 'vue';
// 分页列表组件 @wangyao 2020.4.14
import PagenationList from '@/components/PagenationList/index.vue';
Vue.component('pagenation-list', PagenationList);

// 下拉搜索组件 @wangyao 2020.4.15
import SearchSelect from '@/components/SearchSelect/index.vue';
Vue.component('search-select', SearchSelect);

// 省市区下拉组件 @wangyao 2020.4.15
import CascadeAddress from '@/components/CascadeAddress/index.vue';
Vue.component('cascade-address', CascadeAddress);

// 左右拉伸组件 @wangyao 2020.4.24
import splitPane from '@/components/splitPane/index.vue';
Vue.component('split-pane', splitPane);

//上传文件组件 @zhoudongming 2020.5.25
import uploadFile from '@/components/uploadFile/index.vue';
Vue.component('upload-file', uploadFile);

// 分页列表配置组件 @caojun 2020.6.14
import SettingList from '@/components/SettingList/index.vue';
Vue.component('setting-list', SettingList);

// 分页列表配置组件 @caojun 2020.6.14
import CustomList from '@/components/CustomList/index.vue';
Vue.component('custom-list', CustomList);

// 无分页列表配置组件 @caojun 2020.6.23
import NoPagination from '@/components/NoPagination/index.vue';
Vue.component('no-pagination', NoPagination);

// 报表组件 @zhoudongming 2020.6.17
import statement from '@/components/statement/index.vue';
Vue.component('statement', statement);

// 编辑表格 @zhoudongming 2020.6.17
import editTable from '@/components/editTable/index.vue';
Vue.component('editTable', editTable);

// 下拉搜索 @zhoudongming 2020.6.17
import remoteSearchSelect from '@/components/remoteSearchSelect/index.vue';
Vue.component('remoteSearchSelect', remoteSearchSelect);

// 下拉搜索  适用于之前的edit-table 组件
import oldRemoteSearchSelect from '@/components/oldRemoteSearchSelect/index.vue';
Vue.component('oldRemoteSearchSelect', oldRemoteSearchSelect);

// 字典搜索下拉 @zhoudongming 2020.7.1
import dictSearchSelect from '@/components/DictSearchSelect/index.vue';
Vue.component('dictSearchSelect', dictSearchSelect);
// 远程搜索下拉 @zhoudongming 2020.7.1
import remoteSearchSelectNew from '@/components/tableRemoteSearchSelect/index.vue';
Vue.component('remoteSearchSelectNew', remoteSearchSelectNew);

// 编辑表格中拆出来的单元格 @zhoudongming 2020.7.10
// input框
// import inputBox from '@/components/InputBox/index.vue';
// Vue.component('inputBox', inputBox);
// select框
// import selectBox from '@/components/SelectBox/index.vue';
// Vue.component('selectBox', selectBox);
// 日期框
// import datePickerBox from '@/components/DatePickerBox/index.vue';
// Vue.component('datePickerBox', datePickerBox);
// 远程搜索框
import remoteSearchBox from '@/components/RemoteSearchBox/index.vue';
Vue.component('remoteSearchBox', remoteSearchBox);
// 字典下拉搜索
import dictSearchBox from '@/components/DictSearchBox/index.vue';
Vue.component('dictSearchBox', dictSearchBox);
// 字典下拉
import searchSelectBox from '@/components/SearchSelectBox/index.vue';
Vue.component('searchSelectBox', searchSelectBox);
// 字典表单
import dictList from '@/components/DictList/index.vue';
Vue.component('dictList', dictList);

// 打印提示组件 @wangyao 2020.09.13
import lodopTips from '@/plugins/lodop/lodopTips.vue';
Vue.component('lodop-tips', lodopTips);

// 编辑表格中拆出来的单元格input框 @wangyao 2020.9.15
import inputBoxOther from '@/components/InputBoxOther/index.vue';
Vue.component('inputBoxOther', inputBoxOther);

// select下拉框的优化调整
import selectDown from '@/components/SelectDown/index.vue';
Vue.component('selectDown', selectDown);