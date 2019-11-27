<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="articles"
      tooltop-effect="light"
      style="width: 100%;overflow-x: hidden; overflow-y: hidden;font-size: 12px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" width="30" align="left"></el-table-column>
      <el-table-column
        label="标题"
        :show-overflow-tooltip="true"
        min-width="23%"
        align="left"
        v-if="arr[0].show"
      >
        <template slot-scope="scope">
          <span
            style="color: #409eff;cursor: pointer"
            @click="itemClick(scope.row)"
          >{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="19%" align="center" v-if="arr[1].show">
        <template slot-scope="scope">{{ scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="10%" align="center" v-if="arr[2].show">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.type === 'PUBLISHED'">已发布</el-tag>
          <el-tag type="info" v-else-if="row.type === 'Draft'">草稿箱</el-tag>
          <el-tag type="danger" v-else>垃圾箱</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="推荐" min-width="7%" size="mini" align="center" v-if="arr[3].show">
        <template slot-scope="{row}">
          <el-switch
            width="35"
            v-model="row.recommend"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            @change="changeRecommend(row.id,row.recommend)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="评论" min-width="7%" size="mini" align="center" v-if="arr[4].show">
        <template slot-scope="{row}">
          <el-switch
            width="35"
            v-model="row.commentabled"
            active-color="#409EFF"
            inactive-color="#DCDFE6"
            @change="changeRecommend(row.id,row.recommend)"
          ></el-switch>
        </template>
      </el-table-column>
<!--      <el-table-column label="评分" min-width="17%" align="center" v-if="arr[4].show">-->
<!--        <template slot-scope="{row}">-->
<!--          <el-rate-->
<!--            v-model="row.rate"-->
<!--            text-color="#ff9900"-->
<!--            :colors="colors"-->
<!--            :max="4"-->
<!--            @change="changeRate(row.id,row.rate)"-->
<!--          ></el-rate>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="nickname"-->
<!--        label="作者"-->
<!--        min-width="10%"-->
<!--        :show-overflow-tooltip="true"-->
<!--        v-if="arr[5].show"-->
<!--      ></el-table-column>-->
      <el-table-column
        prop="views"
        label="点击量"
        min-width="10%"
        align="center"
        v-if="arr[6].show"
      ></el-table-column>
      <el-table-column label="操作" min-width="25%" align="center" v-if="arr[7].show">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index,scope.row)">详细</el-button>
          <el-button size="mini" type="warning" @click="test()">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="10"
      layout="total,sizes, prev, pager, next"
      :total="totalCount"
    ></el-pagination>
  </div>
</template>

<script>
import { fetchArticles, updateArticle, deleteArticle } from "@/api/article";
import { formatDate } from "@/utils/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      articles: [],
      loading: false,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      keyWord: "",
      type: 2,
      recommend: null,
      title: "",
      startDate: null,
      endDate: null,
      dustbinData: [],
      multipleSelection: [],
      arr: Array.apply(null, Array(8)).map(item => {
        return { show: true };
      }),
      all: [0, 1, 2, 3, 4, 5, 6, 7],
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"]
    };
  },
  mounted() {
    var _this = this;
    _this.loading = true;
    _this.loadArticles(1, this.pageSize);
    window.bus.$on("blogTableReload", function(type) {
      _this.loading = true;
      _this.type = type;
      _this.resetSearch(_this);
      _this.currentPage = 1;
      _this.loadArticles(1, _this.pageSize);
    });
    window.bus.$on("searchTable", function(params) {
      _this.loading = true;
      _this.currentPage = 1;
      _this.keyWord= params.keywords;
      _this.type = params.type;
      _this.recommend = params.recommend;
      console.log(params.startDate);
      _this.startDate = params.startDate;
      _this.endDate = params.endDate;
      _this.loadArticles(1, _this.pageSize);
    });
    window.bus.$on("resetSearch", function() {
      _this.type = 2;
      _this.resetSearch(_this);
    });
    window.bus.$on("resetTable", function() {
      _this.loading = true;
      _this.loadArticles(_this.currentPage, _this.pageSize);
    });
    window.bus.$on("deleteMany", type => _this.deleteMany(type));

    window.bus.$on("changeselect", type => {
      var _this = this;
      const noselect = _this.all.filter(function(v) {
        return type.indexOf(v) == -1;
      });
      noselect.map(item => (_this.arr[item].show = false));
      type.map(item => (_this.arr[item].show = true));
    });
  },
  methods: {
    loadArticles(currentPage, pageSize) {
      var _this = this;
      var params = {
        type: _this.type,
        pageSize: pageSize,
        currentPage: currentPage,
        keyWord: _this.keyWord,
        recommend: _this.recommend,
        startDate: _this.startDate,
        endDate: _this.endDate,
      };
      fetchArticles(params).then(res => {
        _this.articles = res.data.articles;
        _this.totalCount = res.data.totalCount;
        _this.loading = false;
      });
    },
    changeRecommend(id, val) {
      updateArticle({ id: id, recommend: val });
    },
    changeRate(id, val) {
      updateArticle({ id: id, rate: val });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadArticles(this.currentPage, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.loadArticles(currentPage, this.pageSize);
    },
    handleDelete(index, row) {
      this.deleteByType(row.id, 2); //2永久删除，-1放入垃圾箱，0放入回收站
      // this.dustbinData.push(row.id);
      // var ids = this.dustbinData.toString();
      // this.deleteToDustBin(this.state, ids);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("articleSelected", this.multipleSelection);
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    deleteMany(type) {
      var ids = this.multipleSelection.map(item => item.id).toString();
      this.deleteByType(ids, state);
    },
    deleteByType(ids, state) {
      this.$confirm(
        state == 2
          ? "永久删除选中的文章, 是否继续?"
          : state == -1
          ? "将选中的文章放入垃圾箱，是否继续?"
          : "将选中的文章放入草稿箱，是否继续?",
        "提示",
        {
          confrimButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.loading = true;
        let params = { ids: ids, type: type };
        deleteArticle(params).then(res => {
          if (res.status == 200) {
            this.loading = false;
            this.$message({
              message:
                type == 2
                  ? "删除成功"
                  : type == -1
                  ? "已放入垃圾箱"
                  : "已放入草稿箱",
              type: "success"
            });
            window.bus.$emit("blogTableReload", this.state); //通过选项卡都重新加载数据
            window.bus.$emit("resetLeft");
          }
        });
      });
    },
    resetSearch(_this) {
      var _this = this;
      _this.keywords = "";
      _this.recommend = null;
      _this.startDate = "";
      _this.endDate = "";
    }
  },
  filters: {
    formatTableDate(time) {
      return formatDate(time);
    },
  }
};
</script>

<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-button--mini {
  font-size: 2px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.el-table .cell {
  height: 25px !important;
}
.el-select-dropdown__list {
  padding: 0px;
  padding-bottom: 20px;
}
</style>
