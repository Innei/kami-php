import { useContext } from 'react'

import { InitialContext } from '~/providers/initial-data'

export const useInitialData = () => {
  return useContext(InitialContext).aggregateData
}

export const useThemeConfig = () => {
  const config = useContext(InitialContext).config

  return config
}

export { useThemeConfig as useKamiConfig }
