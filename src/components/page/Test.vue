<template>
  <div>
    <el-table
      :header-cell-style="{background:'#666',color:'white'}"
      :data="tabledata"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" label="选择" align="center" width="55"></el-table-column>
      <el-table-column label="任务类型" width="220">
        <template slot-scope="scope">
          <i  :class="scope.row.icon"></i>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="200">
        <template slot-scope="scope">
          <div>{{scope.row.state}}</div>
        </template>
      </el-table-column>
      <el-table-column label="分组" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.type}}</div>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormAdd()">确 定</el-button>
      <span class="el-button-di">
        <el-button @click="dialogAdd.show = false">取 消</el-button>
      </span>
    </div>
  </div>
</template>
 <script>
export default {
  data() {
    return {
      tabledata: [
        {
          index: 1,
          icon: "fa fa-empire fa-lg",
          name: "雪碧",
          state: "好喝",
          type: "饮料"
        },
        {
          index: 2,
          icon: "fa fa-gg fa-lg",
          name: "苹果",
          state: "真香",
          type: "水果"
        },
        {
          index: 3,
          icon: "fa fa-xing fa-lg",
          name: "蛋炒饭",
          state: "好吃",
          type: "晚饭"
        }
      ],
      multipleTable: [],     //存放选中值的数组
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val;               //  this.multipleTable 选中的值
      console.log(val);
    },
    dialogFormAdd() {
      for (var i = 0; i < this.multipleTable.length; i++) {
        var halo = this.multipleTable[i];
        console.log(halo);
        // halo即为选中数组里的值。控制台打印就看得到 拿到了值想如何操作都可以了。
        // this.$axios.post().then(res => {
        //  
        // });
      }
    }
  }
};
</script>
<style scoped>
div {
  color: #22d7bb;
  font-size:15px;
}
</style>