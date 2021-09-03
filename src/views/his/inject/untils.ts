// 处理分组
// 按相同的“处方号码-处方组号”分组
export const groupColor = (list: any) => {
  list.forEach((item: any)=>{
    item.group = `${item.cfhm}-${item.cfzh}`
  })

  list.forEach((item: any, index: number)=>{
    if(index == 0){
      item.colorFlag = true
    }else{

      if(item.group == list[index-1].group){
        item.colorFlag = list[index-1].colorFlag
      }else{
        item.colorFlag = !list[index-1].colorFlag
      }

    }
  })
  console.log('处理后');
  console.log(list);
  return list
}

// 按相同的序号分组
export const groupColor2 = (list: any) => {
  list.forEach((item: any, index: number)=>{
    if(index == 0){
      item.colorFlag = true
    }else{

      if(item.xh == list[index-1].xh){
        item.colorFlag = list[index-1].colorFlag
      }else{
        item.colorFlag = !list[index-1].colorFlag
      }

    }
  })
  console.log('处理后');
  console.log(list);
  return list
}