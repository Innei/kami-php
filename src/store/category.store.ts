/*
 * @Author: Innei
 * @Date: 2020-06-14 21:19:46
 * @LastEditTime: 2021-02-04 13:53:39
 * @LastEditors: Innei
 * @FilePath: /web/common/store/category.ts
 * @Coding with Love
 */

import { uniqBy } from 'lodash'
import { makeAutoObservable } from 'mobx'
import { CategoryModel } from 'models/category'
import { appStore } from './app.store'
import { MenuModel } from './store.types'

export const categoryStore = new (class CategoryStore {
  constructor() {
    makeAutoObservable(this)
  }
  categories: CategoryModel[] = []

  setCategory(categories: CategoryModel[]) {
    const postMenu = appStore.menu.find((menu) => menu.type === 'Post')
    if (!postMenu || !postMenu.subMenu) {
      return
    }
    const models: MenuModel[] = categories.map((category) => {
      const { id, slug, name } = category
      return {
        title: name,
        id,

        path: '/category/' + slug,
        type: 'Custom',
      }
    })
    const old = postMenu.subMenu
    postMenu.subMenu = uniqBy([...models, ...old!], 'id')
    this.categories = categories
  }

  get categoryMap() {
    const map = new Map()

    this.categories.map((category) => {
      map.set(category.id, category.slug)
    })
    return new Map(map)
  }
})()
