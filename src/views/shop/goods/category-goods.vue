<template>
  <div class="rolesControl">
    <el-card>
      <el-button type="primary" @click="addCategory()">添加分类</el-button>
      <el-table
        class="mtop30"
        v-if="categoryList.data"
        :data="categoryList.data"
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
          prop="front_desc"
          label="说明"
          show-overflow-tooltip="true"
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
      <el-form
        ref="rolesForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            type="text"
            placeholder="请输入类别名称"
            v-model="formData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="front_desc">
          <el-input
            type="text"
            placeholder="请输入相关说明"
            v-model="formData.front_desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input
            type="number"
            placeholder="请输入排序"
            v-model="formData.sort_order"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示" prop="is_show">
          <el-switch
            v-model="formData.is_show"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="changeCategory('rolesForm', editType)"
            >确认</el-button
          >
          <el-button @click="cancelCategory(editType)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllCategory,
  delCategory,
  addCategory,
  updCategory
} from '@/api/shop'
export default {
  data() {
    return {
      categoryList: {},
      diaIsShow: false,
      formData: {},
      tempData: {},
      editType: 'update',
      rules: {
        name: [
          {
            required: true,
            message: '请输入类别名称',
            trigger: 'blur'
          }
        ],
        front_desc: [
          {
            required: true,
            message: '请输入相关说明',
            trigger: 'blur'
          }
        ],
        sort_order: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur'
          }
        ],
        is_show: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      },
      editIndex: 0,
      /* 分页 */
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40]
    }
  },
  created() {
    this._getAllCategory()
  },
  methods: {
    handleSize(val) {
      this.pageSize = val
      let data = {
        size: val
      }
      this._getAllCategory(data)
    },
    handlePage(val) {
      this.currentPage = val
      let data = {
        size: this.pageSize,
        page: val
      }
      this._getAllCategory(data)
    },
    changShow(index, data) {
      console.log('object', index, data)
      //修改是否显示
      this._updCategory(data)
    },
    addCategory() {
      this.diaIsShow = true
      this.editType = 'add'
      this.formData = {}
    },
    editCategory(index, data) {
      console.log('edit', index, data)
      this.diaIsShow = true
      this.editType = 'update'
      this.editIndex = index
      this.tempData = data
      this.formData = data
      this.$nextTick(() => {
        this.$refs.rolesForm.clearValidate()
      })
    },
    changeCategory(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === 'update') {
            this._updCategory(this.formData)
          } else {
            console.log('object', this.formData)
            addCategory(this.formData)
              .then(res => {
                if (res.errno == 0) {
                  this._getAllCategory()
                  this.$message({
                    type: 'success',
                    message: '添加成功!',
                    duration: 2000
                  })
                }
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else return
      })
    },
    cancelCategory(type) {
      if (type === 'update') {
        let curData = {
          size: this.pageSize,
          pase: this.currentPage
        }
        this._getAllCategory(curData)
      }
      this.diaIsShow = false
    },
    _getAllCategory(data) {
      getAllCategory(data)
        .then(res => {
          this.categoryList = res.data
          this.total = res.data.count
          // console.log('object', this.categoryList)
        })
        .catch(error => {
          this.$message.error(error)
        })
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
          size: this.pageSize,
          pase: this.currentPage
        }
        delCategory(data)
          .then(res => {
            if (res.errno == 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 2000
              })
              this._getAllCategory(curData)
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
.diaForm {
  .el-input {
    width: 350px;
  }
}
</style>
<style lang="scss">
.diaForm .el-form-item__label {
  padding-right: 12px;
}
</style>
