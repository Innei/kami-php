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

import { cn } from '~/utils/helper'

import './styles'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hans">
      <head>
        <meta charSet="UTF-8" />

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="alternate" href="/feed" type="application/atom+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="sitemap" href="/sitemap.xml" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={cn(inter.className, 'loading')} id="app">
        {children}
      </body>
    </html>
  )
}
