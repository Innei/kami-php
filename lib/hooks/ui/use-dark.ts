import { useEffect, useRef, useState } from 'react'
import { useStateToRef } from 'react-shortcut-guide'
import { create } from 'zustand'

import { darkModeKey } from '~/constants/ui'
import { getCookie, removeCookie, setCookie } from '~/utils/cookie'
import { isServerSide } from '~/utils/env'

interface IMediaStore {
  isDark: boolean
  toggle: () => void
}

const useMediaStore = create<IMediaStore>(() => {
  return {
    isDark: false,
    toggle: () => void 0,
  }
})

interface DarkModeConfig {
  classNameDark?: string // A className to set "dark mode". Default = "dark".
  classNameLight?: string // A className to set "light mode". Default = "light".
  element?: HTMLElement | undefined | null // The element to apply the className. Default = `document.body`.
  storageKey?: string // Specify the `localStorage` key. Default = "darkMode". set to `undefined` to disable persistent storage.
}

const useDarkModeInternal = (
  initialState: boolean | undefined,
  options: DarkModeConfig,
) => {
  const {
    classNameDark = 'dark',
    classNameLight = 'light',
    storageKey = darkModeKey,
    element,
  } = options

  const [darkMode, setDarkMode] = useState(initialState)

  useEffect(() => {
    const presentedDarkMode = getCookie(storageKey)

    if (presentedDarkMode !== undefined) {
      if (presentedDarkMode === 'true') {
        setDarkMode(true)
      } else if (presentedDarkMode === 'false') {
        setDarkMode(false)
      }
    } else if (
      typeof initialState === 'undefined' &&
      (!element?.classList.contains(classNameDark) ||
        !element?.classList.contains(classNameLight))
    ) {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [storageKey])

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches)

      setCookie(storageKey, e.matches)
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handler)

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handler)
    }
  }, [storageKey])

  const getDarkMode = useStateToRef(darkMode)
  useEffect(() => {
    const handler = () => {
      // if set color mode follow system, del storage
      if (
        window.matchMedia('(prefers-color-scheme: dark)').matches ===
        getDarkMode.current
      ) {
        removeCookie(darkModeKey)
      }
    }
    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [])

  useEffect(() => {
    if (typeof darkMode === 'undefined') {
      return
    }

    const $el = element || document.documentElement
    if (darkMode) {
      $el.classList.remove(classNameLight)
      $el.classList.add(classNameDark)
    } else {
      $el.classList.remove(classNameDark)
      $el.classList.add(classNameLight)
    }
  }, [classNameDark, classNameLight, darkMode, element])

  if (isServerSide()) {
    return {
      toggle: () => {},
      value: false,
    }
  }

  return {
    value: darkMode,
    toggle: () => {
      setDarkMode((d) => {
        if (storageKey) {
          setCookie(storageKey, !d)
        }

        return !d
      })
    },
  }
}

const noop = () => {}

const mockElement = {
  classList: {
    add: noop,
    remove: noop,
  },
}

export const useDarkMode = () => {
  const { toggle, value } = useDarkModeInternal(getCookie(darkModeKey), {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: darkModeKey,
    element: (globalThis.document && document.documentElement) || mockElement,
  })

  useEffect(() => {
    useMediaStore.setState({
      isDark: value,
    })
  }, [value])

  const onceRef = useRef(false)
  if (!onceRef.current) {
    onceRef.current = true
    useMediaStore.setState({ toggle })
  }

  return {
    toggle,
    value,
  }
}

export const useIsDark = () => useMediaStore((state) => state.isDark)
export const useCurrentColorMode = () =>
  useMediaStore((state) => (state.isDark ? 'dark' : 'light'))

export const useDarkModeSwitch = () => {
  return useMediaStore((state) => state.toggle)
}
