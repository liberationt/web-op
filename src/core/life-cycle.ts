import Vue, { DirectiveOptions } from 'vue'
import VueRouter from "vue-router";
import App from "@/App.vue";
import store from "@/store";
import selfRoutes from "@/router";
import i18n from '@/lang'
import ElementUI from 'element-ui'
import { AppModule } from '@/store/modules/app'

Vue.use(ElementUI, {
    size: AppModule.size, // Set element-ui default size
    i18n: (key: string, value: string) => i18n.t(key, value)
})

/**
 * @name 导入自定义路由匹配方法
 */
import routeMatch from "@/router/route-match"; // 导入路由匹配文件路径函数
/**
 * @name 导入官方通信方法
 */
import appStore from "@/utils/app-store";

const __qiankun__ = window.__POWERED_BY_QIANKUN__;
let router: any = null;
let instance: any = null;

/**
 * @name 导出生命周期函数
 */
const lifeCycle = () => {
    return {
        /**
         * @name 微应用初始化
         * @param {Object} props 主应用下发的props
         * @description  bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发
         * @description 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等
         */
        async bootstrap(props: any) {
            Vue.prototype.$getLodop = props.emits.getLodop;
            Vue.prototype.$store = props.data.state
            console.log('props:', props)
        },
        /**
         * @name 实例化微应用
         * @param {Object} props 主应用下发的props
         * @description 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
         */
        async mount(props: any) {
            if (props.GLOBAL) {
                Vue.prototype.AUTHORITY.jobRole = props.GLOBAL.headdata.jobRole
                Vue.prototype.AUTHORITY.bussinessRole = props.GLOBAL.headdata.bussinessRole
                Vue.prototype.AUTHORITY.qxmc = props.GLOBAL.headdata.qxmc
                Vue.prototype.AUTHORITY.kslb = props.GLOBAL.headdata.kslb
                Vue.prototype.AUTHORITY.outpatientCode = props.GLOBAL.headdata.outpatientCode
                Vue.prototype.AUTHORITY.hlwks= props.GLOBAL.headdata.hlwks
                Vue.prototype.AUTHORITY.loginBizsn = props.GLOBAL.headdata.loginBizsn
            }
            // 注册应用间通信
            appStore(props);
            // 注册微应用实例化函数
            render(props);

        },
        /**
         * @name 微应用卸载/切出
         */
        async unmount() {
            instance.$destroy?.();
            instance = null;
            router = null;
        },
        /**
         * @name 手动加载微应用触发的生命周期
         * @param {Object} props 主应用下发的props
         * @description 可选生命周期钩子，仅使用 loadMicroApp 方式手动加载微应用时生效
         */
        async update(props: any) {
            console.log("update props", props);
        }
    };
};


/**
 * @name 子应用实例化函数
 * @param {Object} props param0 qiankun将用户添加信息和自带信息整合，通过props传给子应用
 * @description {Array} routes 主应用请求获取注册表后，从服务端拿到路由数据
 * @description {String} 子应用路由前缀 主应用请求获取注册表后，从服务端拿到路由数据
 */
const render = ({ routes, routerBase, container }: any = {}) => {
    Vue.config.productionTip = false;
    router = new VueRouter({
        base: __qiankun__ ? routerBase : "/",
        mode: "history",
        routes: __qiankun__ ? routeMatch(routes, routerBase) : selfRoutes
    } as any);

    instance = new Vue({
        router,
        store,
        i18n,
        render: h => h(App)
    }).$mount(container ? container.querySelector("#app") : "#app");
};

export { lifeCycle, render, router };
