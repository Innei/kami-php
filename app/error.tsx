'use client'

import { ErrorView } from '~/components/app/error'
import { API_URL } from '~/constants/env'

export default function ErrorPage({ error }: any) {
  let message = error.message
  let statusCode: number | string = 500
  let showBg = false

  if (error?.stack.startsWith('FetchInitialDataError')) {
    // const errorInfo = JSON.parse(error.message)
    message = (
      <div className="leading-[3rem]">
        <p>出现这个错误表示未获取到初始数据</p>
        <p>可能是 API 接口地址配置不正确，或者后端服务出现异常</p>
        <p>API 地址：{API_URL}</p>
      </div>
    )
    statusCode = '无数据'
    showBg = true
  }

  return (
    <>
      {showBg && (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 blur-[15px] filter"
          style={{
            backgroundImage: `url("https://fastly.jsdelivr.net/gh/mx-space/docs-images@master/images/chichi-1.jpeg")`,
          }}
        />
      )}

      <ErrorView
        statusCode={statusCode || 500}
        description={message}
        seo={false}
      />
    </>
  )
}
