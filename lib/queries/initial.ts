'use server'

import { FetchInitialDataError } from '~/constants/error'
import { fetchThemeConfig } from '~/data/theme-config'
import { apiClient } from '~/utils/api-client'
import { dedupeFetch } from '~/utils/query-core'

export const queryInitialData = async () => {
  return await dedupeFetch(['initial'], async () => {
    const [aggregateDataSettled, themeConfigSettled] = await Promise.allSettled(
      [
        apiClient.aggregate.getAggregateData().then((data) => ({ ...data })),
        fetchThemeConfig(),
      ],
    )

    if (aggregateDataSettled.status === 'rejected') {
      throw new FetchInitialDataError(
        JSON.stringify({
          message: '初始数据加载出错，检查服务端是否正常',
          type: 'aggregate',
        }),
        'aggregate',
      )
    }

    if (themeConfigSettled.status === 'rejected') {
      throw new FetchInitialDataError(
        JSON.stringify({
          message: '主题配置加载出错，检查服务端是否正常',
          type: 'config',
        }),
        'config',
      )
    }
    const [aggregateData, themeConfig] = [
      aggregateDataSettled.value,
      themeConfigSettled.value,
    ]
    return {
      aggregateData,
      config: themeConfig,
    }
  })
}
