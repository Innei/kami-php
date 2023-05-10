import type { PropsWithChildren } from 'react'

import { SiteBackground } from '~/components/site/background'
import Extra from '~/components/site/extra'
import Loader from '~/components/site/loader'
import { SiteFooter } from '~/components/site/site-footer'
import { SiteHeader } from '~/components/site/site-header/Header'
import { MusicMiniPlayerStoreControlled } from '~/components/widgets/Player'

import { Effect } from './effect'
 
export default function SiteLayout(slots: PropsWithChildren) {
  const { children } = slots

  return (
    <>
      <SiteHeader />
      <Loader />
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
