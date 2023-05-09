import type { PropsWithChildren } from 'react'

import { SiteBackground } from '~/components/site/background'

import { Effect } from './effect'

interface PageSlot {
  header: React.ReactNode
  footer: React.ReactNode
  player: React.ReactNode
  extra: React.ReactNode
  loader: React.ReactNode
}
export default function SiteLayout(slots: PropsWithChildren<PageSlot>) {
  const { children } = slots

  return (
    <>
      {slots.header}

      <Effect />

      <SiteBackground />

      <div className="relative z-[1]">
        {children}

        {slots.footer}
        {slots.player}
        {slots.extra}
      </div>
      {slots.loader}
    </>
  )
}
