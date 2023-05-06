'use client'

import mergeWith from 'lodash-es/mergeWith'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useEffect, useMemo } from 'react'

import type { AggregateRoot } from '@mx-space/api-client'

import type { KamiConfig } from '~/data/typings/theme'
import { defaultConfigs } from '~/templates/configs.default'
import { cloneDeep } from '~/utils/_'

export type InitialDataType = {
  aggregateData: AggregateRoot
  config: KamiConfig
}
export const InitialContext = createContext({} as InitialDataType)

export const InitialContextProvider: FC<
  PropsWithChildren<{ value: InitialDataType }>
> = (props) => {
  const mergeThemeConfig = useMemo(() => {
    return mergeWith(
      cloneDeep(defaultConfigs),
      props.value.config,
      (old, newer) => {
        // 数组不合并
        if (Array.isArray(old)) {
          return newer
        }
      },
    ) as KamiConfig
  }, [])
  useEffect(() => {
    window.data = { ...props.value, config: mergeThemeConfig }
  }, [mergeThemeConfig, props.value])

  return (
    <InitialContext.Provider
      value={useMemo(
        () => ({ ...props.value, config: mergeThemeConfig }),
        [mergeThemeConfig, props.value],
      )}
    >
      {props.children}
    </InitialContext.Provider>
  )
}
