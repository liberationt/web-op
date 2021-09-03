<template>
  <a
    v-if="isExternal(to)"
    :href="to"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <router-link
    v-else
    :to="toUrl"
  >
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'

@Component({
  name: 'SidebarItemLink'
})
export default class extends Vue {
  @Prop({ required: true }) private to!: string

  @Prop({ required: true }) private name!: string

  private isExternal = isExternal
  private toUrl = {}

  @Watch('name', { immediate: true })
  private onNameChange(name: string) {
    //  console.log("--------++++++:",name)
    //  console.log("--------******:",this.to)
     if(isExternal(name)){
       this.toUrl={ path:this.to, query:{
        hospitalId:2,
        deptId1:'',
        deptId2:'',
        bq:'',
        doctorNo:'',
        pharmacyId:''
        } }
     }else{
       this.toUrl= this.to
     }
     
  }
}
</script>
