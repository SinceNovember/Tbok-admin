<template>
  <el-dialog :visible.sync="visible" :show-close="false" width="600px" :modal="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <h2 slot="title">添加分类</h2>
    <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click.stop="cancelModal"><i class="el-dialog__close el-icon el-icon-close"></i></button>

    <el-form class="form-wrapper" ref="cateoryForm" :model="cateoryForm" :rules="rules" label-width="100px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="cateoryForm.name"  placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="父节点：" >
        <el-select v-model="cateoryForm.parentId" style="width: 100%;" placeholder="无父节点">
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input v-model="cateoryForm.description"  type="textarea" placeholder="请输入分类描述" prop="nameRule"></el-input>
      </el-form-item>

      <el-form-item label="权重：">
        <el-input-number v-model="cateoryForm.weight"  label="描述文字"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="buttons-wrap">
      <el-button type="primary" @click="addCategory('cateoryForm')">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { fetchTypes,saveCategory } from "@/api/category";
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        cateoryForm: {
          weight:0
        },
        types:[],
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      var _this = this;
      _this.loadTypes();
    },
    methods: {
      initForm(){
        this.cateoryForm = {
          fromContact: '',
          fromPhone: ''
        };
        if(this.$refs.cateoryForm){
          this.$refs.cateoryForm.resetFields();
        }
      },
      cancelModal(){
        // 关闭弹窗，触发父组件修改visible值
        this.$emit('update:visible', false);
      },
      loadTypes() {
        const _this = this;
        fetchTypes().then(res=>{
          _this.types  = res.data;
        })
      },
      addCategory(formName) {
        this.$refs[formName].validate((valid)=>{
          if(valid){
            saveCategory(this.cateoryForm).then(res=>{
              if (res.status == 200) {
                this.$message({
                  message:"添加成功",
                  type: 'success'}
                );
                this.cancelModal();
                window.bus.$emit("resetCateTable");
              }
            });
          }
        })

      }
    }
  }
</script>
<style lang="scss" scoped>
  .buttons-wrap {
  .el-button {
    margin-right: 20px;
    min-width: 100px;
  }
  }
</style>
