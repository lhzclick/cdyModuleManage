<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="mgb20">
          <template>
            <div class="block">
              <span class="demonstration">时间段选择：</span>
              <el-date-picker
                v-model="value"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <el-button class="query" type="primary">查询</el-button>
              <span class="prompt">*查询时间为订单时间</span>
            </div>
            <div style="margin-top:20px;">
              <el-table :data="tableData" border style="width: 100%;font-size:14px" @row-click="openDetails">
                <el-table-column prop="orderTime" label="订单时间"></el-table-column>
                <el-table-column prop="manufacturer" label="制造商"></el-table-column>
                <el-table-column prop="factorName" label="厂家名称"></el-table-column>
                <el-table-column prop="orderNumber" label="订单号"> </el-table-column>
                <el-table-column prop="productOrder" label="产品订单">
                  <template slot-scope="scope">
                    <div>
                      <span
                        @click="orderDetails(scope.$index, scope.row)"
                        style="color:#5ca3e6;cursor:pointer"
                      >{{scope.row.productOrder}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="transaction" :formatter="formatstate" label="交易状态"></el-table-column>
                <el-table-column prop="operation" :formatter="formatterColumn" label="交易操作"></el-table-column>
              </el-table>
              <!-- 分页调用 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNo"
                :page-sizes="[5,10, 20, 50, 100,500]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="24"  v-if="showPrise">
        <el-card shadow="hover" class="mgb20">
          <div>
             <ul class="prompt_tab">
                <li>
                  <img :src="imgSrc+'/img/moduleManage/prompt.png'" />
                  <span style="padding:0 15px">{{this.multipleTable.factorName}}</span>
                  <span style="padding-right:15px;">{{this.multipleTable.orderNumber}}</span>
                  <el-select v-model="module_choise" placeholder="请选择模组类型" @change="currentSel">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" style="float:right" @click="qualityDetail()">质检发货</el-button>
                </li>
              </ul>
                <div v-if="showData">
                    <ul class="prompt_tab">
                        <li class="prompt_title">
                          <img style="margin:0 10px 0 20px" :src="imgSrc+'/img/moduleManage/warning.png'" />温馨提示：显示厂家生产模组质检数量的统计！芯片号(如果是1、2、4号模组则显示物联SN，如果是3号模组则显示设备ID)
                        </li>
                        <li>
                          <el-input style="width:400px;" placeholder="请输入芯片号搜索" v-model="chip" class>
                            <el-button slot="append" icon="el-icon-search"></el-button>
                          </el-input>
                        </li>
                        <li>
                          <span class="demonstration">时间段选择：</span>
                          <el-date-picker
                            v-model="value1"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                          ></el-date-picker>
                          <el-button class="query" type="primary">查询</el-button>
                          <span class="prompt">*查询时间为订单时间</span>
                        </li>
                    </ul>
                  <el-table  v-if="showTab1" border style="width: 100%;font-size:14px">
                    <el-table-column prop label="模组类型"></el-table-column>
                    <el-table-column prop label="芯片号"></el-table-column>
                    <el-table-column prop label="配置功能"></el-table-column>
                    <el-table-column prop label="读取功能"></el-table-column>
                    <el-table-column prop label="强制发送"></el-table-column>
                    <el-table-column prop label="抄件率(记录三次)"></el-table-column>
                    <el-table-column prop label="休眠"></el-table-column>
                    <el-table-column prop label="信号强度"></el-table-column>
                    <el-table-column prop label="信噪比"></el-table-column>
                    <el-table-column prop label="质检时间"></el-table-column>
                  </el-table>
                  <el-table  v-if="showTab2" border style="width: 100%;font-size:14px">
                    <el-table-column prop label="表身号"></el-table-column>
                    <el-table-column prop label="模组类型"></el-table-column>
                    <el-table-column prop label="芯片号"></el-table-column>
                    <el-table-column prop label="读取功能"></el-table-column>
                    <el-table-column prop label="状态"></el-table-column>
                    <el-table-column prop label="电池状态"></el-table-column>
                    <el-table-column prop label="强制发送"></el-table-column>
                    <el-table-column prop label="信号强度"></el-table-column>
                    <el-table-column prop label="信噪比"></el-table-column>
                    <el-table-column prop label="质检时间"></el-table-column>
                  </el-table>
                  <el-table  v-if="showTab3" border style="width: 100%;font-size:14px">
                    <el-table-column prop label="表身号"></el-table-column>
                    <el-table-column prop label="模组类型"></el-table-column>
                    <el-table-column prop label="芯片号"></el-table-column>
                    <el-table-column prop label="读表功能"></el-table-column>
                    <el-table-column prop label="正常状态"></el-table-column>
                    <el-table-column prop label="电池状态"></el-table-column>
                    <el-table-column prop label="出厂配置功能"></el-table-column>
                    <el-table-column prop label="初始化功能"></el-table-column>
                    <el-table-column prop label="读表"></el-table-column>
                    <el-table-column prop label="质检时间"></el-table-column>
                  </el-table>
                  <el-table  v-if="showTab4" border style="width: 100%;font-size:14px">
                    <el-table-column prop label="模组类型"></el-table-column>
                    <el-table-column prop label="芯片号"></el-table-column>
                    <el-table-column prop label="配置功能"></el-table-column>
                    <el-table-column prop label="读取功能"></el-table-column>
                    <el-table-column prop label="强制发送"></el-table-column>
                    <el-table-column prop label="抄件率(记录三次)"></el-table-column>
                    <el-table-column prop label="休眠"></el-table-column>
                    <el-table-column prop label="信号强度"></el-table-column>
                    <el-table-column prop label="信噪比"></el-table-column>
                    <el-table-column prop label="质检时间"></el-table-column>
                  </el-table>
              </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单详情弹框 -->
    <el-dialog width="1040px"  title="订单信息" :visible.sync="isShowOrderDetail" custom-class="dialogStyle">
      <div>
        <ul class="product_title clear">
          <li style="width:70%">产品信息</li>
          <li style="width:28%">数量</li>
        </ul>
        <ul class="order_list">
          <li class="clear">
            <img style="float:left" :src="imgSrc+'/img/moduleManage/order_m01.png'" />
            <div style="float:left" class="order_information">
              <p>LSY-M01</p>
              <p>适用于物联网集中器1对多TTL接口采集一对一485、Mod-bus协议采集工业仪表</p>
            </div>
            <div style="float:left" class="order_number">111</div>
          </li>
        </ul>
        <ul class="receiving_list">
          <li v-for="(item,index) in listData" :key="index">{{item}}</li>
        </ul>
        <div class="close-btn" style="margin-top:15px;">
          <el-button type="primary" @click="isShowOrderDetail = false">质检报告</el-button>
          <el-button @click="isShowOrderDetail = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 质检发货弹框 -->
    <el-dialog width="1040px"  title="订单信息" :visible.sync="isqualityDetail" custom-class="dialogStyle">
      <div>
        <ul class="product_title clear">
          <li style="width:70%">产品信息</li>
          <li style="width:28%">数量</li>
        </ul>
        <ul class="order_list">
          <li class="clear">
            <img style="float:left" :src="imgSrc+'/img/moduleManage/order_m01.png'" />
            <div style="float:left" class="order_information">
              <p>LSY-M01</p>
              <p>适用于物联网集中器1对多TTL接口采集一对一485、Mod-bus协议采集工业仪表</p>
            </div>
            <div style="float:left" class="order_number">111</div>
          </li>
        </ul>
        <ul class="receiving_list">
          <li v-for="(item,index) in qualityData" :key="index">{{item}}</li>
        </ul>
        <div class="deliver_box">
    							<!-- <p class="deliver_choise clear"><span>快速配送</span><span>个人自提</span><em style="color:red">(注:默认收款方式为快速配送)</em></p>
    							<ul class="deliver_tab">
    									<li><span>快递公司</span><el-input v-model="company" placeholder="请输入快递公司"></el-input></li>
    									<li><span>运单号</span><el-input v-model="orderInp" placeholder="请输入运单号"></el-input><span>工厂联系人</span><el-input v-model="orderInp" placeholder="请输入手机号"></el-input></li>
    							</ul>
    							<ul class="deliver_tab"></ul> -->
              <div class="clear">  
                <ul class="deliver_choise clear">
                    <li v-for="(tab,index) in tabsName" :key='index' @click="tabsSwitch(index)" v-bind:class="{active:tab.isActive}">{{tab.name}}</li>
                </ul>   
                <span style='color:red;float: left;line-height:62px;'>(注:默认收款方式为快速配送)</span>  
            </div>  
            <div>
                <div class="tab-card">
                  <ul class="deliver_tab">
    									<li style="margin-bottom:15px;"><span>快递公司</span><el-input style="width:200px" v-model="company" placeholder="请输入快递公司"></el-input></li>
    									<li>
                        <span>运单号</span><el-input style="width:200px" v-model="orderInp" placeholder="请输入运单号"></el-input>
                        <span style="margin-left:30px;">工厂联系人</span><el-input style="width:200px" v-model="orderInp" placeholder="请输入手机号"></el-input>
                      </li>
    							</ul>
                </div>
                <div class="tab-card" style="display: none;"></div>
            </div> 
        </div>
        <div class="close-btn" style="margin-top:15px;">
          <el-button type="primary" @click="isqualityDetail = false">确定发货</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      imgSrc: process.env.VUE_APP_IMG_SRC,
      value: "",
      value1: "",
      showPrise:false,
      showTab1:false,
      showTab2:false,
      showTab3:false,
      showTab4:false,
      showData:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      tableData: [
        {
          orderTime: "2019-09-11 14:46:41",
          manufacturer: "楚天汉仪",
          factorName: "硬件开发测试有限公司",
          orderNumber: "LSY1568184400635",
          productOrder: "订单详情",
          transaction: 0,
          operation: 0
        },
        {
          orderTime: "2019-09-11 14:46:41",
          manufacturer: "楚天汉仪",
          factorName: "草上飞有限公司",
          orderNumber: "LSY1568184400635",
          productOrder: "订单详情",
          transaction: 1,
          operation: 1
        }
      ],
      tabsName:[{name:'快速配送',isActive:true},{name:'个人自提',isActive:false}],
      active: false,
      pageNo: 1,
      pageSize: 10,
      total: 20,
      isShowOrderDetail: false,
      isqualityDetail:false,
      listData: [
        "订单号：",
        "收货信息：",
        "订单时间：",
        "厂家联系人：",
        "发货时间：",
        "快递公司：",
        "运单号："
      ],
      qualityData: [
        "订单号：",
        "收货信息：",
        "订单时间：",
      ],
      options: [
        {
          value: "选项1",
          label: "娄山云1号"
        },
        {
          value: "选项2",
          label: "娄山云2号"
        },
        {
          value: "选项3",
          label: "娄山云3号"
        },
        {
          value: "选项4",
          label: "娄山云4号"
        }
      ],
      module_choise: "",
      chip: "",
      multipleTable: [], 
    };
  },
  components: {},
  computed: {},
  created() {},
  activated() {},
  deactivated() {},
  methods: {
    //订单详情弹框
    orderDetails(index, row) {
      this.isShowOrderDetail = true;
    },
    //获取公司名和订单号
    openDetails (index,row) {
        this.showPrise = true;  
        this.multipleTable=index;
    },
    //质检发货弹框
     qualityDetail() {
      this.isqualityDetail = true;
    },
    //下拉框改变事件
    currentSel(selVal){
      //this.selVal = selVal;
      switch (selVal) {
        case '选项1':
          this.showData=true;
          this.showTab1=true;
          this.showTab2=false;
          this.showTab3=false;
          this.showTab4=false;
          break;
        case '选项2':
          this.showTab2=true;
          this.showTab1=false;
          this.showTab3=false;
          this.showTab4=false;
          break;
        case '选项3':
          this.showTab3=true;
          this.showTab1=false;
          this.showTab2=false;
          this.showTab4=false;
          break;
        case "选项4":
          this.showTab4=true;
          this.showTab1=false;
          this.showTab3=false;
          this.showTab2=false;
          break;
        default:
          return "未知";
      }
    },
    //分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // this.pageSize = val
      // this.getData()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // this.pageNo = val
      // this.getData()
    },
    //选项卡
    tabsSwitch(tabIndex) {
              var tabCardCollection = document.querySelectorAll(".tab-card"),
                  len = tabCardCollection.length;

              for(var i = 0; i < len; i++) {
                  tabCardCollection[i].style.display = "none";
                  this.tabsName[i].isActive = false;
              }
              this.tabsName[tabIndex].isActive = true;
              tabCardCollection[tabIndex].style.display = "block";
          },
    formatterColumn(row, column) {
      switch (row.operation) {
        case 0:
          return "已签收";
          break;
        case 1:
          return "确定收货";
          break;
        case 2:
          return "确定发货";
          break;
        case 3:
          return "已取消";
          break;
        default:
          return "未知";
      }
    },
    formatstate(row, column) {
      switch (row.operation) {
        case 0:
          return "交易成功";
          break;
        case 1:
          return "交易关闭";
          break;
        case 2:
          return "已发货";
          break;
        case 3:
          return "待发货";
          break;
        default:
          return "未知";
      }
    }
  }
};
</script>

