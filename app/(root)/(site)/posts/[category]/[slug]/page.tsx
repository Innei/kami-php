import type { Metadata } from 'next'

import { usePostCollection } from '~/atoms/collections/post'
import { getSummaryFromMd } from '~/utils/markdown'
import { createSeoMetadata } from '~/utils/metadata'
import { dedupeFetch } from '~/utils/query-core'

import PageClient from './page.client'

interface Props {
  params: {
    category: string
    slug: string
  }
}

const fetchPostBySlug = (category: string, slug: string) => {
  return dedupeFetch(['posts', category, slug], () =>
    usePostCollection.getState().fetchBySlug(category, slug),
  )
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const {
    params: { category, slug },
  } = props
  const data = await fetchPostBySlug(category, slug)

  return createSeoMetadata({
    title: data.title,
    description: data.summary ?? getSummaryFromMd(data.text).slice(0, 150),
    created: data.created,
    modified: data.modified || '',
    coverImage: data.meta?.cover,
    useRandomImage: false,
    tags: data.tags,
  })
}

export default async function ({ params: { category, slug } }: Props) {
  const data = await fetchPostBySlug(category, slug)

  return <PageClient {...data} />
}
