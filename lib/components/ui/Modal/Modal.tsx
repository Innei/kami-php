import type { FC, PropsWithChildren } from 'react'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { RootPortalProvider } from '~/components/app/portal'
import { CloseIcon } from '~/components/icons/close'
import { microReboundPreset } from '~/constants/spring'
import { useIsMountedState } from '~/hooks/common/use-is-mounted'
import { cn } from '~/utils/helper'

import { BottomToUpTransitionView } from '../Transition/bottom-up'
import { ScaleTransitionView } from '../Transition/scale'
import styles from './modal.module.css'

export interface ModalProps {
  title?: string
  closeable?: boolean
  onClose?: () => any
  modalClassName?: string
  contentClassName?: string
  blur?: boolean
  fixedWidth?: boolean
  useRootPortal?: boolean
}

export type ModalRefObject = {
  dismiss: () => Promise<void>
  getElement: () => HTMLElement
  forceUpdate: () => void
}

const ModalContent: FC<{
  title?: string
  contentClassName?: string
  children: React.ReactNode
}> = (props) => {
  const { children, contentClassName, title } = props
  return (
    <div
      className={cn(
        styles['content'],
        title && styles['has-title'],
        contentClassName,
      )}
    >
      {children}
    </div>
  )
}

export const Modal = forwardRef<
  ModalRefObject,
  PropsWithChildren<ModalProps> & {
    modalId: string
    useBottomDrawerInMobile: boolean
    disposer: () => void
    getIsMobileViewport: () => boolean
  }
>((props, ref) => {
  const [modalIn, setIn] = useState(true)
  const dismiss = useCallback(() => {
    return new Promise<void>((resolve) => {
      setIn(false)
      setTimeout(() => {
        resolve(null as any)
        props.disposer()
      }, 300)
      props.onClose && props.onClose()
    })
  }, [props.disposer])

  const $wrapper = useRef<HTMLDivElement>(null)
  const forceUpdate = useState({})[1]

  useImperativeHandle(ref, () => ({
    dismiss,
    getElement: () => {
      return $wrapper.current as HTMLElement
    },
    forceUpdate() {
      forceUpdate({})
    },
  }))

  const {
    title,
    closeable,
    modalId,
    useRootPortal,
    getIsMobileViewport,
    blur = true,
  } = props
  const useDrawerStyle = getIsMobileViewport() && props.useBottomDrawerInMobile

  const isMounted = useIsMountedState()

  const portalProviderValue = useRef({ to: $wrapper.current as HTMLElement })

  const Children = (
    <div
      id={modalId}
      ref={$wrapper}
      className={cn(
        styles['modal'],
        props.fixedWidth && styles['fixed-width'],
        useDrawerStyle && styles['drawer'],
        !blur && styles['no-blur'],
        props.modalClassName,
      )}
    >
      {title && (
        <div className={styles['title-wrapper']}>
          <h4>{title}</h4>
        </div>
      )}
      {closeable && (
        <div className={styles['close-btn']} onClick={dismiss} role="button">
          <CloseIcon />
        </div>
      )}
      {useRootPortal ? (
        isMounted ? (
          <RootPortalProvider value={portalProviderValue.current}>
            <ModalContent {...props}>{props.children}</ModalContent>
          </RootPortalProvider>
        ) : null
      ) : (
        <ModalContent {...props}>{props.children}</ModalContent>
      )}
    </div>
  )

  return useDrawerStyle ? (
    <BottomToUpTransitionView in={modalIn}>{Children}</BottomToUpTransitionView>
  ) : (
    <ScaleTransitionView
      animation={{
        enter: {
          ...microReboundPreset,
        },
      }}
      in={modalIn}
    >
      {Children}
    </ScaleTransitionView>
  )
})
