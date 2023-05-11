'use client'

import type { FC } from 'react'
import { Suspense, memo, useInsertionEffect } from 'react'

import { API_URL } from '~/constants/env'
import { useInitialData, useKamiConfig } from '~/hooks/app/use-initial-data'
import { useCustomThemeColor } from '~/hooks/app/use-kami'
import { isDev } from '~/utils/env'
import { loadScript } from '~/utils/load-script'

export const DynamicHeadMeta: FC = memo(() => {
  const initialData = useInitialData()
  const title = initialData.seo.title

  const themeConfig = useKamiConfig()
  const favicon = themeConfig.site.favicon || '/favicon.svg'

  const { dark: darkBg, light: lightBg } = themeConfig.site.background.src
  const { dark: darkFooter, light: lightFooter } =
    themeConfig.site.footer.background.src
  const { css, js, script, style } = themeConfig.site.custom
  const { themeColor, secondaryColor } = themeConfig.site
  const [themeColorMetaElement, themeColorConfig] =
    useCustomThemeColor(themeColor)
  const [secondaryColorElement] = useCustomThemeColor(
    secondaryColor,
    'secondary',
  )

  const { light: lightColor } = themeColorConfig || {}

  useInsertionEffect(() => {
    js && js.length && js.forEach((src) => loadScript(src))

    if (script) {
      eval(script)
    }
  }, [])

  return (
    <Suspense>
      <meta name="api_url" content={API_URL} />

      <meta name="theme-color" content={lightColor || '#39C5BB'} />

      {!isDev ? (
        // force https
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      ) : null}

      {style ? <style dangerouslySetInnerHTML={{ __html: style }} /> : null}
      {css && css.length
        ? css.map((href, i) => <link rel="stylesheet" href={href} key={i} />)
        : null}

      {/* for pwa */}
      <meta name="application-name" content={title} />
      <meta name="apple-mobile-web-app-title" content={title} />
      <meta name="msapplication-tooltip" content={title} />
      <meta
        name="msapplication-navbutton-color"
        content={lightColor || '#39C5BB'}
      />

      {/* for favicon */}
      <link rel="shortcut icon" href={favicon} />
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />

      {darkBg && <link rel="preload" href={darkBg} as="image" />}
      {lightBg && <link rel="preload" href={lightBg} as="image" />}
      {darkFooter && <link rel="preload" href={darkFooter} as="image" />}
      {lightFooter && <link rel="preload" href={lightFooter} as="image" />}

      {themeColorMetaElement}
      {secondaryColorElement}
    </Suspense>
  )
})
