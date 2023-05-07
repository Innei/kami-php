'use client'

import { createContext, useContext } from 'react'
import type { FC, PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

import { useIsClient } from '~/hooks/common/use-is-client'
import { isClientSide } from '~/utils/env'

export const useRootPortal = () => {
  const ctx = useContext(RootPortalContext)
  if (!isClientSide()) {
    return null
  }
  return ctx.to || document.body
}

const RootPortalContext = createContext<{
  to?: HTMLElement | undefined
}>({
  to: undefined,
})
export const RootPortalProvider = RootPortalContext.Provider

export const RootPortal: FC<
  PropsWithChildren<{
    to?: HTMLElement
  }>
> = (props) => {
  const isClient = useIsClient()
  const to = useRootPortal()
  if (!isClient) {
    return null
  }

  return createPortal(props.children, props.to || to || document.body)
}
