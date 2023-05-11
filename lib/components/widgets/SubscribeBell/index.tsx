import type { FC } from 'react'

import type { SubscribeTypeToBitMap } from '@mx-space/api-client'

import {
  useIsEnableSubscribe,
  usePresentSubscribeModal,
} from '../Subscribe/hooks'

type SubscribeType = keyof typeof SubscribeTypeToBitMap
interface SubscribeBellProps {
  defaultType: SubscribeType[] | SubscribeType
}
export const SubscribeBell: FC<SubscribeBellProps> = (props) => {
  const { defaultType } = props
  const canSubscribe = useIsEnableSubscribe()
  const { present } = usePresentSubscribeModal(
    'post-end',
    [].concat(defaultType as any),
  )

  if (!canSubscribe) {
    return null
  }

  return (
    <div className="mb-6 flex justify-center">
      <button
        className="flex flex-col items-center justify-center p-4"
        onClick={present}
      >
        <p className="leading-8 text-theme-gray-1 opacity-80">
          站点已开启邮件订阅，点亮小铃铛，订阅最新文章哦~
        </p>

        <i className="icon-[tabler--bell-ringing] mt-4 scale-150 transform text-3xl text-theme-accent opacity-50 transition-opacity hover:opacity-100" />
      </button>
    </div>
  )
}
