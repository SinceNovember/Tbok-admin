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

      <el-table-column label="状态" min-width="10%" align="center" v-if="arr[2].show">
        <template slot-scope="{row}">
          <el-tag :type="row.type | statusFilter">{{row.type | statusInfoFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="推荐" min-width="7%" size="mini" align="center" v-if="arr[3].show">
        <template slot-scope="scope">
          <el-switch
            width="10%"
            v-model="scope.row.recommend"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            :active-value="true"
            :inactive-value="false"
            @change="changeRecommend(scope.$index,scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="评论" min-width="7%" size="mini" align="center" v-if="arr[4].show">
        <template slot-scope="scope">
          <el-switch
            width="35"
            v-model="scope.row.commentabled"
            active-color="#409EFF"
            inactive-color="#DCDFE6"
            @change="changeCommentabled(scope.$index,scope.row)"
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
        label="点击量"
        min-width="5%"
        align="center"
        v-if="arr[6].show"
      >
        <template slot-scope="{row}" >
          <el-badge :value="row.views" class="item">
          </el-badge>
        </template>
      </el-table-column>

      <el-table-column
        label="评论量"
        min-width="5%"
        align="center"
        v-if="arr[6].show"
      >
        <template slot-scope="{row}" >
          <el-badge :value="row.views" class="item">
          </el-badge>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" min-width="15%" align="center" v-if="arr[1].show">
        <template slot-scope="scope">{{ scope.row.createTime}}</template>
      </el-table-column>

      <el-table-column label="操作" min-width="25%" align="center" v-if="arr[7].show">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index,scope.row)">详细</el-button>
          <el-button size="mini" type="warning" @click="test()">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
import { fetchArticles, updateArticle,updateArticle1, deleteArticle } from "@/api/article";
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
    window.bus.$on("updateArticleType",type=>{
      this.handlerUpdateType(type);
    });
    window.bus.$on("deleteMany", function () {
      _this.handleDeleteMany();
    });
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
      //加载文章列表
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
      //获取文章
      fetchArticles(params).then(res => {
        _this.articles = res.data.articles;
        _this.totalCount = res.data.totalCount;
        _this.loading = false;
      });
    },
      //改变推荐的状态
    changeRecommend(index, row) {
        let flag = row.recommend;
        row.recommend = !row.recommend;
        this.$confirm( flag  == true
            ? "确定推荐此文章?"
            : "确定取消推荐此文章?",
            "提示",
             {
                 confrimButtonText: "确定",
                 cancelButtonText: "取消",
                 type: "warning"
             }
        ).then(() =>{
            row.recommend = flag;
            updateArticle({ id: row.id, recommend: flag });

        })
    },
      //开启/关闭评论
    changeCommentabled(index, row) {
        let flag = row.commentabled;
        row.commentabled = !row.commentabled;
        this.$confirm( flag  == true
            ? "确定开启此文章的评论?"
            : "确定关闭此文章的评论?",
            "提示",
            {
                confrimButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
        ).then(() =>{
            row.commentabled = flag;
            updateArticle({ id: row.id, commentabled: flag });

        })
    },
    //修改文章的类型，垃圾箱、草稿箱、发布
    handlerUpdateType(_type) {
      this.$confirm(
        _type == 'PUBLISHED'
          ?"确定发布此文章?":
          _type == 'DUSTBIN'
          ? "将选中的文章放入垃圾箱，是否继续?"
          : "将选中的文章放入草稿箱，是否继续?",
        "提示",
        {
          confrimButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(()=> {
        this.multipleSelection.map(item =>{
          updateArticle({ id: item.id, type: _type});
        });
        //刷新表单
        this.reset();
      })

    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadArticles(this.currentPage, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.loadArticles(currentPage, this.pageSize);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("articleSelected", this.multipleSelection);
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //删除选中的文章
    handleDeleteMany() {
      var ids = this.multipleSelection.map(item => item.id).toString();
      this.handleDelete(ids);
    },
    //删除指定文章
    handleDelete(ids) {
      var _this = this;
      this.$confirm(
        "确定要删除指定文章?",
        "提示",
        {
          confrimButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(()=>{
        _this.loading = true;
        let params = { ids: ids };
        deleteArticle(params).then(res=>{
          if (res.status == 200) {
            _this.loading = false;
            this.$message({
              message:"删除成功",
              type:"success"
            });
          }
        })
        this.reset();
      })
    },
    deleteByType(ids, type) {
      this.$confirm(
        type == 2
          ? "永久删除选中的文章, 是否继续?"
          : type == -1
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
            reset();
            this.$message({
              message:
                type == 2
                  ? "删除成功"
                  : type == -1
                  ? "已放入垃圾箱"
                  : "已放入草稿箱",
              type: "success"
            });
          }
        });
      });
    },
    //刷新左侧数以及文章数
    reset() {
      window.bus.$emit("resetTable");
      window.bus.$emit("resetLeft");
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
  .item1 .el-badge__content{
    background-color: #337ab7;
  }
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
