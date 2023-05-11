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
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import React from 'react'

import { DynamicFooterScript } from '~/components/site/footer'
import { DynamicHeadMeta } from '~/components/site/head'
import type { InitialDataType } from '~/providers/initial-data'
import { queryInitialData } from '~/queries/initial'

import { AppRootProviders } from './providers'

const fetchInitialData = async (): Promise<InitialDataType> => {
  return await queryInitialData()
}

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await queryInitialData()
  const { aggregateData } = data

  const { seo, user } = aggregateData
  const { title, description } = seo
  const fullTitle = `${title} · ${description}`
  return {
    title: fullTitle,
    description,
    twitter: {
      card: 'summary',
    },
    category: 'personal_site',
    openGraph: {
      type: 'website',
      images: user.avatar,
      title,
      description,
      siteName: 'Kami / Mix Space',
      locale: 'zh_CN',
    },
    keywords: aggregateData.seo.keywords,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black',
    },
  }
}

export default async function RootLayout(props: PropsWithChildren) {
  const { children } = props
  const data = await fetchInitialData()

  return (
    <AppRootProviders data={data}>
      <head>
        <link rel="alternate" href="/feed" type="application/atom+xml" />

        <link rel="sitemap" href="/sitemap.xml" />

        <style
          dangerouslySetInnerHTML={{
            __html: `.loader-logo{top:50%;left:50%;opacity:1;z-index:100;height:8em;color:#fff !important;position:fixed;transform:translate(-50%, -50%);transition:none !important;perspective:1500px}.loader-logo .animation{animation:zoom-in 1s ease-out backwards;position:relative;z-index:999;transform:translate3d(0, 0, 0);will-change:transform}.loader:before{top:50%;pointer-events:none;left:50%;z-index:99;content:'';width:100vmax;height:100vmax;position:fixed;border-radius:50%;background:var(--primary);transition: background .2s;transform:translate(-50%, -50%) scale(1.5);animation:fade-out 1s ease-out}body.loading .loader:before{pointer-events:all;opacity:1;transition:opacity 0.2s;animation:none}body.loading .loader-logo{transform:translate(-50%, -50%) scale(1);transition:transform 0.8s cubic-bezier(0.5, 0, 0.5, 1.5)}body.loading .loader-logo .animation{animation:none}@keyframes zoom-in{50%{transform:translate3d(0, 0, -300px);opacity:1}80%{opacity:1}to{transform:translate3d(0, 0, 1500px);opacity:0}}@keyframes fade-out{30%{opacity:1}60%{opacity:1}100%{opacity:0}}`,
          }}
        />

        {/* <title>
          {`${data.aggregateData.seo.title} · ${data.aggregateData.seo.description}`}
        </title>
        <meta name="description" content={data.aggregateData.seo.description} /> */}
        <DynamicHeadMeta />
      </head>
      <body className="loading" id="app">
        {children}
        <DynamicFooterScript />
      </body>
    </AppRootProviders>
  )
}
