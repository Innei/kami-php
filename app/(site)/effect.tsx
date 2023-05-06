'use client'

import { useEffect, useInsertionEffect } from 'react'

import type { AggregateRoot } from '@mx-space/api-client'

import { useUserStore } from '~/atoms/user'
import { useRootTrackerListener } from '~/hooks/use-analyze'
import { useCheckLogged } from '~/hooks/use-check-logged'
import { useCheckOldBrowser } from '~/hooks/use-check-old-browser'
import { useInitialData } from '~/hooks/use-initial-data'
import { useResizeScrollEvent } from '~/hooks/use-resize-scroll-event'
import { useRouterEvent } from '~/hooks/use-router-event'
import { useScreenMedia } from '~/hooks/use-screen-media'
import { printToConsole } from '~/utils/console'
import { loadStyleSheet } from '~/utils/load-script'

export const Effect = () => {
  useScreenMedia()
  const { check: checkBrowser } = useCheckOldBrowser()
  const { check: checkLogin } = useCheckLogged()
  useRouterEvent()
  useResizeScrollEvent()
  useRootTrackerListener()
  const initialData: AggregateRoot | null = useInitialData()

  useInsertionEffect(() => {
    loadStyleSheet(
      'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@100;300;400;500&display=swap',
    )
  }, [])

  useEffect(() => {
    try {
      const { user } = initialData
      checkLogin()
      // set user
      useUserStore.getState().setUser(user)
      import('~/socket').then(({ socketClient }) => {
        socketClient.initIO()
      })
    } finally {
      document.body.classList.remove('loading')
    }

    checkBrowser()
    printToConsole()
  }, [])

  return null
}
