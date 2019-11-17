const state = {
  header:1,
  articleSidebar:1,

}

const mutations = {
  TOGGLE_HEADER : state => {
    state.header = !state.header
  },
  TOGGLE_ARTICLE_SIDEBAR : state => {
    state.articleSidebar = !state.articleSidebar
  },

}

const actions = {
  toggleHeader({commit}){
    commit('TOGGLE_HEADER')
  },
  toggleArticleLeft({commit}){
    commit('TOGGLE_ARTICLE_SIDEBAR')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
