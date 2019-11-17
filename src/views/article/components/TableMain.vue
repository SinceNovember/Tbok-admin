<template>
        <div class="article-container">

  <el-card>
    <btn-group :state="state" :selectedLength="selectedLength"></btn-group>

    <div class="article-list">
      <blog-table @articleSelected="articleSelected"></blog-table>
    </div>
  </el-card>
        </div>
</template>
<script>
import BlogTable from "./BlogTable";
import BtnGroup from "./BtnGroup";
export default {
  data() {
    return {
      selectedLength: 0,
      multipleSelection: []
    };
  },
  components: {
    BlogTable,
    BtnGroup
  },
  watch: {
    multipleSelection(val) {
      this.selectedLength = this.multipleSelection.length;
    }
  },
  methods: {
    articleSelected(selected) {
      this.multipleSelection = selected;
    }
  },
  props: ["state"]
};
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0px;
}
.article-container {
  margin-top: 10px;
}
</style>