import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { queryInitialData } from '~/queries/initial'

import { sample } from './_'
import { getRandomImage } from './images'

interface SeoParams {
  title: string
  description?: string
  useRandomImage?: boolean

  coverImage?: string

  created?: string
  modified?: string
  tags?: string[]

  bigImage?: boolean
}

export const createSeoMetadata = async (
  params: SeoParams,
  metadata?: Metadata,
): Promise<Metadata> => {
  const {
    aggregateData: {
      seo: { title },
      user: { avatar },
    },
    config,
  } = await queryInitialData(headers())
  const { site } = config || {}
  const { figure } = site || {}
  const randomImage = figure ? sample(figure) : getRandomImage(1)[0]
  const nextTitle = `${params.title} - ${title}`
  const images = params.coverImage
    ? [params.coverImage]
    : [params.useRandomImage ? randomImage : avatar]
  return {
    title: nextTitle,
    description: params.description,

    twitter: {
      images,
      card: params.bigImage
        ? 'summary_large_image'
        : params.coverImage
        ? 'summary_large_image'
        : 'summary',
    },
    openGraph: {
      publishedTime: params.created,
      modifiedTime: params.modified,
      tags: params.tags,
      images,
      siteName: title,
    },

    ...metadata,
  }
}
