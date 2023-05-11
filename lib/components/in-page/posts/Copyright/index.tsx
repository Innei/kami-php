import dayjs from 'dayjs'
import type { FC } from 'react'

import { useMasterName } from '~/atoms/user'
import { withNoSSR } from '~/components/app/no-ssr'
import { Divider } from '~/components/ui/Divider'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { cn } from '~/utils/helper'

export interface CopyrightProps {
  title: string

  date?: string | null
}

export const Copyright: FC<CopyrightProps> = withNoSSR((props) => {
  const { title, date } = props
  const name = useMasterName()
  const {
    url: { webUrl },
  } = useInitialData()
  const link = new URL(location.pathname, webUrl).toString()
  return (
    <section
      className={cn(
        'copyright-session',
        'mt-8 text-[12px] text-theme-gray-1 [&_p]:m-0 [&_p]:leading-[2.2]',
      )}
      id="copyright"
    >
      <p>文章标题：{title}</p>
      <p>文章作者：{name}</p>
      <p>
        文章链接：<span>{link}</span>{' '}
        <a
          onClick={() => {
            navigator.clipboard.writeText(link)
          }}
          data-hide-print
          className="select-none"
        >
          [复制]
        </a>
      </p>
      <p>
        最后修改时间:{' '}
        {date ? dayjs(date).format('YYYY 年 MM 月 DD 日 H:mm') : '暂没有修改过'}
      </p>
      <Divider />
      <div>
        <p>
          商业转载请联系站长获得授权，非商业转载请注明本文出处及文章链接，未经站长允许不得对文章文字内容进行修改演绎。
          <br />
          本文采用
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
            创作共用保留署名 - 非商业 - 禁止演绎 4.0 国际许可证
          </a>
        </p>
      </div>
    </section>
  )
})
