'use client'

import { Suspense, useEffect, useId, useState } from 'react'

import { useActionStore } from '~/atoms/action'
import { BiMoonStarsFill, PhSunBold } from '~/components/icons/appearance'
import { LampSwitch } from '~/components/ui/LampSwitch'
import { NoticePanel } from '~/components/widgets/Notice'
import { SearchHotKey } from '~/components/widgets/Search'
import { useDarkModeSwitch, useIsDark } from '~/hooks/ui/use-dark'
import { useDetectIsNarrowThanLaptop } from '~/hooks/ui/use-viewport'
import { appendStyle } from '~/utils/load-script'
import { springScrollToElement } from '~/utils/spring'

const useColorModeTransition = (isDark: boolean) => {
  useEffect(() => {
    const { remove } = appendStyle(`:root * { transition: none!important; }`)
    let timer = null as any
    timer = setTimeout(() => {
      remove()
    }, 100)

    return () => {
      remove()
      timer && clearTimeout(timer)
    }
  }, [isDark])
}

export default () => {
  const isNarrowThanLaptop = useDetectIsNarrowThanLaptop()
  const [showNotice, setNotice] = useState(false)

  const isDark = useIsDark()
  const darkToggle = useDarkModeSwitch()
  const actionId = useId()

  useEffect(() => {
    const actionStore = useActionStore.getState()
    actionStore.removeActionById(actionId)
    if (isNarrowThanLaptop) {
      const action = {
        id: actionId,
        icon: isDark ? <PhSunBold /> : <BiMoonStarsFill />,
        onClick: darkToggle,
      }
      actionStore.appendActions(action)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        actionStore.removeActionById(actionId)
      }
    }
  }, [isDark, isNarrowThanLaptop, actionId, darkToggle])

  useColorModeTransition(isDark!)

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace(/^#/, '')
      setTimeout(() => {
        const $el = document.getElementById(decodeURIComponent(id))

        $el && springScrollToElement($el, -window.innerHeight / 2 + 100)
      }, 1050)
    }
  }, [])

  return (
    <Suspense fallback={null}>
      <NoticePanel
        text={!isDark ? '日间' : '夜里'}
        icon={!isDark ? <PhSunBold /> : <BiMoonStarsFill />}
        onExited={() => setNotice(false)}
        in={showNotice}
        key="panel"
      />
      {!isNarrowThanLaptop && (
        <LampSwitch
          onToggle={() => {
            setNotice(true)
          }}
        />
      )}
      <SearchHotKey />
    </Suspense>
  )
}
