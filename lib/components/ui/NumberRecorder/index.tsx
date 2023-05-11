import type { FC } from 'react'
import { NumberCounter } from 'react-smooth-number-counter'

import { withNoSSR } from '~/components/app/no-ssr'

interface NumberRecorderProps {
  number: number
  className?: string
}

export const NumberRecorder: FC<NumberRecorderProps> = withNoSSR((props) => {
  return (
    <NumberCounter
      value={props.number}
      transition={500}
      className={props.className}
    />
  )
})
