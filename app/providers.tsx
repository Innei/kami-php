'use client'

import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'

import { ErrorBoundary } from '~/components/app/error-boundary'
import { ProviderComposer } from '~/components/app/provider-composer'
import type { InitialDataType } from '~/providers/initial-data'
import { InitialContextProvider } from '~/providers/initial-data'
import { SWRProvider } from '~/providers/swr'

export const AppRootProviders = (
  props: PropsWithChildren<{ data: InitialDataType }>,
) => {
  const { data, children } = props

  const pageProviders = useMemo(
    () => [
      <SWRProvider key="SWRProvider" />,
      <ErrorBoundary key="ErrorBoundary1" />,
      <InitialContextProvider value={data} key="InitialDataProvider" />,
      <ErrorBoundary key="ErrorBoundary2" />,
    ],
    [data],
  )

  return (
    <ProviderComposer contexts={pageProviders}>{children}</ProviderComposer>
  )
}
