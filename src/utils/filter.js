import Vue from 'vue'

Vue.filter('statusFilter',function(status) {
  const statusMap = {
    PUBLISHED: 'success',
    DRAFT: 'info',
    DUSTBIN: 'danger'
  }
  return statusMap[status]
});

Vue.filter('statusInfoFilter',function(status) {
  const statusMap = {
    PUBLISHED: '已发布',
    DRAFT: '草稿箱',
    DUSTBIN: '垃圾箱'
  }
  return statusMap[status]
});
