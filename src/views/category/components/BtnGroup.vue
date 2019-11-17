<template>
  <div class="btn-group">
    <div class="left-group">
      <el-button type="primary" icon="el-icon-plus" size="mini" v-show="state ===1 || state ===2" @click="clickdia">新增</el-button>
      <el-button type="warning" icon="el-icon-edit" size="mini" :disabled="selectedLength !=1">修改</el-button>
      <el-button
        type="danger"
        icon="el-icon-close"
        size="mini"
        :disabled="selectedLength ===0"
        @click="deleteMany"
      >删除1</el-button>
    </div>

    <div class="right-group">
      <el-button-group style="size:5px">
        <el-button icon="el-icon-search" size="small" @click="toggleHeader"></el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetTable"></el-button>

        <el-dropdown trigger="click" :hide-on-click="false">
          <el-button icon="el-icon-s-grid" size="small">
            <i class="el-icon-caret-bottom"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkList" @change="changeCol">
              <el-dropdown-item v-for="(dropdown,index) in dropdowns" :key="index">
                <el-checkbox :label="dropdown.name" :key="index">{{dropdown.title}}</el-checkbox>
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </el-button-group>
    </div>
    <cate-add :dialogVisible="dialogVisible"></cate-add>
  </div>
</template>
<style>
</style>
<script>
import CateAdd from "./CateAdd";

export default {
  components:{
    CateAdd
  },
  data() {
    return {
      checkList: [0, 1, 2, 3, 4, 5, 6, 7],
      dialogVisible: false,
      dropdowns: [
        {
          name: 0,
          title: "分类名称"
        },
        {
          name: 1,
          title: "分类描述"
        },
        {
          name: 2,
          title: "权重"
        },
        {
          name: 3,
          title: "关联文章数"
        },
        {
          name: 4,
          title: "推荐"
        },
        {
          name: 5,
          title: "创建时间"
        },
        {
          name: 6,
          title: "图标"
        },
        {
          name: 7,
          title: "操作"
        }
      ]
    };
  },
  methods: {
    toggleHeader() {
      this.$store.dispatch("articleSettings/toggleHeader");
    },
    resetTable() {
      window.bus.$emit("resetCateTable");
    },
    deleteMany() {
      window.bus.$emit("deleteManyCate");
    },
    changeCol() {
      window.bus.$emit("changeselect", this.checkList);
    },
    clickdia(){
      console.log("dan");
      console.log("zzz:"+this.dialogVisible)
      this.dialogVisible = true;
      return this.dialogVisible
    }
  },
  props: ["state", "selectedLength"]
};
</script>
<style scoped>
.btn-group {
  margin-bottom: 10px;
}
.left-group {
  width: 60%;
  float: left;
}
.right-group {
  /* width:20%; */
  float: right;
}
</style>
