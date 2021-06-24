import { makeAutoObservable } from 'mobx'
import { UserDto } from 'models/user'
import { RESTManager } from 'utils'

export interface UrlConfig {
  adminUrl: string
  backendUrl: string

  frontendUrl: string
}

export const userStore = new (class {
  constructor() {
    makeAutoObservable(this)
  }
  master: Partial<UserDto> = {}
  token: string | null = null
  get isLogged() {
    return !!this.token
  }

  url: UrlConfig | null = null
  setUser(model: UserDto) {
    this.master = model
  }

  setUrl(url: UrlConfig) {
    this.url = url
  }

  async fetchUrl() {
    if (!this.isLogged) {
      return
    }
    const { data } = (await RESTManager.api.options.url.get()) as any
    this.url = data
  }

  get username() {
    return this.master.username
  }

  get name() {
    return this.master.name
  }
  get introduce() {
    return this.master.introduce || null
  }
  setToken(token?: string) {
    if (!token) {
      return (this.token = null)
    }
    this.token = token
    this.fetchUrl()
  }
})()
