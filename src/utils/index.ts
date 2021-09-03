import { getNow } from '@/api/his/basic'
import {isNullOrUndefined} from "util"; //获取当前时间（时间戳）
import { log } from 'console';
import { doc } from 'prettier'
import debug = doc.debug


// Parse the time to string
export const parseTime = (
  time?: object | string | number, // 传入的时间
  cFormat?: string // 要转换的格式
): string | null => {
  if (time === undefined) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
    b: date.getHours() < 12 ? 1 : 2
  }
  const timeStr = format.replace(/{([ymdhisab])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (key === 'b') {
      return value.toString()
    }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

// 获取本周日期数组
export const getCurWeek = (timestamp?: any) => {
  var arrWeek: any = []
  const week = new Date(timestamp).getDay() // 今天是星期几（0~6）
  const sunday = timestamp - 24 * 60 * 60 * 1000 * week // 第一天的时间戳

  for (let i = 0; i < 7; i++) {
    var day = sunday + 24 * 60 * 60 * 1000 * i
    var dateStr = parseTime(day, '{y}-{m}-{d},{a}') !
    arrWeek.push({ date: dateStr.split(',')[0], week: dateStr.split(',')[1] })
  }
  return arrWeek
}

// 时间差（毫秒数）转时分秒
export const msecToHms = (msec: number) => {
  if(msec <= 0){
    return '00:00:00'
  }else{
    var h: any = Math.floor(msec / (60 * 60 * 1000))
    var m: any = Math.floor(msec / (60 * 1000) - h * 60)
    var s: any = Math.floor(msec / 1000 - h * 60 * 60 - m * 60)
    if (h <= 9) {
      h = '0' + h;
    }
    if (m <= 9) {
      m = '0' + m;
    }
    if (s <= 9) {
      s = '0' + s;
    }
    return `${h}:${m}:${s}`
  }
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}

/**
 * 在指定的数组中，模糊查找 某些字段，是否含有指定关健字 仅字符串
 * @param obj    关键字
 * @param targetArr  目标数组
 * @param attr   字段数组
 */
export const findKeys = (obj: any, targetArr: any, attr: any) => {
  let res: Array<any> = []
  let findarr = targetArr
  attr.forEach((val: any, i: any) => {
    // res = res.concat(findarr.filter((o: any) => o[val].indexOf(obj) >= 0))
    // findarr = findarr.filter((o: any) => !(o[val].indexOf(obj) >= 0))
    res = res.concat(findarr.filter((o: any) => {
      if(o[val]){
        return o[val].toUpperCase().indexOf(obj) >= 0
      }
    }))
    // findarr = findarr.filter((o: any) => {
    //   if(o[val]){
    //     return !(o[val].indexOf(obj) >= 0)
    //   }
    // })
  })
  return res
}

export const isEmpty = (obj: any) => {
  if (obj === 0) return true
  if (Array.isArray(obj)) return !(obj.length > 0)
  return (obj === null || obj === undefined || obj === '' || obj === NaN)
}


/**
 * 深度拷贝数组或对象
 * @param obj  源数据
 */
export const deepCopy = (obj: any) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 *参数：第一个数组，通过查找的id，第一个数组添加的name，第二个数组，通过查找的id，查找的name
 * @param sou  原始数据
 * @param id   需扩展的关键字列
 * @param name  扩展(新增)后的字段
 * @param des  查找的目标数组
 * @param desid    目标数组的关键字列
 * @param desname   查找到的字段名
 * @returns {*}
 */
export const id2Name = (sou: any, id: string, name: string, des: any, desid: string, desname: string) => {
  sou.forEach((val: any, i: number) => {
    let dd = des.filter((o: any) => o[desid] == val[id])
    if (!isEmpty(dd) && dd.length > 0) {
      val[name] = dd[0][desname]
    } else {
      val[name] = ''
    }
  })
  return sou
}

/**
 * 将数字取整为10的倍数
 * @param {Number} num 需要取整的值
 * @param {Boolean} ceil 是否向上取整
 * @param {Number} prec 需要用0占位的数量
 */
export const formatInt = (num: number, prec: number = 1, ceil: boolean = true) => {
  const len = String(num).length
  if (len <= prec) {
    return num
  }

  const mult = Math.pow(10, prec)
  return ceil ? Math.ceil(num / mult) * mult : Math.floor(num / mult) * mult
}

// 处理表格固定列滚动条
export const rightScroll = () => {
  setTimeout(() => {
    var fr: any = document.getElementsByClassName('el-table__fixed-right')
    var frPatch: any = document.getElementsByClassName('el-table__fixed-right-patch')
    var fw: any = document.getElementsByClassName('el-table__fixed-body-wrapper')
    // console.log('qqqqqqq');
    for (let i in frPatch) {
      if (frPatch[i].clientWidth > 0) {
        frPatch[i].style.width = '6px'
        fr[i].style.right = '6px'
      }
    }
    // console.log(Array.from(fw));
    for(let x in Array.from(fw)){
        // console.log(fw[x].clientHeight);
        fw[x].style.height =  fw[x].clientHeight + 3 + 'px'
    }
  }, 0)
}

// 数组查重
export const unique = (arr: any) => {
  let result: Array<any> = []
  for (var i = 0; i < arr.length; i++) {
    //如果当前数组的第i项已经保存进了临时数组，忽略掉
    //否则的话把当前项push到临时数组里面
    console.log('+++++++++');
    console.log(result.indexOf(arr[i]));
    console.log('结果');
    console.log(result.push(arr[i]))
    if (result.indexOf(arr[i]) < 0) result.push(arr[i])
    //indexOf 返回元素在result中的位置，如果没有返回-1；
  }
  return result
}

// 数组查重
export const arrUnique = (arr: any) => {
    let tempJson: any = {};
    var result : any = [];
    for(let i = 0; i < arr.length; i++) {
      //取出每一个对象
      tempJson[JSON.stringify(arr[i])] = true;
    }
    let keyItems= Object.keys(tempJson);
    for(let j = 0;j < keyItems.length;j++){
      result.push(JSON.parse(keyItems[j]));
    }
    return result;
}

export const doubleNum = function keepTwoDecimalFull(num:any) {
  var result = parseFloat(num)
  if (isNaN(result)) {
    alert('传递参数错误，请检查！')
    return false
  }
  result = Math.round(num * 100) / 100
  var s_x = result.toString() //将数字转换为字符串

  var pos_decimal = s_x.indexOf('.') //小数点的索引值


  // 当整数时，pos_decimal=-1 自动补0
  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }

  // 当数字的长度< 小数点索引+2时，补0
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0'
  }
  return s_x
}

