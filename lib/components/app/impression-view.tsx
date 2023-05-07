import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'

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
  const { ref } = useInView({
    initialInView: false,
    triggerOnce: true,
    onChange(inView) {
      if (inView) {
        setImpression(true)
        event({
          action: props.action ?? TrackerAction.Impression,
          label: props.trackerMessage,
        })

        props.onTrack?.()
      }
    },
  })

  return (
    <>
      {props.children}
      {!impression && <div ref={ref} />}
    </>
  )
}
