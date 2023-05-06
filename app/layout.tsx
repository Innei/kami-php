/*
 *           佛曰：
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 */
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'

import { REQUEST_DEDUPE_TIMEOUT } from '~/constants/app'
import { fetchThemeConfig } from '~/data/theme-config'
import { $axios, apiClient } from '~/utils/api-client'
import { cn } from '~/utils/helper'
import { dedupeFetch } from '~/utils/query-core'

import PKG from '../package.json'
import './globals.css'
import { AppRootProviders } from './providers'

const inter = Inter({ subsets: ['latin'] })

const fetchInitialData = async (headers: Headers) => {
  const userAgentObject = userAgent({
    headers,
  })

  let ip =
    headers.get('x-forwarded-for') ||
    headers.get('X-Forwarded-For') ||
    headers.get('X-Real-IP') ||
    headers.get('x-real-ip') ||
    undefined
  if (ip && ip.split(',').length > 0) {
    ip = ip.split(',')[0]
  }
  ip && ($axios.defaults.headers.common['x-forwarded-for'] = ip as string)

  $axios.defaults.headers.common[
    'User-Agent'
  ] = `${userAgentObject.ua} NextJS/v${PKG.dependencies.next} Kami/${PKG.version}`

  // TODO error handle
  const [aggregateData, themeConfig] = await dedupeFetch(
    [`initial${ip}` || ''],
    () =>
      Promise.all([
        apiClient.aggregate.getAggregateData().then((data) => ({ ...data })),
        fetchThemeConfig(),
      ]),
    {
      queryKey: [`initial${ip}` || ''],
      staleTime: REQUEST_DEDUPE_TIMEOUT,
    },
  )
  return {
    aggregateData,
    themeConfig,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await fetchInitialData(headers())
  const { aggregateData } = data
  const { seo } = aggregateData
  const { title } = seo

  return (
    <AppRootProviders data={data}>
      <html lang="zh-Hans">
        <head>
          <title>{title}</title>

          <meta charSet="UTF-8" />

          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="alternate" href="/feed" type="application/atom+xml" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="sitemap" href="/sitemap.xml" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        </head>
        <body className={cn([inter.className, 'loading'])} id="app">
          {children}
        </body>
      </html>
    </AppRootProviders>
  )
}
