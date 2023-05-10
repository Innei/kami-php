import { headers } from 'next/headers'
import 'next/navigation'
import type { PropsWithChildren } from 'react'

import { SiteBackground } from '~/components/site/background'
import Extra from '~/components/site/extra'
import Loader from '~/components/site/loader'
import { SiteFooter } from '~/components/site/site-footer'
import { SiteHeader } from '~/components/site/site-header/Header'
import { MusicMiniPlayerStoreControlled } from '~/components/widgets/Player'

import { Effect } from './effect'

export default async function SiteLayout(slots: PropsWithChildren) {
  const { children } = slots
  const urlString = headers().get('x-url')

  let pathname

  if (urlString) {
    pathname = new URL(urlString).pathname
  }

  return (
    <>
      <SiteHeader />
      {pathname === '/' && <Loader />}
      <Effect />

      <SiteBackground />

      <div className="relative z-[1]">
        {children}

        <SiteFooter />
        <MusicMiniPlayerStoreControlled />
        <Extra />
      </div>
    </>
  )
}
