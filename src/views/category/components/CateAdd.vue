<template>
        <el-dialog 
  title="提示"
  :visible.sync="dialogVisible"
  width="30%">
    <div slot="footer" class="dialog-footer">
    <el-button @click="chil">取 消</el-button>
    <el-button type="primary" @click="chil">确 定</el-button>
  </div>
123
</el-dialog>
</template>
<script>
export default {
    props:["dialogVisible"],
    data(){
      return {
        dialogVisible:false
      }
    },
    watch:{
      dialogVisible:function(newVal){
        console.log(newVal);
      }
    },
    methods:{
      chil(){
        this.dialogVisible = false
        console.log(this.dialogVisible)
      }
    }
}
</script>