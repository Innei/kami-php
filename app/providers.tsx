'use client'

import { PropsWithChildren, createContext } from 'react'

import { AggregateRoot } from '@mx-space/api-client'

import { KamiConfig } from '~/data/typings/theme'

export const InitialDataContext = createContext<TInitialData>({
  aggregateData: {} as any,
  themeConfig: {} as any,
})

type TInitialData = {
  aggregateData: AggregateRoot
  themeConfig: KamiConfig
}

export const InitialDataProvider = ({
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
