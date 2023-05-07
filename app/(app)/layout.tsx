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
import { headers } from 'next/headers'
import { userAgent } from 'next/server'

import { fetchThemeConfig } from '~/data/theme-config'
import type { InitialDataType } from '~/providers/initial-data'
import { $axios, apiClient } from '~/utils/api-client'

import PKG from '../../package.json'
import { FetchInitialDataError } from './fetch-error'
import { AppRootProviders } from './providers'

const fetchInitialData = async (headers: Headers): Promise<InitialDataType> => {
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

  const [aggregateDataSettled, themeConfigSettled] = await Promise.allSettled([
    apiClient.aggregate.getAggregateData().then((data) => ({ ...data })),
    fetchThemeConfig(),
  ])

  if (aggregateDataSettled.status === 'rejected') {
    throw new FetchInitialDataError(aggregateDataSettled.reason, 'aggregate')
  }

  if (themeConfigSettled.status === 'rejected') {
    throw new FetchInitialDataError(themeConfigSettled.reason, 'config')
  }
  const [aggregateData, themeConfig] = [
    aggregateDataSettled.value,
    themeConfigSettled.value,
  ]
  return {
    aggregateData,
    config: themeConfig,
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
  const { title, description } = seo

  return (
    <AppRootProviders data={data}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </AppRootProviders>
  )
}
