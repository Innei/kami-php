import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './App'
import router from './router'
import { SSRProvider } from './context'
import dotenv from 'dotenv'
import camelcaseKeys from 'camelcase-keys'
import axios from 'axios'
import { IncomingMessage } from 'http'
import Package from '../package.json'

const env = dotenv.config().parsed || ({} as any)

async function loadData(url, context) {
  const routes = router.match(url.replace(/\?.*$/, ''))
  const paths = [] as string[]
  const promises = routes.map((e) => {
    paths.push(e.route.path as string)
    return (e.route.component as any).loadData
      ? (e.route.component as any).loadData({
          ...context,
          params: e.match.params,
        })
      : null
  })

  const arr = await Promise.all(promises)
  const dict = {} as Record<string, { url: string; data: any }>

  for (const i in arr) {
    dict[paths[i]] = {
      url: url,
      data: arr[i],
    }
  }

  const apiUrl = env.APIURL
  const $http = axios.create({ baseURL: apiUrl })
  const { data } = await $http.get('aggregate')

  return { ...dict, initialData: camelcaseKeys(data, { deep: true }) }
}

export async function render(url: string, context: any) {
  let data: any = null

  try {
    const req = context.req as IncomingMessage
    if (req) {
      let ip =
        ((req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress) as string) || undefined
      if (ip && ip.split(',').length > 0) {
        ip = ip.split(',')[0]
      }
      axios.defaults.headers.common['x-forwarded-for'] = ip

      axios.defaults.headers.common['User-Agent'] =
        req.headers['user-agent'] +
        ' kami-v2 SSR server' +
        `/${Package.version}`
    }

    data = await loadData(url, context)
  } catch (err: any) {
    data = { $ssrErrorMsg: __DEV__ ? err.stack : err.message }
  }

  for (const i in data) {
    if (data[i].data && data[i].data.redirect) {
      return { redirect: data[i].data.redirect }
    }
  }

  const html = ReactDOMServer.renderToString(
    <SSRProvider value={data}>
      <StaticRouter location={url} context={context}>
        <App></App>
      </StaticRouter>
    </SSRProvider>,
  )

  return { appHtml: html, propsData: data }
}
