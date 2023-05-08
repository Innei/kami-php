import type { FC, PropsWithChildren } from 'react'
import { Fragment, useEffect } from 'react'

import { withIF } from '~/components/app/if'
import { withNoSSR } from '~/components/app/no-ssr'
import { RootPortal } from '~/components/app/portal'
import { CloseIcon } from '~/components/icons/close'
import { Overlay } from '~/components/ui/Overlay'
import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useAppRouterEventerListener } from '~/hooks/app/use-router-event'
import { useDetectPadOrMobile } from '~/hooks/ui/use-viewport'
import { cn } from '~/utils/helper'

import styles from './index.module.css'

const _HeaderDrawer: FC<
  PropsWithChildren<{ show: boolean; onExit: () => void }>
> = ({ children, onExit, show }) => {
  const { event } = useAnalyze()

  useEffect(() => {
    if (show) {
      event({
        action: TrackerAction.Interaction,
        label: '顶部导航被打开了',
      })
    }
  }, [show])
  const events = useAppRouterEventerListener()
  useEffect(() => {
    const handler = () => {
      onExit()
    }

    return events.onStart(handler)
  }, [])

  return (
    <RootPortal>
      <Fragment>
        <Overlay show={show} onClose={onExit} zIndex={60} />
        <div className={cn(styles['drawer'], show ? styles['show'] : null)}>
          <div className="pb-4 text-right">
            <span className="p-4 inline-block -mr-5 -mt-4" onClick={onExit}>
              <CloseIcon />
            </span>
          </div>

          {children}
        </div>
      </Fragment>
    </RootPortal>
  )
}
export const HeaderDrawer = withIF(withNoSSR(_HeaderDrawer), () =>
  useDetectPadOrMobile(),
)
