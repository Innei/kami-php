'use client'

import type { PropsWithChildren } from 'react'
import { createContext, useMemo } from 'react'

import type { AggregateRoot } from '@mx-space/api-client'

import { ErrorBoundary } from '~/components/app/error-boundary'
import { ProviderComposer } from '~/components/app/provider-composer'
import type { KamiConfig } from '~/data/typings/theme'
import { SWRProvider } from '~/providers/swr'

export const InitialDataContext = createContext<TInitialData>({
  aggregateData: {} as any,
  themeConfig: {} as any,
})

type TInitialData = {
  aggregateData: AggregateRoot
  themeConfig: KamiConfig
}

const InitialDataProvider = ({
  children,
  data,
}: PropsWithChildren<{
  data: TInitialData
}>) => {
  return (
    <InitialDataContext.Provider value={data}>
      {children}
    </InitialDataContext.Provider>
  )
}

export const AppRootProviders = (
  props: PropsWithChildren<{ data: TInitialData }>,
) => {
  const { data, children } = props

  const pageProviders = useMemo(
    () => [
      <SWRProvider key="SWRProvider" />,
      <ErrorBoundary key="ErrorBoundary1" />,
      <InitialDataProvider data={data} key="InitialDataProvider" />,
      <ErrorBoundary key="ErrorBoundary2" />,
    ],
    [data],
  )

  return (
    <ProviderComposer contexts={pageProviders}>{children}</ProviderComposer>
  )
}