/* 获取当前日期
 * 时间戳转换方法
 *param:时间戳数字
 *type: 1-日期（2020-10-11） 2-日期+时分秒(2020-10-11 23:59:59)
 */
export const formatDate = function(type: number) {
  let date: any = new Date();
  let YY = date.getFullYear() + '-';
  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return type == 1 ? YY + MM + DD : YY + MM + DD +" "+ hh + mm + ss;
}

/* 获取当前月份起始日期
* 时间戳转换方法
*date: 2020-07  返回 2020-07-01
*/
export const formatBeginDay = function(date: string) {
  var YY: any = date.slice(0,4);
  let MM: any = date.slice(5,date.length);
  var firstDay: any = new Date(YY,MM-1);
  function datasFormat(d: any){
    let year: string = d.getFullYear()
    let month: string = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    let day: string = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    var datetime = year + '-' + month + '-' + day;
    return datetime;
  }
  let beginDay = datasFormat(firstDay)
  return beginDay
}

/* 获取当前月份结束日期
* 时间戳转换方法
*date: 2020-07  返回 2020-07-31
*/
export const formatEndDay = function(date: string) {
  var YY: any = date.slice(0,4);
  let MM: any = date.slice(5,date.length);
  var lastDay: any = new Date(new Date(YY,MM).valueOf()-60*60*1000*24);
  function datasFormat(d: any){
    let year: string = d.getFullYear()
    let month: string = d.getMonth() + 1 < 10 ? '0' +(d.getMonth() + 1) : d.getMonth() + 1
    let day: string = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    var datetime = year + '-' + month + '-' + day;
    return datetime;
  }
  let endDay = datasFormat(lastDay)
  return endDay
}


/* 获取当前月份上个月月初日期
 * 时间戳转换方法
 *date: 2020-07  返回 2020-06-01
 */
export const formatDates = function(date: any) {
  let YY = date.getFullYear() + '-';
  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return  YY + MM + DD
}

/*
 * 判断字符串是否为空
 * str:需要判断字符串
 */
export const checkStrIsNull = function(str: string) {
  if (isNullOrUndefined(str) || str == '' || str.trim() == '') {
    return true
  }
  return false;
}

/**
 * @Description: 保留n位小数，四舍五入
 * @author: zhml
 * @param {type}:
 * @return:
 * @date 2020/7/21
*/
export const getFloat = function(num:any, n:number) {
  if(num == null){
     return ""
  }
  if (String(num).indexOf('.') == -1) {
    num = Number(num).toFixed(n)
  }else if (String(num).length - String(num).indexOf('.') - 1< n ) {
    num = Number(num).toFixed(n)
  }else {
    num = (Math.round(num * Math.pow(10, n)) / Math.pow(10, n)).toFixed(n); //四舍五入
  }
  return num;
};
/**
 * 升幂降幂精度乘法
 * @param a
 * @param b
 */
export const mul = function (a: number, b: number) {
  var c = 0, d = a.toString(), e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) {
  }
  try {
    c += e.split(".")[1].length;
  } catch (f) {
  }
  return Number(d.replace(".", "")) * Number(e.replace(".", ""))
    / Math.pow(10, c);
}

