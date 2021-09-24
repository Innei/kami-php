import About from 'pages/About'
import NoteIndexPage from 'pages/notes'
import NotePage from 'pages/notes/[nid]'
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
    {
      path: '/posts/:id',
      component: PostPage,
    },
    { path: '/notes', component: NoteIndexPage },
    { path: '/notes/:nid(d+|latest)', component: NotePage },
    { label: '404', component: NotFound },
  ],
})
