import configs from 'configs'
import { MenuModel, PageModel } from './store.types'
import { makeAutoObservable } from 'mobx'
import { uniqBy } from 'lodash'

export const appStore = new (class {
  constructor() {
    makeAutoObservable(this)
  }
  menu: MenuModel[] = configs.menu as MenuModel[]
  headerNav = {
    title: '',
    meta: '',
    show: false,
  }

  shareData: { title: string; text: string; url: string } | null = null

  pages: PageModel[] = []
  setPage(pages: PageModel[]) {
    this.pages = pages
    const homeMenu = this.menu.find((menu) => menu.type === 'Home')
    if (!homeMenu || !homeMenu.subMenu) {
      return
    }
    const models: MenuModel[] = pages.map((page) => {
      const { title, id, slug } = page
      return {
        title,
        id,
        path: '/' + slug,
        type: 'Page',
      }
    })

    const old = homeMenu.subMenu
    homeMenu.subMenu = uniqBy([...old, ...models], 'id')
  }
})()
