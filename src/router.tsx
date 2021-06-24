import Router from './components/router'
import Home from './pages/Home'
import Test from './pages/Test'
import NotFound from './pages/NotFound'

export default new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/Test', component: Test },

    { label: '404', component: NotFound },
  ],
})
