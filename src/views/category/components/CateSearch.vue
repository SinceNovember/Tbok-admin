<template>
  <div class="header-container" >
      <transition
        name="fade"
        enter-active-class="animated fadeInDown"
        leave-active-class="animated fadeOutUp"
      >
  <el-card body-style="padding:8px;" shadow="hover" v-show="header">
    <div class="header-left">
      <div>
        分类名称:
        <el-input size="mini" v-model="keywords"></el-input>
      </div>
      <div>
        分类描述:
        <el-input size="mini" v-model="description"></el-input>
      </div>
      <div>
        创建时间:
        <el-date-picker
          v-model="chooseDate"
          size="mini"
          type="daterange"
          align="right"
          unlink-panels
          style="  margin-left:4px;width:230px"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini" round>搜索</el-button>
        <el-button type="info" icon="el-icon-refresh" @click="reset" size="mini" round>重置</el-button>
      </div>
    </div>
  </el-card>
  </transition>
  </div>
</template>

<script>
import { fetchArticles } from "@/api/article";
import { mapGetters } from "vuex";

import animate from "animate.css";
export default {
  data() {
    return {
        description:null,
      recommendOption: [
        {
          label: "所有",
          value: null
        },
        {
          label: "推荐",
          value: true
        },
        {
          label: "不推荐",
          value: false
        }
      ],
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
      chooseState: 2,
      chooseRecommend: null,
      chooseDate: "",
      keywords: ""
    };
  },
    computed: {
    ...mapGetters(["header", "articleSidebar"])
  },
  methods: {
    search() {
      var params = {
        keywords: this.keywords,
        state: this.chooseState,
        recommend: this.chooseRecommend,
        startDate: this.chooseDate[0],
        endDate: this.chooseDate[1]
      };
      window.bus.$emit("searchTable", params);
    },
    reset() {
      this.keywords = "";
      this.description = "";
      this.chooseRecommend = null;
      this.chooseDate = "";
      window.bus.$emit("resetSearch");
    }
  }
};
</script>


<style lang="scss" scoped>
.header-left {
  float: left;
  margin: 4px;
}
.header-left > div {
  float: left;
  margin: 5px;
}
.el-header {
  padding: 10px;
}
.el-input {
  width: 180px;
  margin: 0px 10px;
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
</style>
