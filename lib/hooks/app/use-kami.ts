import type { FC } from 'react'
import { createElement, useEffect, useRef } from 'react'

import type { ThemeColor } from '~/data/typings/theme'
import { useKamiConfig } from '~/hooks/app/use-initial-data'
import { shuffle } from '~/utils/_'
import { getRandomImage } from '~/utils/images'

import { useIsClient } from '../common/use-is-client'
import { useCurrentColorMode, useIsDark } from '../ui/use-dark'

const loadStyle = (css: string) => {
  const $style = document.createElement('style')
  $style.innerHTML = css

  document.head.appendChild($style)
  return () => {
    document.head.removeChild($style)
  }
}
export const useThemeBackground = () => {
  const {
    site: { background },
  } = useKamiConfig()
  const colorMode = useCurrentColorMode()

  useEffect(() => {
    return loadStyle(
      `body .bg-fixed > .bg { background: url(${
        background.src[colorMode] || background.src.light || background.src.dark
      }) ${background.position}; background-color: rgba(var(--white), 1);  };`,
    )
  }, [background.position, background.src, colorMode])
}

export const useBackgroundOpacity = (opacity: number) => {
  useEffect(() => {
    return loadStyle(`body .bg-fixed { opacity: ${opacity}; }`)
  }, [opacity])
}

export const useFooterBackground = (footerClassName: string) => {
  const {
    site: {
      footer: { background },
    },
  } = useKamiConfig()
  const colorMode = useCurrentColorMode()
  useEffect(() => {
    return loadStyle(
      `.${footerClassName}::before { background: url(${
        background.src[colorMode] || background.src.light || background.src.dark
      }) ${background.position};  }`,
    )
  }, [background.position, background.src, colorMode, footerClassName])
}

export const useRandomImage = (count: number | 'all' = 1) => {
  const nextCount = count === 'all' ? undefined : count
  const {
    site: { figure },
  } = useKamiConfig()

  return useRef(
    figure?.length
      ? shuffle(figure).slice(0, nextCount)
      : getRandomImage(nextCount),
  ).current
}

const ThemeColorDetector: FC<{
  cssVarKay?: string
  dark?: string
  light?: string
  darkHover?: string
  lightHover?: string
}> = (props) => {
  const { cssVarKay, dark, darkHover, light, lightHover } = props
  const isDark = useIsDark()
  const lightStyle = createElement('style', {
    id: 'theme-style',
    dangerouslySetInnerHTML: {
      __html: `html, html.light {--${cssVarKay}: ${light}!important;--${cssVarKay}-hover: ${lightHover}!important};`,
    },
  })

  const isClient = useIsClient()
  if (!isClient) return lightStyle

  return isDark
    ? createElement('style', {
        id: 'theme-style',
        dangerouslySetInnerHTML: {
          __html: `html.dark {--${cssVarKay}: ${dark}!important;--${cssVarKay}-hover: ${darkHover}!important};`,
        },
      })
    : lightStyle
}

export const useCustomThemeColor = (
  themeColorConfig: string | ThemeColor | undefined,
  cssVarKay = 'primary',
) => {
  if (!themeColorConfig) return [null, null] as const

  let nextThemeColorConfig = themeColorConfig
  if (typeof themeColorConfig === 'string') {
    nextThemeColorConfig = {
      dark: themeColorConfig,
      light: themeColorConfig,
      darkHover: themeColorConfig,
      lightHover: themeColorConfig,
    }
  } else {
    nextThemeColorConfig = {
      dark: themeColorConfig.dark || themeColorConfig.light,
      light: themeColorConfig.light || themeColorConfig.dark,
      darkHover: themeColorConfig.darkHover || themeColorConfig.dark,
      lightHover: themeColorConfig.lightHover || themeColorConfig.light,
    }
  }

  return [
    createElement(ThemeColorDetector, {
      ...nextThemeColorConfig,
      cssVarKay,
    }),
    nextThemeColorConfig,
  ] as const
}
