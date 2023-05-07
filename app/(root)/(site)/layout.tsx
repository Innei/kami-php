import type { PropsWithChildren } from 'react'

import { DynamicFooterScript } from '~/components/site/footer'
import { DynamicHeadMeta } from '~/components/site/head'

import { Effect } from './effect'

interface PageSlot {
  header: React.ReactNode
}
export default function SiteLayout(props: PropsWithChildren<PageSlot>) {
  const { children } = props

  return (
    <>
      {props.header}
      <DynamicHeadMeta />
      <DynamicFooterScript />
      <Effect />

      {children}
    </>
  )
}
