<template>
  <div class="container">
    <el-container>
      <left-panel @changeArticle="changeArticle"></left-panel>
      <el-main>

          <article-search></article-search>

          <table-main :state="state"></table-main>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import BlogTable from "./components/BlogTable";
import ArticleSearch from "./components/ArticleSearch";
import TableMain from "./components/TableMain";
import LeftPanel from "./components/LeftPanel";
import { fetchArticles, fetchArticleGroup } from "@/api/article";
import { mapGetters } from "vuex";
import animate from "animate.css";

export default {
  components: {
    BlogTable,
    ArticleSearch,
    TableMain,
    LeftPanel
  },
  data() {
    return {
      state: 2
    };
  },
  methods:{
    changeArticle(state){
      this.state = state
      window.bus.$emit("blogTableReload", state);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgb(240, 242, 245);
}

.el-header {
  padding: 10px;
}
.el-main {
  padding: 10px;
}
</style>
