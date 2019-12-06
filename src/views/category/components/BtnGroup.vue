<template>
  <div class="btn-group">
    <div class="left-group">
      <el-button type="primary" icon="el-icon-plus" size="mini" v-show="state ===1 || state ===2" @click="add('categoryForm','add',0)">新增</el-button>
      <add-category ref="categoryForm" v-if="addCategoryVisible" :visible.sync="addCategoryVisible" :categoryId="categoryId" :operation="operationStatus"></add-category>

      <el-button type="warning" icon="el-icon-edit" size="mini" :disabled="selectedLength !=1"  @click="add('categoryForm','edit',-1)">修改</el-button>
      <el-button
        type="danger"
        icon="el-icon-close"
        size="mini"
        :disabled="selectedLength ===0"
        @click="deleteMany"
      >删除</el-button>
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
  </div>
</template>
<style>
</style>
<script>
import CateAdd from "./CateAdd";

export default {
  components:{
    'add-category': CateAdd
  },
  data() {
    return {
      addCategoryVisible: false,
      checkList: [0, 1, 2, 3, 4, 5, 6, 7],
      operationStatus  : 'add',
      categoryId:0,
      dropdowns: [
          {
              name: 0,
              title: "类别"
          },
        {
          name: 1,
          title: "分类名称"
        },
        {
          name: 2,
          title: "分类描述"
        },
        {
          name: 3,
          title: "权重"
        },
        {
          name: 4,
          title: "关联文章数"
        },
        {
          name: 5,
          title: "创建时间"
        },
        {
          name: 6,
          title: "操作"
        }
      ]
    };
  },
  mounted() {
    window.bus.$on("editCategory",id=>{
        this.add('refForm','edit',id);
    })
  },
  methods: {
    add(refForm,status,ids){
      if(this.$refs[refForm]){
        this.$refs[refForm].initForm();
      }
        if (ids == -1) {
            this.categoryId = this.selected[0].id;
        } else {
            this.categoryId = ids;
        }

      this.operationStatus = status;
      this.addCategoryVisible= true;
    },
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
    }
  },
  props: ["state", "selectedLength","selected"]
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
