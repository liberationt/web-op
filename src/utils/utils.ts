/**
 * 跨应用路由跳转
 * @param {String} href url地址
 * @param {Object} stateObj 状态参数 可以通过history.state读取
 * @param {String} title 标题 暂时没有用
 */
function routerGo(href: any = '/', title: any = null, stateObj: any = {}) {
    window.history.replaceState(stateObj, title, href);
}

export {
    routerGo // 跨应用路由跳转
}
