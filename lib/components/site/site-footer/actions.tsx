'use client'

import { Reorder } from 'framer-motion'
import type { FC } from 'react'
import { useCallback, useDeferredValue, useMemo } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'
import shallow from 'zustand/shallow'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { useMusicStore } from '~/atoms/music'
import { RootPortal } from '~/components/app/portal'
import { ScaleTransitionView } from '~/components/ui/Transition/scale'
import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import {
  useDetectPadOrMobile,
  useIsOverFirstScreenHeight,
} from '~/hooks/ui/use-viewport'
import { cn } from '~/utils/helper'
import { springScrollToTop } from '~/utils/spring'

import styles from './actions.module.css'

const FooterActionsBase: FC<{
  children?: React.ReactNode
}> = (props) => {
  const isOverFirstScreenHeight = useIsOverFirstScreenHeight()

  const isPadOrMobile = useDetectPadOrMobile()
  const { scrollDirection } = useAppStore(
    (state) => ({
      scrollDirection: state.scrollDirection,
    }),
    shallow,
  )

  const shouldHideActionButtons = useMemo(() => {
    if (!isPadOrMobile) {
      return false
    }

    return isOverFirstScreenHeight && scrollDirection == 'down'
  }, [isOverFirstScreenHeight, isPadOrMobile, scrollDirection])

  const { event } = useAnalyze()

  const toTop = useCallback(() => {
    springScrollToTop()
    event({
      action: TrackerAction.Click,
      label: '底部点击回到顶部',
    })
  }, [])

  return (
    <div
      className={cn(styles.action, shouldHideActionButtons && styles['hidden'])}
    >
      <button
        aria-label="to top"
        className={cn(
          styles['top'],
          isOverFirstScreenHeight ? styles['active'] : '',
        )}
        onClick={toTop}
      >
        <BxBxsArrowToTop />
      </button>

      {props.children}
    </div>
  )
}

export const FooterActions: FC = () => {
  const { event } = useAnalyze()

  const handlePlayMusic = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: `底部播放器点击`,
    })
    const musicStore = useMusicStore.getState()
    const nextStatus = !musicStore.isHide
    musicStore.setHide(nextStatus)
    musicStore.setPlay(!nextStatus)
  }, [])

  useShortcut(
    'P',
    [Modifier.Command, Modifier.Shift],
    handlePlayMusic,
    '播放音乐',
  )

  const actions = useDeferredValue(useActionStore((state) => state.actions))

  return (
    <RootPortal>
      <FooterActionsBase>
        <Reorder.Group values={actions} onReorder={() => void 0}>
          {actions.map((action) => {
            const El = action.element ?? (
              <button
                aria-label="footer action button"
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            )

            return (
              <Reorder.Item value={action} key={action.id}>
                <ScaleTransitionView in duration={0.3}>
                  {El}
                </ScaleTransitionView>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
        <button aria-label="open player" onClick={handlePlayMusic}>
          <FaSolidHeadphonesAlt />
        </button>
      </FooterActionsBase>
    </RootPortal>
  )
}

function BxBxsArrowToTop() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24">
      <path d="M6 4h12v2H6zm5 10v6h2v-6h5l-6-6l-6 6z" fill="currentColor" />
    </svg>
  )
}
function FaSolidHeadphonesAlt() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 512 512">
      <path
        fill="currentColor"
        d="M160 288h-16c-35.35 0-64 28.7-64 64.12v63.76c0 35.41 28.65 64.12 64 64.12h16c17.67 0 32-14.36 32-32.06V320.06c0-17.71-14.33-32.06-32-32.06zm208 0h-16c-17.67 0-32 14.35-32 32.06v127.88c0 17.7 14.33 32.06 32 32.06h16c35.35 0 64-28.71 64-64.12v-63.76c0-35.41-28.65-64.12-64-64.12zM256 32C112.91 32 4.57 151.13 0 288v112c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16V288c0-114.67 93.33-207.8 208-207.82c114.67.02 208 93.15 208 207.82v112c0 8.84 7.16 16 16 16h16c8.84 0 16-7.16 16-16V288C507.43 151.13 399.09 32 256 32z"
      />
    </svg>
  )
}
