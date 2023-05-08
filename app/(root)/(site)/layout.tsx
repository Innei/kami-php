import type { PropsWithChildren } from 'react'

import { SiteBackground } from '~/components/site/background'
import { LampSwitch } from '~/components/ui/LampSwitch'

import { Effect } from './effect'

interface PageSlot {
  header: React.ReactNode
}
export default function SiteLayout(props: PropsWithChildren<PageSlot>) {
  const { children } = props

  return (
    <>
      {props.header}

      <Effect />

      <SiteBackground />
      <LampSwitch />
      <div className="relative z-[1]">{children}</div>
    </>
  )
}
