## 项目结构

```bash
├── mock/                      # 模拟服务器和模拟数据
├── public                     # 公共静态资产
│   │── favicon.ico            # favicon
│   │── manifest.json          # PWA配置文件
│   └── index.html             # index.html
├── src                        # 主要源代码
│   ├── api                    # api 接口
│   ├── assets                 # 模块资源，如字体、图像
│   ├── components             # 公共组件
│   ├── directives             # 全局指令
│   ├── filters                # 全局过滤器
│   ├── icons                  # svg图标
│   ├── lang                   # 国际化
│   ├── layout                 # 全局布局
│   ├── pwa                    # PWA service worker 相关的文件
│   ├── router                 # 路由
│   ├── store                  # 全局 vuex store
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局方法
│   ├── views                  # 所有页面
│   ├── App.vue                # 入口页面
│   ├── main.ts                # 入口文件 加载组件 初始化等
│   ├── permission.ts          # 权限管理
│   ├── settings.ts            # 设置文件
│   └── shims.d.ts             # 模块注入
├── tests/                     # 测试
├── .circleci/                 # 自动化 CI 配置
├── .browserslistrc            # 编辑相关配置
├── .editorconfig              # 环境变量配置
├── .env.xxx                   # eslint 配置
├── .eslintrc.js               # eslint config
├── babel.config.js            # babel-loader 配置
├── cypress.json               # e2e 测试配置
├── jest.config.js             # jest 单元测试配置
├── package.json               # package.json 依赖
├── postcss.config.js          # postcss 配置
├── tsconfig.json              # typescript 配置
└── vue.config.js              # vue-cli 配置
```

## 如何设置以及启动项目

#### 安装依赖

```bash
npm install
```

#### 启动本地开发环境（自带热启动）

```bash
npm run serve
```

#### 构建生产环境 (自带压缩)

```bash
npm run build:prod
```

#### 代码格式检查以及自动修复

```bash
npm run lint
```

#### 运行单元测试

```bash
npm run test:unit
```

#### 运行端对端测试

```bash
npm run test:e2e
```

#### 自动生成 svg 组件

```bash
yarn run svg
```

## 防重复点击(指令实现)

_全局注册自定义指令 preventReClick,需防重复点击时，在按钮上添加 **v-preventReClick** 指令即可_

## 组件全局注册

_组件涉及需全局注册的，统一引入至 src\components\global-components.ts_

## 分页列表组件

```分页组件包括：分页内容顶部标题插槽、底部备注插槽、渲染插槽和其他渲染内容插槽，以及分页功能；
组件Prop要求：dataUrl => 数据请求的API路径（required）、httpMethod => 请求方式、searchData => API请求参数、pageProps => 分页内容配置（暂不采用传入配置默认全部显示）
详见demo => src\views\testcomp\index.vue <pagenation-list />

补充Prop：listHeight：插槽"list"区域的高度, 最小400 、 prec：插槽"list"区域内每条数据的高度, 默认40
```

## 下拉搜索组件

```下拉搜索组件包括：前端字典检索、拼音五笔检索；
组件Prop要求：tableName => 主表名（required）、kid => 主键id（required）、backfillValue => 默认值（回填值）、longDataFlag => 超长数据标记（功能较繁琐暂未开发）
tableName值域 = ['PRIMARY_DIC_MAIN','HSP_DATA_MAIN','SYS_FLAG_DATA','SYS_DICT_CONFIG'] = ['标识数据(待完善)','医院字典,'标识字典','业务字典']
详见demo => src\views\testcomp\index.vue <search-select />
```

## 编辑表格组件

```编辑表格组件包括：输入框、下拉搜索框、选择框、时间选择框
组件porp要求：
1、height：列表高度
2、headerArray：列表的表头数组，主要包括
2.1、prop：table的prop
2.2、label：表头的label
2.3、width：表格列的宽，自适应宽则传空字符串
2.4、isMust：boolean值，是否必填（表头首部加上红色的星号）
2.5、type：单击单元格后的操作类型（input,select-search,select,timePicker）
3、showDelBtn：boolean值，是否显示删除按钮
详见demo => src\views\his\drugs\westdrugs\purchaseInputStore\index.vue <edit-table>
```

## 字典搜索组件

