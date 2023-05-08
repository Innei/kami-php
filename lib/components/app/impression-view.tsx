import { useInView } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'
import { useRef, useState } from 'react'

import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useOnceEffect } from '~/hooks/common/use-once'

type ImpressionProps = {
  trackerMessage?: string
  action?: TrackerAction
  onTrack?: () => any
}
export const ImpressionView: FC<
  PropsWithChildren<{ shouldTrack?: boolean } & ImpressionProps>
> = (props) => {
  const { shouldTrack, ...rest } = props
  if (!shouldTrack) {
    return <>{props.children}</>
  }
  return <_ImpressionView {...rest} />
}

const _ImpressionView: FC<PropsWithChildren<ImpressionProps>> = (props) => {
  const [impression, setImpression] = useState(false)
  const { event } = useAnalyze()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  useOnceEffect(
    () => {
      setImpression(true)
      event({
        action: props.action ?? TrackerAction.Impression,
        label: props.trackerMessage,
      })

      props.onTrack?.()
    },
    [],
    () => inView,
  )
  return (
    <>
      {props.children}
      {!impression && <div ref={ref} />}
    </>
  )
}
