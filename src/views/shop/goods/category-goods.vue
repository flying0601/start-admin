<template>
  <div class="rolesControl">
    <el-card>
      <div class="searchDiv">
        <el-select
          v-model="sch_category"
          filterable
          class="width1"
          placeholde="请选择一级分类"
          @change="cateChang()"
        >
          <el-option
            v-for="item in options"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-input
          type="text"
          placeholder="请输入类别关键字"
          class="width1"
          clearable
          v-model="sch_keyword"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addCategory()"
          >添加</el-button
        >
      </div>
      <el-table
        class="mtop30"
        v-if="categoryList"
        :data="categoryList"
        stripe
        border
        style="width: 100%;"
      >
        <el-table-column type="index" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 + pageSize * (currentPage - 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="类别"></el-table-column>
        <el-table-column
          prop="front_name"
          label="说明"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="is_show" width="100" label="是否显示">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_show"
              :active-value="1"
              :inactive-value="0"
              @change="changShow(scope.$index, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="排序"> </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editCategory(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" @click="_delCategory(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="total"
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
    <el-dialog
      title="分类编辑"
      :visible.sync="diaIsShow"
      :modal="true"
      :modal-append-to-body="false"
      class="diaForm"
    >
      <category-edit
        v-if="diaIsShow"
        ref="cateEdit"
        :formData="formData"
        :editType="editType"
        @childUpd="_updCategory"
        @cancelCate="cancelCategory"
        @cateList="getList"
      ></category-edit>
    </el-dialog>
  </div>
</template>

<script>
import { getListCategory, delCategory, updCategory } from '@/api/shop'
import categoryEdit from './module/category-edit'
export default {
  components: { categoryEdit },
  data() {
    return {
      categoryList: [],
      formData: {},
      sch_keyword: '',
      temp_keyword: '',
      sch_category: 'all',
      diaIsShow: false,
      editType: 'update',
      options: [],
      editIndex: 0,
      /* 分页 */
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40]
    }
  },
  created() {
    this._getListCategory({ parent: 0, size: 1000 }, 'one')
    this._getListCategory({ parent: 'all' })
  },
  methods: {
    handleSize(val) {
      this.pageSize = val
      let data = {
        parent: this.sch_category,
        size: val
      }
      this.temp_keyword && (data.name = this.temp_keyword)
      this._getListCategory(data)
    },
    handlePage(val) {
      this.currentPage = val
      let data = {
        parent: this.sch_category,
        size: this.pageSize,
        page: val
      }
      this.temp_keyword && (data.name = this.temp_keyword)
      this._getListCategory(data)
    },
    //修改是否显示
    changShow(index, data) {
      this._updCategory(data)
    },
    cateChang() {
      // console.log('object', this.sch_category)
      let data = {
        parent: this.sch_category,
        page: 1,
        size: this.pageSize
      }
      this._getListCategory(data)
    },
    addCategory() {
      this.diaIsShow = true
      this.editType = 'add'
      this.formData = {}
    },
    getList() {
      this.currentPage = 1
      let data = {
        parent: this.sch_category,
        page: this.currentPage,
        size: this.pageSize
      }
      this._getListCategory(data, 'two')
      this.formData = {}
    },
    editCategory(index, data) {
      // console.log('edit', index, data)
      this.diaIsShow = true
      this.editType = 'update'
      this.editIndex = index
      this.formData = data
      setTimeout(() => {
        this.$refs.cateEdit.clearForm()
      }, 300)
    },
    cancelCategory(type) {
      // console.log('object', type)
      if (type === 'update') {
        let curData = {
          parent: this.sch_category,
          size: this.pageSize,
          page: this.currentPage
        }
        this._getListCategory(curData)
      }
      this.diaIsShow = false
    },
    searchTab() {
      this.temp_keyword = this.sch_keyword
      this.currentPage = 1
      let data = {
        parent: this.sch_category,
        name: this.sch_keyword
      }
      this._getListCategory(data)
    },
    _getListCategory(data, grade) {
      if (grade == 'one') {
        getListCategory(data)
          .then(res => {
            this.options = res.data.data
            this.options.unshift({ id: 'all', name: '全部' })
            this.options.push({ id: 0, name: '一级' })
          })
          .catch(error => {
            this.$message.error(error)
          })
      } else {
        getListCategory(data)
          .then(res => {
            this.categoryList = res.data.data
            this.total = res.data.count
            // console.log('object', this.categoryList)
          })
          .catch(error => {
            this.$message.error(error)
          })
      }
    },
    _delCategory(param) {
      this.$confirm('此操作将永久删除相关数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          id: param.id
        }
        let curData = {
          parent: this.sch_category,
          size: this.pageSize,
          page:
            this.categoryList.length == 1
              ? this.currentPage - 1
              : this.currentPage
        }
        delCategory(data)
          .then(res => {
            if (res.errno == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 2000
              })
              this._getListCategory(curData)
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      })
    },
    _updCategory(param) {
      let data = {
        id: param.id,
        name: param.name,
        is_show: param.is_show,
        sort_order: param.sort_order
      }
      updCategory(data)
        .then(res => {
          if (res.errno == 0) {
            this.$message({
              type: 'success',
              message: '修改成功!',
              duration: 2000
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
<style scoped lang="scss">
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.rolesControl .mtop30 .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.searchDiv {
  margin-bottom: 20px;
  .el-button {
    padding: 11px 20px;
  }
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
</style>
