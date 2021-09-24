import About from 'pages/About'
import PostListPage from 'pages/posts'
import PostPage from 'pages/posts/[id]'
import Router from './components/router'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/posts', component: PostListPage },
    { path: '/posts/:id', component: PostPage },
    { label: '404', component: NotFound },
  ],
})
