import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { isPlainObject } from 'lodash'
import { request } from './request'
import camelcaseKeys from 'camelcase-keys'
import { isClientSide } from './utils'
class RESTManagerStatic {
  private $instance!: AxiosInstance
  constructor() {
    this.$instance = request
  }

  request(method: Method, route: string, options: AxiosRequestConfig) {
    return this.$instance[method](route, options)
  }

  get api() {
    return buildRoute(this)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}
const methods = ['get', 'post', 'delete', 'patch', 'put']
const reflectors = [
  'toString',
  'valueOf',
  'inspect',
  'constructor',
  Symbol.toPrimitive,
  Symbol.for('util.inspect.custom'),
]

function buildRoute(manager: RESTManagerStatic): IRequestHandler {
  const route = ['']
  const handler: any = {
    get(target: any, name: Method) {
      if (reflectors.includes(name)) return () => route.join('/')
      if (methods.includes(name)) {
        return async (options: AxiosRequestConfig) => {
          const res = await manager.request(name, route.join('/'), {
            ...options,
          })

          const data = res.data as any

          return Array.isArray(data) || isPlainObject(data)
            ? camelcaseKeys(data, { deep: true })
            : data
        }
      }
      route.push(name)
      return new Proxy(noop, handler)
    },
    // @ts-ignore
    apply(target: any, _, args) {
      route.push(...args.filter((x: string) => x != null)) // eslint-disable-line eqeqeq
      return new Proxy(noop, handler)
    },
  }
  // @ts-ignore
  return new Proxy(noop, handler)
}

export const RESTManager = new RESTManagerStatic()

// @ts-ignore
if (__DEV__ && isClientSide() && !window.api) {
  Object.defineProperty(window, 'api', {
    get() {
      return RESTManager.api
    },
  })
}

interface IRequestHandler<T = AxiosRequestConfig> {
  (id?: string | number): IRequestHandler
  // @ts-ignore
  get<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  post<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  patch<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  delete<P = unknown>(options?: T): Promise<P>
  // @ts-ignore
  put<P = unknown>(options?: T): Promise<P>
  [key: string]: IRequestHandler
}
export type Method = 'get' | 'delete' | 'post' | 'put' | 'patch'

export {}
