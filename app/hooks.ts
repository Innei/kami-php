'use react'

import { useContext } from 'react'

import { InitialDataContext } from './providers'

export const useInitialData = () => {
  return useContext(InitialDataContext).aggregateData
}

export const useThemeConfig = () => {
  const config = useContext(InitialDataContext).themeConfig

  return config
}

export { useThemeConfig as useKamiConfig }
