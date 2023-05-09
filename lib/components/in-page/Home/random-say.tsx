import type { FC } from 'react'
import { memo } from 'react'
import useSWR from 'swr'

import { TextUpTransitionView } from '~/components/ui/Transition/text-fade'
import { apiClient } from '~/utils/api-client'

let isLoaded = false
export const HomeRandomSay: FC = memo(() => {
  const { data } = useSWR(
    'home-say',
    () =>
      apiClient.say.getRandom().then(({ data }) => {
        if (!data) {
          return
        }
        return `${data.text}  ——${data.author ?? data.source ?? '站长说'}`
      }),
    {
      fallbackData: '',
      refreshInterval: 60_000,
      revalidateOnFocus: false,
      revalidateOnMount: !isLoaded,
      onSuccess() {
        isLoaded = true
      },
    },
  )

  return (
    <div className="overflow-hidden leading-6 text-[#aaa] my-[2rem]">
      <TextUpTransitionView text={data || ''} key={data} />
    </div>
  )
})
