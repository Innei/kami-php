/* eslint-disable @typescript-eslint/no-empty-interface */
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import QProgress from 'qier-progress'
import { useEffect, useRef, useState } from 'react'

import { pick } from '~/utils/_'

import { useOnceClientEffect } from '../common/use-once-client-effect'
import { useAnalyze } from './use-analyze'

/* eslint-disable @typescript-eslint/no-empty-interface */

/* eslint-disable @typescript-eslint/no-empty-interface */

/* eslint-disable @typescript-eslint/no-empty-interface */

/* eslint-disable @typescript-eslint/no-empty-interface */

interface RouterNavigationEvent {
  url: string
}

type RouterEventFunction = (e: RouterNavigationEvent) => void

// TODO detect error event
export const useAppRouterEventerListener = () => {
  const [isRouterComplete, setIsRouterComplete] = useState(false)

  const startChangeCallback = () => {
    eventsRegisters.current.onStartQ.forEach(($) => $(buildEvent()))
    setIsRouterComplete(false)
  }
  const router = useRouter()
  useEffect(() => {
    const rawPush = router.push
    const rawReplace = router.replace

    const popstateHandler = () => {
      startChangeCallback()
    }

    window.addEventListener('popstate', popstateHandler)

    router.push = (...rest) => {
      startChangeCallback()

      // eslint-disable-next-line prefer-spread
      rawPush.apply(null, rest)
    }

    router.replace = (...rest) => {
      startChangeCallback()

      // eslint-disable-next-line prefer-spread
      rawReplace.apply(null, rest)
    }

    return () => {
      router.push = rawPush
      router.replace = rawReplace

      window.removeEventListener('popstate', popstateHandler)
    }
  }, [])

  const eventsRegisters = useRef({
    onStartQ: [] as RouterEventFunction[],
    // onErrorQ: [] as RouterEventFunction[],
    onCompleteQ: [] as RouterEventFunction[],
    onStart(cb: RouterEventFunction) {
      eventsRegisters.current.onStartQ.push(cb)
      return () => {
        eventsRegisters.current.onStartQ =
          eventsRegisters.current.onStartQ.filter(($) => $ !== cb)
      }
    },

    onComplete(cb: RouterEventFunction) {
      eventsRegisters.current.onCompleteQ.push(cb)
      return () => {
        eventsRegisters.current.onCompleteQ =
          eventsRegisters.current.onCompleteQ.filter(($) => $ !== cb)
      }
    },
  })

  const buildEvent = (): RouterNavigationEvent => {
    return {
      url: location.pathname + location.search,
    }
  }

  useEffect(() => {
    if (!isRouterComplete) return

    eventsRegisters.current.onCompleteQ.forEach(($) => $(buildEvent()))
  }, [isRouterComplete])

  const currentPathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (
      currentPathname === location.pathname &&
      searchParams?.toString() ===
        new URLSearchParams(location.search).toString()
    ) {
      setIsRouterComplete(true)
    }
  }, [currentPathname, searchParams])

  return pick(eventsRegisters.current, ['onStart', 'onComplete'])
}

export const useRouterEvent = () => {
  const { pageview } = useAnalyze()

  const registers = useAppRouterEventerListener()
  const progressBarRef = useRef(
    new QProgress({ colorful: false, color: 'var(--accent)' }),
  )
  useOnceClientEffect(() => {
    registers.onComplete((e) => {
      progressBarRef.current.finish()

      history.backPath = history.backPath
        ? [...history.backPath, e.url]
        : [e.url]

      pageview(location.pathname + location.search)
    })

    registers.onStart(() => {
      progressBarRef.current.start()
    })

    // registers.onErrorQ.push(() => {
    //   history.backPath?.pop()
    // })
  })
}
