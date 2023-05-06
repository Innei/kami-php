import { DynamicHeadMeta } from '~/components/for-layout/head'
import { Effect } from './effect'

export default async function SiteLayout() {
  return (
    <>
      <DynamicHeadMeta />
      <Effect />
    </>
  )
}
