import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Sidebar from '@/layout/components/Sidebar'
import Settings from '@/layout/components/Settings'
import Navbar from '@/layout/components/Navbar'
import TagView from '@/layout/components/TagsView'
import Layout from '@/layout'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'HelloWorld',
      component: Layout
    }
    ]
})
