<template>
  <div class="className">
    <el-card class="anoCard">
      <!-- <div slot="header">
        <span>复杂操作表格</span>
      </div> -->
      <div class="searchDiv">
        <el-cascader
          class="cascader"
          v-model="sch_category"
          :options="options"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
        ></el-cascader>
        <el-input
          type="text"
          placeholder="请输入名称关键字"
          class="width1"
          clearable
          v-model="sch_keyword"
        ></el-input>
        <!-- <el-select
          v-model="sch_category"
          clearable
          filterable
          class="width1"
          placeholde="请选择状态"
        >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select> -->
        <el-button type="primary" icon="el-icon-search" @click="searchTab()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addTab"
          >添加</el-button
        >
      </div>
      <el-table :data="listData.data" border stripe>
        <el-table-column type="index" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 + pageSize * (currentPage - 1) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="c_name" label="类别"></el-table-column>
        <el-table-column
          prop="goods_brief"
          label="描述"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="retail_price" label="价格"></el-table-column>
        <el-table-column
          prop="goods_number"
          label="数量"
          width="60"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="70">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_delete | tagClass">{{
              scope.row.is_delete | statusText
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editTable(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="toDelete(scope.row)"
              :disabled="scope.row.status !== 3 ? false : true"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        class="fyDiv"
        @size-change="handleSize"
        @current-change="handlePage"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="订单修改" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="订单号">
          <el-input
            type="text"
            v-model="formData.order"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单时间" prop="time">
          <el-date-picker
            v-model="formData.time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="配送地址" prop="address">
          <el-input
            type="text"
            placeholder="请输入地址"
            v-model="formData.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input
            type="text"
            placeholder="请输入电话"
            v-model="formData.phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="配送员" prop="name">
          <el-input
            type="text"
            placeholder="请输入姓名"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholde="请选择状态">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', editType)"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listGoods, getCataGoods } from '@/api/shop'
export default {
  data() {
    return {
      listData: [],
      sch_keyword: '',
      sch_category: [0],
      temp_category: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      editType: '',
      options: [],
      rowIndex: 0,
      rules: {
        // order: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        time: [
          {
            // type: 'datetime',
            required: true,
            message: '请输入时间',
            trigger: 'change'
          }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        status: [
          { required: true, message: '请选择订单状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    //商品列表
    this._listGoods({ cateid: 'all' })
    //分类下拉框数据
    this._getCataGoods()
  },
  filters: {
    statusText(val) {
      if (val === undefined) return
      if (val === 0) {
        return '上架'
      } else {
        return '下架'
      }
    },
    tagClass(val) {
      if (val === undefined) return
      if (val === 0) {
        return 'success'
      } else {
        return 'warning'
      }
    }
  },
  methods: {
    handleSize(val) {
      this.pageSize = val
      let data = {
        size: val
      }
      this.sch_keyword && (data.name = this.sch_keyword)
      this.sch_category &&
        (data.cateid = this.sch_category[1] ? this.sch_category[1] : 'all')
      this._listGoods(data)
    },
    handlePage(val) {
      this.currentPage = val
      let data = {
        size: this.pageSize,
        page: val
      }
      this.sch_keyword && (data.name = this.sch_keyword)
      this.sch_category &&
        (data.cateid = this.sch_category[1] ? this.sch_category[1] : 'all')
      this._listGoods(data)
    },
    handleChange(sch_category) {
      this.currentPage = 1
      let data = {
        name: this.sch_keyword,
        cateid: sch_category[1] ? sch_category[1] : 'all'
      }
      this._listGoods(data)
    },
    searchTab() {
      this.currentPage = 1
      let data = {
        name: this.sch_keyword,
        cateid: this.sch_category[1] ? this.sch_category[1] : 'all'
      }
      this._listGoods(data)
    },
    _listGoods(data) {
      listGoods(data)
        .then(res => {
          this.listData = res.data
          this.total = res.data.count
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    _getCataGoods(data) {
      getCataGoods(data)
        .then(res => {
          this.options = res.data
          this.options.unshift({ label: '全部', value: 0 })
        })
        .catch(error => {
          this.$message.error(error)
        })
    },
    getPageData() {
      let start = (this.currentPage - 1) * this.pageSize
      let end = start + this.pageSize
      this.tableData = this.schArr.slice(start, end)
    },
    // 查找
    // add
    addTab() {
      this.formData = {}
      this.diaIsShow = true
      this.formData.order = (Math.random() * 10e18).toString()
      this.formData.id = this.allList.length + 1
      this.editType = 'add'
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
    },
    // 完成
    toSuccess(row) {
      row.status = 0
      this.$notify({
        title: '成功',
        message: '该订单已完成配送',
        type: 'success'
      })
    },
    // 取消
    toDelete(row) {
      row.status = 3
      this.$notify({
        title: '成功',
        message: '已取消该订单',
        type: 'success'
      })
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row)
      this.editType = 'update'
      this.diaIsShow = true
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate()
      })
      this.rowIndex = index
    },
    changeTab(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === 'update') {
            // 改变整个表格数据
            let start = (this.currentPage - 1) * this.pageSize
            this.allList[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            )
            // 解决数组不能通过索引响应数据变化
            this.$set(
              this.tableData,
              this.rowIndex,
              Object.assign({}, this.formData)
            )
            this.$notify({
              title: '成功',
              message: '订单已修改成功',
              type: 'success'
            })
          } else {
            this.tableData.unshift(Object.assign({}, this.formData))
            this.allList.push(Object.assign({}, this.formData))
          }
          this.diaIsShow = false
        } else {
          return
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.anoCard .el-table .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.searchDiv {
  margin-bottom: 20px;
  .el-button {
    padding: 11px 20px;
  }
  .cascader {
    width: 220px;
    margin-right: 10px;
  }
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
.diaForm {
  .el-input {
    width: 350px;
  }
}
</style>
<style lang="scss">
.anoCard {
  .el-card__body:after {
    content: '';
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.diaForm .el-form-item__label {
  padding-right: 20px;
}
.searchDiv [class^='el-icon'] {
  color: #fff;
}
.el-cascader__dropdown {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
