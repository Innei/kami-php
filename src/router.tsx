import { PageView } from 'pages/[page]'
import Router from './components/Router'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/:page', component: PageView },
    { label: '404', component: NotFound },
  ],
})
