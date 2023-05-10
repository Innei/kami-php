import type { FC, PropsWithChildren } from 'react'

import { Divider } from '~/components/ui/Divider'

export const MFootNote: FC = (props: PropsWithChildren) => {
  return (
    <div className="mt-4 children:my-2 children:text-base children:leading-6">
      <Divider />
      {props.children}
    </div>
  )
}
