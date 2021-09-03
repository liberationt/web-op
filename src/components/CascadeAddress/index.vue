<template>
  <!--
        可搜索拼音码的省市区级联
  -->
  <div class="cascade-address" ref="cascadeAddress">
    <el-select
      v-model="provinceId"
      v-bind="$attrs"
      v-on="$listeners"
      filterable
      clearable
      :placeholder="$t('patientData.province')"
      remote
      :remote-method="remoteProvince"
      @on-query-change="provinceQueryChange"
      :loading="loadingProvince"
      @clear="provinceClear"
      @change="provinceChange"
      ref="province"
    >
      <el-option v-for="item in provinceOps" :value="item.kid" :label="item.kname" :key="item.kid"></el-option>
    </el-select>
    <el-select
      v-model="cityId"
      remote
      :remote-method="remoteCity"
      v-bind="$attrs"
      v-on="$listeners"
      @on-query-change="cityQueryChange"
      filterable
      clearable
      :placeholder="$t('patientData.city')"
      class="nofirst"
      :loading="loadingCity"
      @clear="cityClear"
      @change="cityChange"
      ref="city"
    >
      <el-option v-for="item in cityOps" :value="item.kid" :label="item.kname" :key="item.kid"></el-option>
    </el-select>
    <el-select
      v-model="areaId"
      remote
      :remote-method="remoteArea"
      v-bind="$attrs"
      v-on="$listeners"
      @on-query-change="areaQueryChange"
      filterable
      clearable
      :placeholder="$t('patientData.district')"
      class="nofirst"
      :loading="loadingArea"
      @clear="areaClear"
      @change="areaChange"
      ref="area"
    >
      <el-option v-for="item in areaOps" :value="item.kid" :label="item.kname" :key="item.kid"></el-option>
    </el-select>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { dictExecuteSql } from '@/websql/functions'
import { findKeys, deepCopy } from '@/utils'
import { regionJson } from '@/api/his/basic'
@Component({
  name: 'cascade-address'
})

export default class extends Vue {
  @Prop({ required: false, default: () => { } }) private backfillObj!: any // 回填值
  private provinceId: any = ''
  private cityId: any = ''
  private areaId: any = ''

  private provinceOps: Array<any> = []
  private provinceList: Array<any> = []
  private cityOps: Array<any> = []
  private cityList: Array<any> = []
  private areaOps: Array<any> = []
  private areaList: Array<any> = []

  private loadingProvince: boolean = false
  private loadingCity: boolean = false
  private loadingArea: boolean = false

  private isBackfillCity: boolean = false
  private isBackfillArea: boolean = false

  created() {
    this.init();
  }
  mounted() {
    this.createArrow()
  }
  // 初始化参数
  private init() {
    const _that = this
    _that.provinceList = []
    _that.provinceOps = []
    _that.cityOps = []
    _that.cityList = []
    _that.areaOps = []
    _that.areaList = []
    const sql = 'select * from TB_REGION where klevel=' + 1 + ' and parentId=' + 0  //
    dictExecuteSql(sql,
      (tx: any, result: any) => {
        for (var i = 0; i < result.rows.length; i++) {
          // console.log(result.rows.item(i))
          _that.provinceList.push(result.rows.item(i))
          _that.provinceOps.push(result.rows.item(i))
        }
        if (_that.backfillObj != undefined && _that.backfillObj.provinceId && !_that.isBackfillCity && !_that.isBackfillArea) {
          // console.log('存在省数据')
          _that.$nextTick(() => {
            _that.provinceId = _that.backfillObj.provinceId
            _that.provinceChange()
          })
        }
      },
      (tx: any, err: any) => {
        console.log(tx, err)
      }
    )
  }
  // 省改变 请求市下拉项
  private provinceChange() {
    // console.log("provinceChange");
    const _that = this
    if (_that.provinceId == undefined) return
    _that.cityOps = []
    _that.cityList = []
    _that.areaOps = []
    _that.cityId = ''
    _that.areaId = ''
    const sql = 'select * from TB_REGION where klevel=' + 2 + ' and parentId=' + _that.provinceId  // 市
    //+' and (wb like "%'+wb+'%" or py like "%'+py+'%" )'
    // console.log(sql)
    dictExecuteSql(sql,
      (tx: any, result: any) => {
        _that.areaChange()
        for (var i = 0; i < result.rows.length; i++) {
          // console.log(result.rows.item(i))
          _that.cityOps.push(result.rows.item(i))
          _that.cityList.push(result.rows.item(i))
        }
        // console.log(_that.cityList);
        if (_that.backfillObj != undefined && _that.backfillObj.cityId && !_that.isBackfillCity) {
          _that.$nextTick(() => {
            _that.cityId = _that.backfillObj.cityId
            _that.isBackfillCity = true
            _that.cityChange()
          })
        }
      },
      (tx: any, err: any) => {
        console.log(tx, err)
      }
    )
  }
  // 市改变 请求区下拉项
  private cityChange() {
    const _that = this
    if (_that.cityId == undefined) return
    _that.areaOps = []
    _that.areaList = []
    _that.areaId = ''
    const sql = 'select * from TB_REGION where klevel=' + 3 + ' and parentId=' + _that.cityId  // 区
    dictExecuteSql(sql,
      (tx: any, result: any) => {
        _that.areaChange()
        for (var i = 0; i < result.rows.length; i++) {
          _that.areaOps.push(result.rows.item(i))
          _that.areaList.push(result.rows.item(i))
        }
        if (_that.backfillObj != undefined && _that.backfillObj.areaId && !_that.isBackfillArea) {
          _that.$nextTick(() => {
            _that.areaId = _that.backfillObj.areaId
            _that.isBackfillArea = true
            _that.areaChange()
          })
        }
      },
      (tx: any, err: any) => {
        console.log(tx, err)
      }
    )
  }
  // 区改变 将实际值抛给父组件
  private areaChange() {
    const value = this.provinceId + ',' + this.cityId + ',' + this.areaId
    this.$emit('input', value)
  }

