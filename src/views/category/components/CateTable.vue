<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="categories"
      tooltop-effect="light"
      style="width: 100%;overflow-x: hidden; overflow-y: hidden;font-size: 12px"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" width="30%" ></el-table-column>

      <el-table-column
      label="类别"
      align="center"
      min-width="5%"
      >
        <template slot-scope="{row}" >
          <el-tag type="success" v-if="row.parentId == '-1'">根</el-tag>
          <el-tag type="info" v-else>子</el-tag>

        </template>
      </el-table-column>

      <el-table-column
        label="分类名称"
        :show-overflow-tooltip="true"
        min-width="15%"
        align="center"
        v-if="arr[0].show"
      >
        <template slot-scope="scope">
          <span
            style="color: #409eff;cursor: pointer"
            @click="itemClick(scope.row)"
          >{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分类描述" prop="description"
        min-width="25%" align="left" v-if="arr[1].show">

      </el-table-column>
      <el-table-column label="权重" prop="weight" min-width="10%" align="center" v-if="arr[2].show">
        <template slot-scope="{row}">
             <el-badge :value="row.weight" class="item" type="warning"></el-badge>
        </template>
      </el-table-column>

    <el-table-column label="关联文章数" min-width="19%" align="center" v-if="arr[4].show">
        <template slot-scope="scope">
            <el-badge :value="scope.row.linkNumber" class="item" type="primary"></el-badge>
        </template>
      </el-table-column>
<!--            <el-table-column label="推荐" min-width="8%" size="mini" align="center" v-if="arr[3].show">-->
<!--        <template slot-scope="{row}">-->
<!--          <el-switch-->
<!--            v-model="row.recommend"-->
<!--            active-color="#13ce66"-->
<!--            inactive-color="#ff4949"-->
<!--            @change="changeRecommend(row.id,row.recommend)"-->
<!--          ></el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="创建时间" min-width="19%" sortable align="center" v-if="arr[5].show">
        <template slot-scope="scope">{{ scope.row.createDate}}</template>
      </el-table-column>
<!--     <el-table-column label="图标" prop="icon" min-width="10%" align="center" v-if="arr[6].show">-->
<!--         <template slot-scope="{row}">-->
<!--            <svg-icon :icon-class="row.icon" style="width: 3em;"  />-->
<!--         </template>-->
<!--     </el-table-column>-->
      <el-table-column label="操作" min-width="25%" align="center" v-if="arr[7].show">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" @click="edit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteOne(scope.row)">删除</el-button>
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
import { fetchCategories,deleteCategory } from "@/api/category";
import { formatDate } from "@/utils/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      categories: [],
      loading: false,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      keywords: "",
      state: 2,
      recommend: null,
      title: "",
      startDate: "",
      endDate: "",
      keywords: "",
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
    _this.loadCategories(1, this.pageSize);
    window.bus.$on("cateTableReload", function(state) {
      _this.loading = true;
      _this.currentPage = 1;
      _this.loadCategories(1, _this.pageSize);
    });
    window.bus.$on("searchTable", function(params) {
      _this.loading = true;
      _this.currentPage = 1;
      _this.keywords = params.keywords;
      _this.state = params.state;
      _this.recommend = params.recommend;
      _this.startDate = params.startDate;
      _this.endDate = params.endDate;
      _this.loadArticles(1, _this.pageSize);
    });
    window.bus.$on("resetSearch", function() {
      _this.state = 2;
      _this.resetSearch(_this);
    });
    window.bus.$on("resetCateTable", function() {
      _this.loading = true;
      _this.loadCategories(_this.currentPage, _this.pageSize);
    });
    window.bus.$on("deleteManyCate", state => _this.deleteMany(state));

    window.bus.$on("changeselect", state => {
      var _this = this;
      const noselect = _this.all.filter(function(v) {
        return state.indexOf(v) == -1;
      });
      noselect.map(item => (_this.arr[item].show = false));
      state.map(item => (_this.arr[item].show = true));
    });
  },
  methods: {
    loadCategories(currentPage, pageSize) {
      var _this = this;
      var params = {
        description: this.description,
        pageSize: pageSize,
        currentPage: currentPage,
        keywords: this.keywords,
        recommend: this.recommend,
        startDate: this.startDate,
        endDate: this.endDate
      };
      fetchCategories(params).then(res => {
        _this.categories = res.data.categories;
        _this.totalCount = res.data.totalCount;
        _this.loading = false;
      });
    },
    edit(row){
        window.bus.$emit("editCategory", row.id);
    },
    changeRecommend(id, val) {
      updateArticle({ id: id, recommend: val });
    },
    changeRate(id, val) {
      updateArticle({ id: id, rate: val });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.loadCategories(this.currentPage, pageSize);
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.loadCategories(currentPage, this.pageSize);
    },
    deleteOne(row){
                      this.$confirm(
        "确定要删除该分类?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(()=>{
         this.handleDelete(row);
      })
    },
    handleDelete(row) {
          if(row.linkNumber == 0){
                this.loading = true;
                let params = { ids: row.id};
                deleteCategory(params).then(res => {
                    if (res.status == 200) {
                    this.loading = false;
                    this.$message({
                    message:
                        "删除成功",
                    type: "success"
                    });
                    window.bus.$emit("cateTableReload"); //通过选项卡都重新加载数据
                }
                });
          }else{
              this.$message('此分类还有文章,请先讲文章删除');
          }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("articleSelected", this.multipleSelection);
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    deleteMany(state) {
        this.$confirm(
        "确定要删除该分类?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(()=>{
      this.multipleSelection.map(item => {
          this.handleDelete(item);
      })
      })
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
    }
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



