export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

export const isValidURL = (url: string) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

// 数字
export const regInt = /^[0-9]*$/

// 正整数
export const regPosInt = /^[1-9]\d*$/

// 非负数
export const regPos = /^\d+$|^\d+\.\d+$/

// 字母和数字
export const regLetNum = /^[A-Za-z0-9]+$/

// 字母、数字、下划线
export const regLetNum_ = /^\w+$/

// 中文、字母、数字、下划线
export const regLetNum_Zh = /^[\u4e00-\u9fa5A-Za-z0-9_]+$/

// 中文
export const regZh = /[\u4e00-\u9fa5]/

// 身份证
export const regIDCard = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/
// /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

// 电话
export const regTel = /[0-9-()（）]{7,18}/
// export const regTel= /^0\d{2,3}-?\d{7,8}$/

// 手机
export const regPhone = /0?(13|14|15|16|17|18|19)[0-9]{9}/
// 手机电话
export const regPhoneTel = /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/
// 邮箱
export const regEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/

// 邮编  [1-9]\d{5}(?!\d)
export const zipCode = /[1-9]\d{5}(?!\d)/