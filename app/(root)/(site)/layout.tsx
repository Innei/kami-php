import type { PropsWithChildren } from 'react'

import { SiteBackground } from '~/components/site/background'
import { LampSwitch } from '~/components/ui/LampSwitch'

import { Effect } from './effect'

interface PageSlot {
  header: React.ReactNode
  footer: React.ReactNode
  player: React.ReactNode
}
export default function SiteLayout(slots: PropsWithChildren<PageSlot>) {
  const { children } = slots

  return (
    <>
      {slots.header}

      <Effect />

      <SiteBackground />
      <LampSwitch />
      <div className="relative z-[1]">
        {children}

        {slots.footer}
        {slots.player}
      </div>
    </>
  )
}
