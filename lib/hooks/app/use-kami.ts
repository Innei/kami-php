import { useEffect, useRef } from 'react'

import { useKamiConfig } from '~/hooks/app/use-initial-data'
import { shuffle } from '~/utils/_'
import { getRandomImage } from '~/utils/images'

import { useCurrentColorMode } from '../ui/use-dark'

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
