<template>
    <div class="con">
        <div class="info">
            <div style="flex:1">姓名：{{tableData.name}}</div>
            <div style="flex:1">性别：{{tableData.sex}}</div>
            <div style="flex:1">年龄：{{tableData.age}}</div>
            <div style="flex:1">科别：{{tableData.department}}</div>
            <div style="flex:1">病床：{{tableData.bed}}</div>
            <div style="flex:1;text-align:right">住院号：{{tableData.hospitalized}}</div>
        </div>
        <table class="noRowspan" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td>日期</td>
                <td class="item" v-for="(item,i) in tableData.date" :key="i">{{item}}</td>
            </tr>
            <tr>
                <td>患病日数</td>
                <td class="item" v-for="(item,i) in tableData.daysAfterSick" :key="i">{{item}}</td>
            </tr>
            <!-- <tr v-if="httpType == 'http' && urlData.PatroInfoType == '6'">
                <td>术后日数</td>
                <td class="item" v-for="(item,i) in tableData.daysAfterOperation" :key="i">{{item}}</td>
            </tr> -->
            <tr>
                <td>术后日数</td>
                <td class="item" v-for="(item,i) in tableData.daysAfterOperation" :key="i">{{item}}</td>
            </tr>
            <tr>
                <td class="date">每日时间</td>
                <td class="item date" v-for="item in days" :key="item">
                    <div class="c">
                        <div v-for="item in TimeSplit" :key="item">{{item}}</div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="chart" style="display:flex">
            <div class="empty">
                <span class="chartItem" v-for="(item,i) in ChartConfig" :key="i">
                    {{item.name}}
                    <span v-for="index in 13" v-if="index == 0" :key="index" :style="`bottom:-5px`" class="scale">{{item.cellMin}}</span>
                    <span v-for="index in 13" v-if="index != 13" :key="index" :style="`bottom:${YHeight*index-7}px`" class="scale">{{item.cellMin+index*item.displaySplit}}</span>
                </span>
            </div>
            <render-chart :days="days" :chartData="chartData" @yHeight="getYHeight" class="zrender"/>
        </div>
        <table class="noRowspan print" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td>血压(mmhg)</td>
                <td class="item" v-for="(v,index) in tableData.bloodPressure" :key="index">
                    <div class="c">
                        <div v-for="(item,i) in v" :key="i">{{item}}</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>大便次数</td>
                <td class="item" v-for="(item,i) in tableData.shitTimes" :key="i">{{item}}</td>
            </tr>
            <tr>
                <td>身高(cm)</td>
                <td class="item" v-for="(item,i) in tableData.height" :key="i">{{item}}</td>
            </tr>
            <tr>
                <td>体重(kg)</td>
                <td class="item" v-for="(item,i) in tableData.weight" :key="i">{{item}}</td>
            </tr>
            <tr>
                <td>皮试结果</td>
                <td class="item" v-for="(item,i) in tableData.skinTestRst" :key="i">{{item}}</td>
            </tr>
            <div v-for="(item,i) in tableData.statisticsSummary" :key="i">
                <tr v-for="(trItem,trI) in item" :key="trI" >
                    <td>{{trItem.xmmc}}</td>
                    <td class="item" v-for="(itemData,index) in trItem.data" :key="index">{{itemData}}</td>
                </tr>
            </div>
        </table>

        <table class="yesRowspan print" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="isShow">
           <tr>
                <th rowspan="2">日期</th>
                <th rowspan="2">年龄</th>
                <th colspan="2">沐浴</th>
                <th colspan="4">脐带</th>
                <th colspan="3">眼</th>
                <th colspan="3">口腔</th>
                <th colspan="2">鼻</th>
                <th colspan="6">皮肤</th>
                <th colspan="3">头</th>
                <th colspan="2">大便</th>
                <th colspan="2">小便</th>
                <th rowspan="2">体重</th>
                <th rowspan="2">签名</th>
                <th rowspan="2">备注</th>
            </tr>
            <tr>
                <th>护理</th>
                <th>水浴</th>
                <th>正常</th>
                <th>出血</th>
                <th>发炎</th>
                <th>脱落</th>
                <th>正常</th>
                <th>红肿</th>
                <th>分泌</th>
                <th>正常</th>
                <th>红肿</th>
                <th>白点</th>
                <th>正常</th>
                <th>鼻塞</th>
                <th>正常</th>
                <th>干燥</th>
                <th>红斑</th>
                <th>黄疸</th>
                <th>脓泡</th>
                <th>红臂</th>
                <th>正常</th>
                <th>产瘤</th>
                <th>血肿</th>
                <th>正常</th>
                <th>绿便</th>
                <th>正常</th>
                <th>无</th>
            </tr>
            <tr v-for="(item,i) in yesRowspanTable" :key="i">
                <td>{{item["RecordTime"]}}</td>
                <td>{{item["Age"]}}</td>
                <td>{{item["BathNurse"]}}</td>
                <td>{{item["BathingBath"]}}</td>
                <td>{{item["UmbilicalCordzc"]}}</td>
                <td>{{item["UmbilicalCordcx"]}}</td>
                <td>{{item["UmbilicalCordfy"]}}</td>
                <td>{{item["UmbilicalCordtl"]}}</td>
                <td>{{item["Eyezc"]}}</td>
                <td>{{item["Eyehz"]}}</td>
                <td>{{item["Eyefm"]}}</td>
                <td>{{item["OralCavityzc"]}}</td>
                <td>{{item["OralCavityhz"]}}</td>
                <td>{{item["OralCavitybd"]}}</td>
                <td>{{item["Nosezc"]}}</td>
                <td>{{item["Nosebs"]}}</td>
                <td>{{item["Skinzc"]}}</td>
                <td>{{item["Skingz"]}}</td>
                <td>{{item["SkinErythema"]}}</td>
                <td>{{item["Skinhd"]}}</td>
                <td>{{item["Skinnp"]}}</td>
                <td>{{item["Skinhb"]}}</td>
                <td>{{item["Headzc"]}}</td>
                <td>{{item["Headcl"]}}</td>
                <td>{{item["Headxz"]}}</td>
                <td>{{item["Shitzc"]}}</td>
                <td>{{item["Shitlb"]}}</td>
                <td>{{item["Urinezc"]}}</td>
                <td>{{item["Urinew"]}}</td>
                <td>{{item["Weight"]}}</td>
                <td>{{item["Autograph"]}}</td>
                <td>{{item["Notes"]}}</td>
            </tr>
        </table>

        <!-- <div class="pageNum">页码:{{tableData.pageNumber}}</div> -->
    </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import renderChart from './renderChart.vue'
