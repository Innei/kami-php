import { apiClient } from '~/utils/api-client'

import { KamiConfig } from './typings/theme'

export const fetchThemeConfig = async () => {
  'use server'
  return apiClient.snippet
    .getByReferenceAndName<KamiConfig>(
      'theme',
      process.env.NEXT_PUBLIC_SNIPPET_NAME || 'kami',
    )
    .then((data) => ({ ...data }))
}