  //省远程搜索
  private remoteProvince(query: string) {
    if (query !== '') {
      this.loadingProvince = true;
      this.provinceOps = []
      setTimeout(() => {
        this.provinceOps = findKeys(query.toUpperCase(), this.provinceList, ['kname', 'wb', 'py'])
        this.provinceOps.forEach(item => {
          // console.log('搜到数据：',item.kname,item)
        })
        this.loadingProvince = false;
      }, 200);
    } else {
      this.provinceOps = this.provinceList  // 现在不会走到这一步了
    }
  }
  private provinceQueryChange(query: string) {
    if (query == '') {
      // console.log('空值')
      this.$nextTick(() => {
        this.provinceOps = this.provinceList
        this.cityOps = []
        this.areaOps = []
        this.cityId = ''
        this.areaId = ''
      })
    }
  }
  //市远程搜索
  private remoteCity(query: string) {
    if (query !== '') {
      this.loadingCity = true;
      this.cityOps = []
      setTimeout(() => {
        this.cityOps = findKeys(query.toUpperCase(), this.cityList, ['kname', 'wb', 'py'])
        this.cityOps.forEach(item => {
          // console.log('搜到数据：',item.kname,item)
        })
        this.loadingCity = false;
      }, 200);
    } else {
      this.cityOps = this.cityList  // 现在不会走到这一步了
    }
  }
  private cityQueryChange(query: string) {
    if (query == '') {
      // console.log('空值')
      this.$nextTick(() => {
        this.cityOps = this.cityList
        this.areaOps = []
        this.areaId = ''
      })
    }
  }
  // 区远程搜索
  private remoteArea(query: string) {
    if (query !== '') {
      this.loadingArea = true;
      this.areaOps = []
      setTimeout(() => {
        this.areaOps = findKeys(query.toUpperCase(), this.areaList, ['kname', 'wb', 'py'])
        this.areaOps.forEach(item => {
          // console.log('搜到数据：',item.kname,item)
        })
        this.loadingArea = false;
      }, 200);
    } else {
      this.areaOps = this.areaList  // 现在不会走到这一步了
    }
  }
  private areaQueryChange(query: string) {
    if (query == '') {
      // console.log('空值')
      this.$nextTick(() => {
        this.areaOps = this.areaList  // 现在不会走到这一步了
      })
    }
  }

  // 省清空 还原下拉项 联动移除市区值
  private provinceClear() {
    this.provinceOps = deepCopy(this.provinceList)
    this.cityOps = []
    this.areaOps = []
    this.provinceId = ''
    this.cityId = ''
    this.areaId = ''
  }
  // 市清空 还原下拉项 联动移除区值
  private cityClear() {
    this.cityOps = deepCopy(this.cityList)
    this.areaOps = []
    this.areaId = ''
  }
  // 区清空 还原下拉项
  private areaClear() { this.areaOps = deepCopy(this.areaList) }

  // 下拉箭头
  private createArrow() {
    var cascadeAddress: any = this.$refs.cascadeAddress
    var icon = cascadeAddress.getElementsByClassName("el-select__caret")
    for (let i of icon) {
      i.classList.add("el-icon-arrow-up")
    }
  }
}
</script>

<style lang='scss' scoped>
.cascade-address {
  display: flex;
  width: 500px;
  .nofirst {
    margin-left: 8px;
  }
  ::v-deep .is-focus {
    .el-icon-arrow-up {
      transform: rotate(0);
    }
  }
}
</style>
