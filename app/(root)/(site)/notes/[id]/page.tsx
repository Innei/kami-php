import type { Metadata } from 'next'

import { getSummaryFromMd } from '~/utils/markdown'
import { createSeoMetadata } from '~/utils/metadata'

import { fetchNote } from './fetch'
import PageClient from './page.client'

interface Props {
  params: { id: string }
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const {
    params: { id },
  } = props

  const data = await fetchNote(id)

  return createSeoMetadata({
    title: data.title,
    description: getSummaryFromMd(data.text).slice(0, 150),
    created: data.created,
    modified: data.modified || '',
    coverImage: data.meta?.cover,
    useRandomImage: false,
  })
}

export default async (props: Props) => {
  const {
    params: { id },
  } = props
  const data = await fetchNote(id)

  return <PageClient {...data} />
}