```字典搜索组件包括：对字典进行模糊搜索
组件porp要求：
1、resultTableHeader：(array)搜索结果的表头数组 exp:[{label: 'xxx',porp: 'xxx',width: 80}]
2、tableName：(string)表名默认
3、queryFiled：(string)匹配的字段 默认JBMC
4、popoverWidth：(number)弹出框的宽度 默认600
5、disabled:(boolean)是否禁用搜索框
6、labelFiled: (string) //显示的字段
7、valueFiled: (string) //数据的字段
详见demo => src\views\his\im\ims\components\patientData.vue  491行
```

## 可编辑组件单元格

```可编辑组件单元格包括：input框 select框 datePicker框 remoteSearch框 dictSearch框
组件porp要求：
具体可以查看src\views\his\drugs\westdrugs\purchaseInputStore\index.vue文件
下一个可编辑单元格获取焦点方法：
第一步，给每个可编辑单元格加上:ref="`${scope.$index}-x`" 后面的x是第几个可编辑的单元格，比如第一个可编辑单元格:ref="`${scope.$index}-1`"第二个:ref="`${scope.$index}-2`" 加一个触发事件，比如@blur="function(scope,x)" 最后在页面中写方法：
private change(scope: any, labelIndex: number) {
    if (this.$refs[`${scope.$index}-${labelIndex + 1}`]) {
      ; (this.$refs[`${scope.$index}-${labelIndex}`] as any).blur()
        ; (this.$refs[`${scope.$index}-${labelIndex + 1}`] as any).focus()
    } else {
      if (this.$refs[`${scope.$index + 1}-1`]) {
        ; (this.$refs[`${scope.$index + 1}-1`] as any).focus()
      } else {
        this.drugData = [...this.drugData, {}]
        this.$nextTick(() => {
          ; (this.$refs[`${scope.$index + 1}-1`] as any).focus()
        })
      }
    }
  }
详见demo => src\views\his\im\ims\components\patientData.vue  491行
```

## 远程搜索下拉组件

```
vue部分
<remote-search-select
            :searchUrl="searchUrl"
            :resultTableHeader="resultHeader"
            :searchData="{
              cflx:  1,
              yfsb:  1
            }"
            searchField="pydm"
            showLabel="ypmc"
            ref="remoteSearchSelect"
          >
            <template slot-scope="scope">
              <div>
                <el-select
                  v-model="scope.scope"
                  ref="select"
                  remote
                  filterable
                  :popper-append-to-body="false"
                  @blur="selectBlur"
                  :remote-method="
                    query => {
                      remoteMethod(query)
                    }
                "
                  clearable
                >
                  <div slot="empty"></div>
                </el-select>
              </div>
            </template>
          </remote-search-select>
ts部分
private searchUrl: string = '/ypsrf/queryDrugsTypk'
  private remoteMethod(query: string) {
    if (query.length > 1) {
        if (query[0] == '/') {
          let queryFiled2 = query.substring(1)
          this.searchUrl = '/opmzxx/doQueryJsZtInfo'
          this.$nextTick(() => {
            (this.$refs.remoteSearchSelect as any).remoteMethod(queryFiled2)
          })
        } else {
          this.searchUrl = '/ypsrf/queryDrugsTypk'
          this.$nextTick(() => {
            (this.$refs.remoteSearchSelect as any).remoteMethod(query)
          })
        }
    } else {
      (this.$refs.remoteSearchSelect as any).closePopover()
    }
  }
  private selectBlur() {
    (this.$refs.remoteSearchSelect as any).selectBlur()
  }
  private resultTableHeader = [
    {
      prop: 'JBXH',
      label: '疾病序号',
      width: '',
    },
    {
      prop: 'JBMC',
      label: '疾病名称',
      width: '',
    },
  ]
样式部分
::v-deep .el-select-dropdown {
  display: none;
}
```

## 接口请求返回 errorCode！=SUCCESS 的特殊处理须在接口请求头上添加：

```headers: {
            "Res-Type": "special"
        }
```

## table.scss 禁用，透明度 50%：

```.hyaline {
    opacity: 0.5;
}
```

## 样式命名规范：

````his-drugs-xx (西药库信息系统)
``` his - 项目名称
``` drugs - 所属模块
````
