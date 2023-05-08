import type { PropsWithChildren } from 'react'

import { SiteBackground } from '~/components/site/background'

export default async function (props: PropsWithChildren) {
  const { children } = props

  return (
    <>
      <SiteBackground />
      <div className="relative z-[1]">{children}</div>
    </>
  )
}
