import { DataType } from "wl-core"
/**
 * 根据路由匹配地址
 * @param {*} data 路由数据
 * @param {*} base 路由前缀
 * @param {*} options 粗略的配置项
 */
function routeMatch(
  data: any,
  base: any,
  options = { path: "routeName", url: "menuUrl", name: "name", id: "id", permissions: "permissions" }
) {
  console.log("========route========:",data,base,options)
  if (!DataType.isArray(data)) return [];
  // 创建路由盒子
  let routerBox: any = [];

  routerMapFile(data);
  /**
* @name 路由映射真实视图路径
*/
  function routerMapFile(data: any) {
    data.forEach((item: any) => {
      if (item[options.url]) {
        let _path = item[options.path].replace(base, "");
        let _url = item[options.url].replace(base, "");
        try {
          let routerItem = {
            path: _path, // 路由路径名
            component: (resolve: any) => require([`@/views${_url}`], resolve) // 路由映射真实视图路径
            // component: () => import(/* webpackChunkName: "[request]" */`@/views${_url}`) // 路由映射真实视图路径
          };
          routerBox.push(routerItem);
        } catch (err) {
          console.log(err);
        }
      }
      // 处理子集
      if (DataType.isArray(item.children)) routerMapFile(item.children);
    });
  }

  /**
   * @error A non-empty path must start with "/"
   * @des 添加错误路径重定向至404报错，需要以'/'开头
   */
  /* let errorBox = {
    path: "*",
    redirect: "/err-404"
  };
  routerBox.push(errorBox); */

  return routerBox;
}

export default routeMatch;
