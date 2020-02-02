<template>
  <el-form ref="rolesForm" :model="formData" :rules="rules" label-width="140px">
    <el-form-item label="名称" prop="name">
      <el-input
        type="text"
        placeholder="请输入类别名称"
        v-model="formData.name"
      ></el-input>
    </el-form-item>
    <el-form-item label="说明" prop="front_name">
      <el-input
        type="text"
        placeholder="请输入相关说明"
        v-model="formData.front_name"
      ></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sort_order">
      <el-input
        type="number"
        placeholder="请输入排序"
        v-model="formData.sort_order"
      ></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="sort_order">
      <el-upload
        class="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
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
      <el-button type="primary" @click="changeCategory('rolesForm', editType)"
        >确认</el-button
      >
      <el-button @click="cancelCategory(editType)">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { addCategory } from '@/api/shop'
export default {
  props: ['formData', 'editType'],
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            message: '请输入类别名称',
            trigger: 'blur'
          }
        ],
        front_name: [
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
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  watch: {},
  created() {
    if (this.formData && this.formData.wap_banner_url) {
      this.fileList = [
        {
          name: '',
          url: this.formData.wap_banner_url
        }
      ]
    }
  },
  mounted() {},
  methods: {
    changeCategory(form, type) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (type === 'update') {
            this.$emit('childUpd', this.formData)
            // this._updCategory(this.formData)
          } else {
            // console.log('object', this.formData)
            addCategory(this.formData)
              .then(res => {
                if (res.errno == 0) {
                  this.$emit('cateList')
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
    clearForm() {
      this.$nextTick(() => {
        this.$refs.rolesForm.clearValidate()
      })
    },
    cancelCategory(type) {
      this.$emit('cancelCate', type)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss">
.diaForm {
  .el-input {
    width: 350px;
  }
  .el-form-item__label {
    padding-right: 12px;
  }
}
</style>
