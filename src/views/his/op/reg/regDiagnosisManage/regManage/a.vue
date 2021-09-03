<template>
  <div class="content">
	</div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

declare interface IObj {
  name: string,
  value: string
}

@Component({
  name: ''
})

export default class extends Vue {
	private obj: IObj = {
    name: '',
    value: '',
  }

  mounted() {
    let i: keyof IObj;
    for(i in this.obj){
      this.obj[i]
    }
  }



	// 获取列表
  private getLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.getList()
  }

	

  // 条件查询
  searchLists() {
    const pageTable: any = this.$refs['pageTable']
    pageTable.searchList()
  }
  
  // 打开新增弹窗
	private handleAdd(){
    // this.curRow = {}
    var a: any = this.$refs['add-patient']
    a.addDialog()
  }
  
  // 打开修改弹窗
  private handleEdit(){
    var a: any = this.$refs['add-patient']
		a.editDialog(123)
  }
	



  //初始化的周期函数
	created() {
  }
  // mounted() {
	// 	this.getLists()
	// }
}
</script>

<style lang="scss" scoped>
.card-search{
  width: auto;
  margin-right: 10px;
}
</style>