<style >
  .dialogStyle>div:nth-child(1){
  border-bottom: 1px solid #EBEEF5;
}
.dialogStyle>div:nth-child(2){
  padding-top: 0;
}
</style>
<style scoped>
.el-row {
  margin-bottom: 20px;
}
.prompt_tab li {
  margin-bottom: 20px;
}

.query {
  margin: 0 15px 0 15px;
}
.prompt {
  color: #bababa;
  font-size: 14px;
}
.el-pagination {
  text-align: right;
  padding-top: 20px;
}
.product_title li {
  line-height: 50px;
  float: left;
  text-indent: 40px;
  font-size: 16px;
}
.clear:after {
  content: "";
  display: block;
  clear: both;
}
.clear {
  zoom: 1;
}
li {
  list-style: none;
}
.order_list img {
  width: 90px;
  height: 90px;
  float: left;
  margin-top: 15px;
}
.order_list div {
  float: left;
}
.order_list {
  max-height: 310px;
  overflow: auto;
}
.order_list li {
  height: 120px;
  padding-left: 40px;
  background: #f0f4f7;
  margin-bottom: 10px;
}
.order_information p {
  width: 570px;
  line-height: 40px;
  font-size: 20px;
}
.order_information p:nth-of-type(2) {
  color: #adafb1;
}
.order_number {
  width: 280px;
  line-height: 120px;
  text-indent: 40px;
}
.receiving_list li {
  line-height: 45px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
}
.prompt_title {
  line-height: 46px;
  border: 1px solid #ffccde;
  background: #f5dce5;
}
.deliver_choise li{
    float: left;
    width: 98px;
    border: 1px solid #62a5e1;
    color: #62a5e1;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    line-height:30px;
    margin-right:20px;
}
.deliver_choise{
  padding: 15px 0;
  float: left;
}
.deliver_box{
  height: 150px;
	background: #f0f4f7;
	padding-left: 40px;
}
.deliver_tab span{
  width: 80px;
  display: inline-block;
}
.deliver_choise  .active{
  color: #fff;
  background-color: #62a5e1;
}
</style>