// 金额转大写
export const numtochinese = (num: any)=>{
  for(let i = num.length-1; i >= 0; i--){
    num = num.replace(',','') //替换tomoney()中的“,”
    num = num.replace(' ','') //替换tomoney()中的空格
  }
  num.replace('￥','') //替换掉可能出现的￥字符
  if(isNaN(num)){
    //验证输入的字符是否为数字
    alert("请检查小写金额是否正确");
    return
  }

  //---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
  let part = String(num).split('.')
  let newchar = ''
  //小数点前进行转化
  for(let i=part[0].length-1; i>=0; i--){
    if(part[0].length > 10){
      alert("位数过大，无法计算")
      return ''
    }//若数量超过拾亿单位，提示
    let tmpnewchar = ''
    let perchar: any = part[0].charAt(i)
    switch(perchar){
      case '0':
        tmpnewchar="零" + tmpnewchar
        break
      case '1':
        tmpnewchar='壹' + tmpnewchar
        break
      case '2':
        tmpnewchar='贰' + tmpnewchar
        break
      case '3':
        tmpnewchar='叁' + tmpnewchar
        break
      case '4':
        tmpnewchar='肆' + tmpnewchar
        break
      case '5':
        tmpnewchar='伍' + tmpnewchar
        break
      case '6':
        tmpnewchar='陆' + tmpnewchar
        break
      case '7':
        tmpnewchar='柒' + tmpnewchar
        break
      case '8':
        tmpnewchar='捌' + tmpnewchar
        break
      case '9':
        tmpnewchar='玖' + tmpnewchar
        break    }
    switch(part[0].length-i-1){ // 0，1，2，3……
      case 0:
        tmpnewchar = tmpnewchar +'元'
        break
      case 1:
        if(perchar!=0){
          tmpnewchar= tmpnewchar +'拾'
        }
        break
      case 2:
        if(perchar!=0){
          tmpnewchar= tmpnewchar +'佰'
        }
        break
      case 3:
        if(perchar!=0){
          tmpnewchar= tmpnewchar +'仟'
        }
        break
      case 4:
        tmpnewchar= tmpnewchar +'万'
        break
      case 5:
        if(perchar!=0){
          tmpnewchar= tmpnewchar +'拾'
        }
        break
      case 6:
        if(perchar!=0){
          tmpnewchar= tmpnewchar +'佰'
        }
        break
      case 7:
        if(perchar!=0){
          tmpnewchar= tmpnewchar +'仟'
        }
        break
      case 8:
        tmpnewchar = tmpnewchar +'亿'
        break
      case 9:
        tmpnewchar = tmpnewchar +'拾'
        break
    }
    newchar = tmpnewchar + newchar
  }

  //小数点之后进行转化
  if(num.indexOf(".")!=-1){
    if(part[1].length > 2){
      // alert("小数点之后只能保留两位,系统将自动截段")
      part[1] = part[1].substr(0,2)
    }
    for(let i=0; i<part[1].length; i++){
      let tmpnewchar = ''
      let perchar = part[1].charAt(i)
      switch(perchar){
        case '0':
          tmpnewchar='零' + tmpnewchar
            break
        case '1':
          tmpnewchar='壹' + tmpnewchar
            break
        case '2':
          tmpnewchar='贰' + tmpnewchar
            break
        case '3':
          tmpnewchar='叁' + tmpnewchar
            break
        case '4':
          tmpnewchar='肆' + tmpnewchar
            break
        case '5':
          tmpnewchar='伍' + tmpnewchar
            break
        case '6':
          tmpnewchar='陆' + tmpnewchar
            break
        case '7':
          tmpnewchar='柒' + tmpnewchar
            break
        case '8':
          tmpnewchar='捌' + tmpnewchar
            break
        case '9':
          tmpnewchar='玖' + tmpnewchar
            break
      }
      if(i==0){
        tmpnewchar =tmpnewchar + '角'
      }
      if(i==1){
        tmpnewchar = tmpnewchar + '分'
      }
      newchar = newchar + tmpnewchar;
    }
  }
  //替换所有无用汉字
  while(newchar.search('零零') != -1)
  newchar = newchar.replace('零零', '零')
  newchar = newchar.replace('零亿', '亿')
  newchar = newchar.replace('亿万', '亿')
  newchar = newchar.replace('零万', '万')
  newchar = newchar.replace('零元', '元')
  newchar = newchar.replace('零角', '')
  newchar = newchar.replace('零分', '')
  if (newchar.charAt(newchar.length-1) == '元' || newchar.charAt(newchar.length-1) == '角'){
    newchar = newchar+'整'
  }
  if(newchar.charAt(0) == '元'){
    newchar=newchar.substring(1,newchar.length)
  }
  return newchar;
}

// 身份证中间替换*****
export const changeSfz = (value: string)=>{
  let str1=value.slice(0,6);
  let str2='';
  let str3=value.slice(14);
  if(value.length==15){
    str2='******';
  }else{
    str2='********';
  }
  return str1+str2+str3;
}
