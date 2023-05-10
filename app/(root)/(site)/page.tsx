import type { Metadata } from 'next'

import { omit } from '~/utils/_'
import { apiClient } from '~/utils/api-client'
import { dedupeFetch } from '~/utils/query-core'

import PageClient from './page.client'

const fetchHomePageData = () => {
  return dedupeFetch(['home-data'], async () => {
    const aggregateData = await apiClient.aggregate.getTop()

    return omit({ ...aggregateData }, ['says'])
  })
}

export async function generateMetadata(): Promise<Metadata> {
  return {}
}

const IndexView = async () => {
  const data = await fetchHomePageData()

  return (
    <main>
      <PageClient data={data} />
    </main>
  )
}

export default IndexView
