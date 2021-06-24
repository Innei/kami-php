import configs from 'configs'
import { MenuModel } from './store.types'
import { makeAutoObservable } from 'mobx'

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
})()
