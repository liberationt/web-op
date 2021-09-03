/*
 * @Author: wangyao
 * @LastEditTime: 2020-08-05 16:46:33
 * @LastEditors: wangyao
 * @Description:
 * @FilePath: \web-op\src\shims.d.ts
 */
declare module '*.vue' {
	import Vue from 'vue';
	export default Vue;
}

// declare module 'vue/types/vue' {
// 	interface Vue {
// 		// ...
// 		// 以下是在main.ts中挂载到Vue.prototype上的变量
// 		$getLodop: any;
// 	}
// }

declare module 'element-ui/lib/locale/lang/*' {
	export const elementLocale: any;
}

declare module '*.gif' {
	export const gif: any;
}

// TODO: remove this part after vue-count-to has its typescript file
declare module 'vue-count-to';

// TODO: remove this part after vuedraggable has its typescript file
declare module 'vuedraggable';

// TODO: remove this part after vue2-dropzone has its typescript file
declare module 'vue2-dropzone';

// TODO: remove this part after vue-image-crop-upload has its typescript file
declare module 'vue-image-crop-upload';

// TODO: remove this part after vue-splitpane has its typescript file
declare module 'vue-splitpane';

declare module 'wl-core';

//解决引用本地js文件
declare module '@/plugins/lodop/index.js';
declare module '@/components/Temperature/util.js';

// Typescript给window对象添加全局变量
interface Window {
	test: string;
	openDatabase: any;
	ele: any;
	__POWERED_BY_QIANKUN__: any;
	__INJECTED_PUBLIC_PATH_BY_QIANKUN__: any
}
