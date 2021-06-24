import { makeAutoObservable } from 'mobx'
import { isClientSide } from 'utils'
import { ViewportRecord } from './store.types'
type MediaType = 'screen' | 'print'
type ColorMode = 'light' | 'dark'
type Direction = 'up' | 'down' | null
class UIStore {
  constructor() {
    makeAutoObservable(this)
  }

  viewport: ViewportRecord = {} as any

  position = 0
  scrollDirection: Direction = null
  setScrollDirection(dir: Direction) {
    this.scrollDirection = dir
  }
  autoToggleColorMode = true
  setAutoToggleColorMode(s: boolean) {
    this.autoToggleColorMode = s
  }
  colorMode: ColorMode = 'light'
  setColorMode(mode: ColorMode) {
    this.colorMode = mode
  }
  mediaType: MediaType = 'screen'
  setMediaType(type: MediaType) {
    this.mediaType = type
  }
  updatePosition(direction: 'up' | 'down') {
    if (typeof document !== 'undefined') {
      this.position = document.documentElement.scrollTop
      this.scrollDirection = direction
    }
  }

  get isOverFirstScreenHeight() {
    if (!isClientSide()) {
      return
    }
    return this.position > window.innerHeight || this.position > screen.height
  }

  get isOverPostTitleHeight() {
    if (!isClientSide()) {
      return
    }

    return this.position > 126 || this.position > screen.height / 3
  }

  updateViewport() {
    const innerHeight = window.innerHeight
    const width = document.documentElement.getBoundingClientRect().width
    const { hpad, pad, mobile } = this.viewport

    // 忽略移动端浏览器 上下滚动 导致的视图大小变化
    if (
      this.viewport.h &&
      // chrome mobile delta == 56
      Math.abs(innerHeight - this.viewport.h) < 80 &&
      width === this.viewport.w &&
      (hpad || pad || mobile)
    ) {
      return
    }
    this.viewport = {
      w: width,
      h: innerHeight,
      mobile: window.screen.width <= 568 || window.innerWidth <= 568,
      pad: window.innerWidth <= 768 && window.innerWidth > 568,
      hpad: window.innerWidth <= 1024 && window.innerWidth > 768,
      wider: window.innerWidth > 1024 && window.innerWidth < 1920,
      widest: window.innerWidth >= 1920,
    }
  }

  get isPadOrMobile() {
    return this.viewport.pad || this.viewport.mobile
  }
}
export const uiStore = new UIStore()
