'use client'

import { useMemo } from 'react'

import type {
  AggregateTopNote,
  AggregateTopPost,
  SayModel,
} from '@mx-space/api-client'

import { HomePageViewProvider } from '~/components/in-page/home/context'
import { HomeIntro } from '~/components/in-page/home/intro'
import { HomeRandomSay } from '~/components/in-page/home/random-say'
import { HomeSections } from '~/components/in-page/home/section'

export default (props: {
  data: Omit<
    {
      notes: AggregateTopNote[]
      posts: AggregateTopPost[]
      says: SayModel[]
    },
    'says'
  >
}) => {
  const doFirstLoadAnimation = Boolean(
    globalThis.history
      ? !history.backPath || history.backPath.length === 0
      : false,
  )

  return (
    <HomePageViewProvider
      value={useMemo(() => ({ doFirstLoadAnimation }), [doFirstLoadAnimation])}
    >
      <HomeIntro />

      <HomeRandomSay />
      <HomeSections notes={props.data.notes} posts={props.data.posts} />
    </HomePageViewProvider>
  )
}
