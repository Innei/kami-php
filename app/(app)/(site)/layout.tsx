import type { PropsWithChildren } from 'react'

import { DynamicFooterScript } from '~/components/for-layout/footer'
import { DynamicHeadMeta } from '~/components/for-layout/head'

import { Effect } from './effect'

export default async function SiteLayout({ children }: PropsWithChildren) {
  return (
    <>
      <DynamicHeadMeta />
      <DynamicFooterScript />
      <Effect />
      {children}
    </>
  )
}
