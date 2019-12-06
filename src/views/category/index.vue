<template>
  <div class="container">
    <el-container>
      <el-main>
          <cate-search></cate-search>
          <table-main :state="state"></table-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import CateSearch from "./components/CateSearch";
import TableMain from "./components/TableMain";
import { fetchArticles, fetchArticleGroup } from "@/api/article";
import { mapGetters } from "vuex";
import animate from "animate.css";
export default {
  components: {
    CateSearch,TableMain
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: "",
      value2: "",
      articleGroup: [],
      state: 2
    };
  },
  computed: {
    ...mapGetters(["header", "articleSidebar"])
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
    changeArticles(state) {
      this.state = state;
      window.bus.$emit("blogTableReload", state);
    },
    toggleLeft() {
      this.$store.dispatch("articleSettings/toggleArticleLeft");
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgb(240, 242, 245);
}
.header-left {
  float: left;
  margin: 4px;
}


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
.el-input {
  width: 200px;
  margin: 0px 10px;
}
.el-main {
  padding: 10px;
}
.el-button {
  margin: 2px;
}
.el-select {
  width: 200px;
  margin: 0px 10px;
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
</style>
