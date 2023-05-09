'use client'

import { useMemo } from 'react'

import type {
  AggregateTopNote,
  AggregateTopPost,
  SayModel,
} from '@mx-space/api-client'

import { HomePageViewProvider } from '~/components/in-page/Home/context'
import { HomeIntro } from '~/components/in-page/Home/intro'
import { HomeRandomSay } from '~/components/in-page/Home/random-say'
import { HomeSections } from '~/components/in-page/Home/section'

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
  const doAnimation = Boolean(
    globalThis.history
      ? !history.backPath || history.backPath.length === 0
      : false,
  )

  return (
    <HomePageViewProvider
      value={useMemo(() => ({ doAnimation }), [doAnimation])}
    >
      <HomeIntro />

      <HomeRandomSay />
      <HomeSections notes={props.data.notes} posts={props.data.posts} />
    </HomePageViewProvider>
  )
}
