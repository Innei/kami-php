'use client'

import type { PropsWithChildren } from 'react'
import { useMemo, useRef } from 'react'
import type { ShortcutOptions } from 'react-shortcut-guide'
import { ShortcutProvider } from 'react-shortcut-guide'

import { ProviderComposer } from '~/components/app/provider-composer'
import { ModalStackProvider } from '~/components/ui/Modal'
import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDarkMode } from '~/hooks/ui/use-dark'
import type { InitialDataType } from '~/providers/initial-data'
import { InitialContextProvider } from '~/providers/initial-data'
import { SWRProvider } from '~/providers/swr'

const NextShortcutProvider = () => {
  const { event } = useAnalyze()
  return (
    <ShortcutProvider
      options={
        useRef<ShortcutOptions>({
          darkMode: 'class',
          darkClassName: 'html.dark',
          onGuidePanelOpen: () => {
            event({
              label: 'Guide 被打开了',
              action: TrackerAction.Interaction,
            })
          },
        }).current
      }
    />
  )
}
export const AppRootProviders = (
  props: PropsWithChildren<{ data: InitialDataType }>,
) => {
  const { data, children } = props
  const pageProviders = useMemo(
    () => [
      <SWRProvider key="SWRProvider" />,
      <InitialContextProvider value={data} key="InitialDataProvider" />,
      <ModalStackProvider key="modalProvider" />,
    ],
    [data],
  )

  useDarkMode()

  return (
    <ProviderComposer contexts={pageProviders}>
      {children}
      <NextShortcutProvider />
    </ProviderComposer>
  )
}
