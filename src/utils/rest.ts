import { AxiosRequestConfig } from 'axios'
import { isClientSide } from 'utils'
import { $http } from './request'

class HttpProxyStatic {
  request(
    method: RequestMethod,
    route: string,
    options?: AxiosRequestConfig | undefined,
  ) {
    return $http[method](route, options)
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

function buildRoute(manager: HttpProxyStatic): IRequestHandler {
  const route = ['']
  const handler: any = {
    get(target: any, name: RequestMethod) {
      if (reflectors.includes(name)) return () => route.join('/')
      if (methods.includes(name)) {
        return async (options: AxiosRequestConfig) => {
          const res = await manager.request(name, route.join('/'), {
            ...options,
          })

          return res
        }
      }
      route.push(name)
      return new Proxy(noop, handler)
    },
    // @ts-ignore
    apply(target: any, _, args) {
      route.push(...args.filter((x: string) => x != null))
      return new Proxy(noop, handler)
    },
  }
  // @ts-ignore
  return new Proxy(noop, handler)
}

export const proxy = new HttpProxyStatic()

// @ts-ignore
if (__DEV__ && isClientSide && !window.api) {
  Object.defineProperty(window, 'api', {
    get() {
      return proxy.api
    },
  })
}

export type RequestMethod = 'get' | 'delete' | 'post' | 'put' | 'patch'

interface IRequestHandler<T = AxiosRequestConfig> {
  (id?: string): IRequestHandler
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
