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
import { cookies } from 'next/headers'

import { darkModeKey } from '~/constants/ui'
import '~/styles'

const safeParse = (v?: string) => {
  try {
    return JSON.parse(v!)
  } catch {
    return null
  }
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dark = cookies().get(darkModeKey)
  const { value: isDarkBoolString } = dark || {}
  const isDark = isDarkBoolString ? safeParse(isDarkBoolString as any) : null

  return (
    <html
      lang="zh-Hans"
      data-dark-cookie={isDarkBoolString}
      className={isDark === true ? 'dark' : isDark === false ? 'light' : ''}
    >
      {children}
    </html>
  )
}
