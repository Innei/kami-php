'use client'

import type { FC } from 'react'
import useSWR from 'swr'

import { withNoSSR } from '~/components/app/no-ssr'
import { TextUpTransitionView } from '~/components/ui/Transition/text-up'
import { apiClient } from '~/utils/api-client'

let isLoaded = false
export const HomeRandomSay: FC = withNoSSR(() => {
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
    <TextUpTransitionView
      className="overflow-hidden leading-6 text-theme-gray-1 my-[2rem]"
      text={data || ''}
      key={data}
    />
  )
})
