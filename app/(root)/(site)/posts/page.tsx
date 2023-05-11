import { createSeoMetadata } from '~/utils/metadata'

import PageClient from './page.client'

export const generateMetadata = async () => {
  return createSeoMetadata({
    title: '博文',
    bigImage: false,
    useRandomImage: true,
  })
}
export default () => <PageClient />
