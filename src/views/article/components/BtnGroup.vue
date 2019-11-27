<template>
  <div class="btn-group">
    <div class="left-group">
      <el-button type="primary" icon="el-icon-plus" size="mini" v-show="type ===1 || type ===2">新增</el-button>
      <el-button
        type="success"
        icon="el-icon-edit"
        size="mini"
        v-show="type === -1"
        :disabled="selectedLength ===0"
      >恢复</el-button>
      <el-button type="warning" icon="el-icon-edit" size="mini" :disabled="selectedLength !=1">修改</el-button>
      <el-button
        type="danger"
        icon="el-icon-close"
        size="mini"
        :disabled="selectedLength ===0"
        @click="deleteMany"
      >删除</el-button>
      <el-button
        type="success"
        icon="el-icon-s-promotion"
        size="mini"
        :disabled="selectedLength ===0"
        v-show="type === 0"
      >发布</el-button>
      <el-button
        type="info"
        icon="el-icon-folder"
        size="mini"
        :disabled="selectedLength===0"
        v-show="type != 0"
        @click="toDraft"
      >草稿箱</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete-solid"
        size="mini"
        :disabled="selectedLength ===0"
        v-show="type != -1"
        @click="toDustbin"
      >垃圾箱</el-button>
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
              <el-dropdown-item v-for="(city,index) in cities" :key="index">
                <el-checkbox :label="city.name" :key="index">{{city.title}}</el-checkbox>
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
export default {
  data() {
    return {
      checkList: [0, 1, 2, 3, 4, 5, 6, 7],
      cities: [
        {
          name: 0,
          title: "标题"
        },
        {
          name: 1,
          title: "创建时间"
        },
        {
          name: 2,
          title: "状态"
        },
        {
          name: 3,
          title: "推荐"
        },
        {
          name: 4,
          title: "评论"
        },
        {
          name: 5,
          title: "作者"
        },
        {
          name: 6,
          title: "点击量"
        },
        {
          name: 7,
          title: "操作"
        }
      ]
    };
  },
  methods: {
    resetTable() {
      window.bus.$emit("resetTable");
    },
    toggleHeader() {
      this.$store.dispatch("articleSettings/toggleHeader");
    },
    deleteMany() {
      window.bus.$emit("deleteMany", 2);
    },
    toDraft() {
      window.bus.$emit("deleteMany", 0);
    },
    toDustbin() {
      window.bus.$emit("deleteMany", -1);
    },
    changeCol() {
      window.bus.$emit("changeselect", this.checkList);
    }
  },
  props: ["type", "selectedLength"]
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
