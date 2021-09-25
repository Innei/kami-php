import NoteIndexPage from 'pages/notes'
import NotePage from 'pages/notes/[nid]'
import PostListPage from 'pages/posts'
import PostPage2 from 'pages/posts/[category]/[slug]'
import PostPage from 'pages/posts/[id]'
import PageDetail from 'pages/[page]'
import Router from './components/router'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/posts', component: PostListPage },
    {
      path: '/posts/:category/:slug',
      component: PostPage2,
    },
    {
      path: '/posts/:id',
      component: PostPage,
    },
    { path: '/notes', component: NoteIndexPage },

    { path: '/notes/:nid', component: NotePage },
    { path: '/:page', component: PageDetail },
    { label: '404', component: NotFound },
  ],
})
