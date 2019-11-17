import router from './router'
import axios from 'axios'
const _import = require('./router/_import_' + process.env.NODE_ENV)//获取组件的方法
import Layout from '@/layout'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {fetchMenus} from './api/menu'
var getRouter


router.beforeEach((to,from,next)=>{
    NProgress.start() //加载进度条
    if(!getRouter) {
        if(!getRouter) {
          fetchMenus().then(res=>{//从数据库获取菜单列表
                getRouter = res.data   
               //后台拿到路由
                saveObjArr('router', getRouter) //存储路由到localStorage
                routerGo(to,next)

            })

        }else{
            getRouter = getObjectArr('router')
            routerGo(to,next)
            
        }
    }else{
        next()
    }
    NProgress.done()//结束进度条

})

function routerGo(to, next) {
    getRouter = filterAsyncRouter(getRouter) //过滤路由
    router.addRoutes(getRouter) //动态添加路由`
    global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
    next({ ...to, replace: true })
  }
  
  function saveObjArr(name, data) { //localStorage 存储数组对象的方法
    localStorage.setItem(name, JSON.stringify(data))
  }
  
  function getObjArr(name) { //localStorage 获取数组对象的方法
    return JSON.parse(window.localStorage.getItem(name));
  
  }
  
  function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
      if (route.component) {
        if (route.component === 'Layout') {//Layout组件特殊处理
          route.component = Layout
        } else {
          route.component = _import(route.component)
        }
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    })
  
    return accessedRouters
  }
  