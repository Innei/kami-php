'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import QProgress from 'qier-progress'
import { useEffect, useRef, useState } from 'react'

import { useOnceClientEffect } from '../common/use-once-client-effect'
import { useAnalyze } from './use-analyze'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RouterNavigationEvent {}

type RouterEventFunction = (e: RouterNavigationEvent) => void

// TODO detect error event
const useAppRouterEventerListener = () => {
  const [isRouterStartChange, setIsRouterStartChange] = useState(false)
  const [isRouterComplete, setIsRouterComplete] = useState(false)

  const router = useRouter()
  useOnceClientEffect(() => {
    const rawPush = router.push
    const rawReplace = router.replace

    const popstateHandler = () => {
      setIsRouterComplete(false)
      setIsRouterStartChange(true)
    }

    window.addEventListener('popstate', popstateHandler)

    router.push = (...rest) => {
      console.log('punish')
      setIsRouterComplete(false)
      setIsRouterStartChange(true)

      // eslint-disable-next-line prefer-spread
      rawPush.apply(null, rest)
    }

    router.replace = (...rest) => {
      setIsRouterComplete(false)
      setIsRouterStartChange(true)

      // eslint-disable-next-line prefer-spread
      rawReplace.apply(null, rest)
    }

    return () => {
      router.push = rawPush
      router.replace = rawReplace

      window.removeEventListener('popstate', popstateHandler)
    }
  })

  const eventsRegisters = useRef({
    onStart: [] as RouterEventFunction[],
    onError: [] as RouterEventFunction[],
    onComplete: [] as RouterEventFunction[],
  })

  const buildEvent = (): RouterNavigationEvent => {
    return {}
  }

  useEffect(() => {
    if (!isRouterStartChange) return

    eventsRegisters.current.onStart.forEach(($) => $(buildEvent()))
  }, [isRouterStartChange])

  useEffect(() => {
    if (!isRouterComplete) return

    eventsRegisters.current.onComplete.forEach(($) => $(buildEvent()))
  }, [isRouterComplete])

  const currentPathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (
      currentPathname === location.pathname &&
      searchParams.toString() ===
        new URLSearchParams(location.search).toString()
    ) {
      setIsRouterComplete(true)
      setIsRouterStartChange(false)
    }
  }, [currentPathname])

  return eventsRegisters.current
}

export const useRouterEvent = () => {
  const { pageview } = useAnalyze()

  const registers = useAppRouterEventerListener()
  const progressBarRef = useRef(new QProgress({ colorful: true }))
  useOnceClientEffect(() => {
    registers.onComplete.push(() => {
      progressBarRef.current.finish()

      pageview(location.pathname + location.search)
    })

    registers.onStart.push(() => {
      progressBarRef.current.start()
    })

    registers.onError.push(() => {
      history.backPath?.pop()
    })
  })
}