import { getFullTime } from '@/components/Temperature/util.js'
@Component({
    name: 'twd',
    components: {
        renderChart,
    },
})
export default class extends Vue {
    @Prop({ required: true }) private tableData!: any
    @Prop({ required: true }) private chartData!: any
    private TimeSplit:Array<any> = ["2", "6", "10", "14", "18", "22"] //每日时间
    private ChartConfig:Array<any> =[
        {
			name: "脉搏",
			displayMax: 150, // 显示的最大值
			displayMin: 40, // 显示的最小值
			displaySplit: 10, // 显示值递增的间隔
			cellMin: 30, // 坐标轴最小值
			cellSplit: 5 // 坐标轴每格代表的值
		},
		{
			name: "呼吸",
			// displayMax: 55, // 显示的最大值
			// displayMin: 15, // 显示的最小值
			displaySplit: 5, // 显示值递增的间隔
			cellMin: 5, // 坐标轴最小值
			cellSplit: 1 // 坐标轴每格代表的值
		},
		{
			name: "体温",
			displayMax: 42, // 显示的最大值
			displayMin: 35, // 显示的最小值
			displaySplit: 1, // 显示值递增的间隔
			cellMin: 29, // 坐标轴最小值
			cellSplit: 0.2 // 坐标轴每格代表的值
		}
    ]
    private YHeight:number = 0
    private days:number = 0 //天数
    private isShow:boolean = false // 是否显示特定表格
    private yesRowspanTable:Array<any> = [] // 特定表格数据
    mounted(){

    }
    getYHeight(msg:any){
        this.YHeight = msg
    }
    created(){
		this.days = this.tableData.date.length
    }
}
</script>
<style lang="scss" scoped>
    .con{
        padding-bottom: 35px;
        position: relative;
        width: 100%;
        height: 100%;
        .info{
            display:flex;
            text-align:justify;
            text-justify:inter-ideograph;
            font-size: 13px
        }
        .chart{
            width: 100%;
            border-right: 1px solid #000;
            .empty{
                width: 12.5%;
                height: 1250px;
                display: flex;
                &:last-child{
                    clear: both;
                }
            }
            #main{
                flex: 1
            }
        }
        .el-row{
            margin: 5px 0 !important
        }
        .flex{
            display: flex;
            justify-content: space-between;
        }
        .zrender{
            width: 87.5%
        }
        .empty{
            display: flex;
        }
        .noRowspan{
            font-size: 14px;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
            tr{
                display: flex;
                // width: 1270px;
                width: 100%;
                td{
                    width: 12.5%;
                    padding:5px 0;
                    text-align: center;
                    border-left: 1px solid #000;
                    border-top: 1px solid #000;
                    &:last-child{
                        border-right: 0
                    };
                };
                .item{
                    flex:1;
                };
                .date{
                    padding: 0;
                    font-size: 10px;
                    &:first-child{
                        font-size: 14px;
                    }
                }
            };
            &:last-child{
                margin: 0 0 10px 0
            }
        }
        .yesRowspan{
            font-size: 12px;
            padding: 0;
            margin-bottom: 10px;
            border-right: 1px solid #000;
            border-bottom: 1px solid #000;
            tr{
                width: 1270px;
                td{
                    text-align: center;
                    word-break: break-all;
                    border-left: 1px solid #000;
                    border-top: 1px solid #000;
                }
                th{
                    text-align: center;
                    border-left: 1px solid #000;
                    border-top: 1px solid #000
                }
            }
        }
        .chartItem{
            border-right: 1px solid;
            flex: 1;
            text-align: center;
            font-size: 13px;
            position: relative;
            &:first-child{
                border-left: 1px solid
            }
            &:last-child{
                border-right: 0
            };
            .scale{
                position: absolute;
                bottom:-5px;
                left: 2px;
                z-index: 1000;
            }
        }
        .pageNum{
            position: absolute;
            right:0;
            bottom:0
        }
    }
    .c{
       display: flex;
       div{
           flex: 1;
           border-right: 1px solid;
           &:last-child{
               border-right: 0
           }
       }
   }
</style>