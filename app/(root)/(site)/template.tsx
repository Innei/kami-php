import type { PropsWithChildren } from 'react'

import { SiteBackground } from '~/components/site/background'

export default async function (props: PropsWithChildren) {
  const { children } = props

  return (
    <div>
      <SiteBackground />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
