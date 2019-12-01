<template>
<div class="left-panel">
      <transition
        name="fade"
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutLeft"
      >
        <el-aside width="185px" v-show="articleSidebar">
          <el-card :body-style="{ padding: '0px',height:'500px'}" style="font-size:13px">
            <div slot="header" class="clearfix">博客概览</div>
            <ul class="folder-list">
              <li>
                <a @click="changeArticles('ENTIRE')">
                  <i>
                    <svg-icon icon-class="all" />
                  </i>所有
                  <span>
                    <el-tag>{{articleGroup[0]}}</el-tag>
                  </span>
                </a>
              </li>
              <li>
                <a @click="changeArticles('PUBLISHED')">
                  <i>
                    <svg-icon icon-class="release" />
                  </i>已发布
                  <span>
                    <el-tag type="success">{{articleGroup[1]}}</el-tag>
                  </span>
                </a>
              </li>
              <li>
                <a @click="changeArticles('DRAFT')">
                  <i>
                    <svg-icon icon-class="draft" />
                  </i>草稿箱
                  <span>
                    <el-tag type="info">{{articleGroup[2]}}</el-tag>
                  </span>
                </a>
              </li>
              <li>
                <a @click="changeArticles('DUSTBIN')">
                  <i>
                    <svg-icon icon-class="trash" />
                  </i>垃圾箱
                  <span>
                    <el-tag type="danger">{{articleGroup[3]}}</el-tag>
                  </span>
                </a>
              </li>
            </ul>
          </el-card>
        </el-aside>
      </transition>

    <div class="toggle-left" @click="toggleLeft">
        <div class="point-redirect">
          <i class="el-icon-caret-left" v-if="articleSidebar"></i>
          <i class="el-icon-caret-right" v-else></i>
        </div>
      </div>

      </div>

</template>

<script>
import { mapGetters } from "vuex";
import { fetchArticles, fetchArticleGroup } from "@/api/article";

export default {
  data() {
    return {
      value1: "",
      value2: "",
      articleGroup: [],
      type: 2
    };
  },
  computed: {
    ...mapGetters([ "articleSidebar"])
  },
  mounted() {
    let _this = this;
    _this.getArticleGroup();
    window.bus.$on("resetLeft", function() {
      _this.getArticleGroup();
    });
  },
  methods: {
    getArticleGroup() {
      let _this = this;
      fetchArticleGroup().then(res => {
        _this.articleGroup = res.data;
      });
    },
    changeArticles(type) {
      console.log(type);
      this.$emit('changeArticle',type)
    },
    toggleLeft() {
      this.$store.dispatch("articleSettings/toggleArticleLeft");
    }
  }
};
</script>

<style lang="scss" scoped>
.left-card {
  height: 700px;
}
.el-poppers {
  width: 100px;
}
li {
  display: inline-block;
  width: 200px;
  list-style: none;
}
.header-left > div {
  float: left;
  margin: 5px;
}
.el-header {
  padding: 10px;
}
.header-card {
  width: 200px;
  height: 500px;
}
.dropdown__list {
  width: 100px;
}
.folder-list {
  padding-left: 15px;
}
.folder-list li {
  width: 170px;
  height: 30px;
  margin-top: 8px;
  border-bottom: 1px solid #e7eaec;
  display: block;
}
.el-aside {
  padding: 1px;
  a {
    color: #000000;
  }
}
.toggle-left {
  background: #fafafa;
  float: right;
  width: 7px;
  height: 564px;
  padding-top: 7px;
  cursor: pointer;
}
.folder-list i {
  margin-right: 8px;
}
.folder-list span {
  float: right;
  margin-right: 3px;
}
.point-redirect {
  position: relative;
  top: 240px;
  left: 0px;
  height: 46px;
  padding-left: -3px;
  background: #eee;
}
.point-redirect > i {
  margin-left: -4px;
  margin-top: 15px;
}
.clearfix {
  height: 10px;
}
.left-panel{
    display: flex;
}
</style>
