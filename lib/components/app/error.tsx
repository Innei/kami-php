import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'

import { isNumber } from '~/utils/_'
import { isServerSide } from '~/utils/env'

export const errorToText = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return '抱歉啦，页面走丢了'
    case 403:
      return '不要做一些不允许的事情啦'
    case 401:
      return '这是主人的小秘密哦，你是我的主人吗'
    case 408:
      return isServerSide()
        ? '上游服务器连接超时'
        : '连接超时，请检查一下网络哦！'
    case 406:
    case 418:
      return '茶壶出现错误'
    case 666:
      return '你在干什么呀'
    case 500:
    default:
      return '抱歉，出了点小问题'
  }
}
export const ErrorView: NextPage<{
  statusCode: number | string
  showBackButton?: boolean
  showRefreshButton?: boolean
  description?: string | JSX.Element

  // 适用于无数据状态
  seo?: boolean
}> = ({
  statusCode = 500,
  showBackButton = true,
  showRefreshButton = true,
  description,
}) => {
  const router = useRouter()
  const message = errorToText(isNumber(statusCode) ? statusCode : 500)
  return (
    <div className="flex h-[calc(100vh-16rem)] flex-col items-center justify-center text-center text-current">
      <div className="mb-4 flex items-center">
        <h1 className="inline-block align-top text-2xl font-medium">
          {statusCode}
        </h1>
        <div className="mx-5 h-full border-r border-theme-black border-opacity-30" />
        <div className="inline-block text-left align-middle leading-none">
          {description ?? (
            <h2 className="!m-0 !p-0 text-base font-normal">{message}</h2>
          )}
        </div>
      </div>
      {(showBackButton || showBackButton) && (
        <div className="mt-5">
          {showBackButton && (
            <button
              className="btn mr-3 !bg-red-500"
              onClick={() => router.push('/')}
            >
              回到首页
            </button>
          )}
          {showRefreshButton && (
            <button
              className="btn bg-theme-accent"
              onClick={() => location.reload()}
            >
              刷新
            </button>
          )}
        </div>
      )}
    </div>
  )
}
