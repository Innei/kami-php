import { useEffect, useRef } from 'react'

import { useIsClient } from './use-is-client'

export const useOnceClientEffect = (fn: () => any) => {
  const isClient = useIsClient()
  const effectOnce = useRef(false)
  const cleanupFn = useRef(() => void 0)

  if (isClient && !effectOnce.current) {
    effectOnce.current = true
    cleanupFn.current = fn?.()
  }

  useEffect(() => cleanupFn.current, [])
}
