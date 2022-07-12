import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/Login.vue')
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/Article.vue')
  },
  {
    path: '/top-stories',
    name: 'TopNews',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/TopNews.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/Categories.vue')
  },
  {
    path: '/category/:label/articles',
    name: 'ArticlesInCategory',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/ArticlesInCategory.vue')
  },
  {
    path: '/articles/search/:string',
    name: 'SearchArticles',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/SearchArticles.vue')
  },
  {
    path: '/tag/:word/articles',
    name: 'ArticlesByTag',
    component: () => import(/* webpackChunkName: "about" */ '../views/platform/ArticlesByTag.vue')
  },

    //-------------------------------------CMS-------------------------------------
  {
    path: '/cms/categories',
    name: 'CategoryList',
    meta: {
      authRequired: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/cms/CategoryList.vue')
  },
  {
    path: '/cms/users',
    name: 'Users',
    meta: {
      authRequired: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/cms/UserList.vue')
  },
  {
    path: '/cms/articles',
    name: 'Articles',
    meta: {
      authRequired: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/cms/Articles.vue')
  },
  {
    path: '/cms/articles/category/:label',
    name: 'ArticlesByCategory',
    meta: {
      authRequired: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/cms/ArticlesByCategory.vue')
  },
  {
    path: '/cms/newcategory/:label?',
    name: 'NewCategory',
    meta: {
      authRequired: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/cms/NewCategory.vue')
  },
  {
    path: '/cms/newarticle/:id?',
    name: 'NewArticle',
    meta: {
      authRequired: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/cms/NewArticle.vue')
  },
  {
    path: '/cms/newuser/:email?',
    name: 'NewUser',
    meta: {
      authRequired: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/cms/NewUser.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.authRequired) {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      next({name: 'Login'});
      return;
    }

    const payload = JSON.parse(atob(jwt.split('.')[1]));
    const expDate = new Date(payload.exp * 1000);
    if (expDate < new Date()) {
      next({name: 'Login'});
      return;
    }
  }

  next();
});

export default router
