import { PageModel } from '@mx-space/api-client'
import { apiClient } from 'utils/request'

const PageDetail: SSRPage<{ data: PageModel }> = (props) => {
  if (!props.loaded) {
    return <span>Loading Data...</span>
  }

  return (
    <>
      <h1>About</h1>

      <article className="prose prose-base">{props.data.text}</article>
    </>
  )
}

PageDetail.loadData = async function (ctx) {
  const { page } = ctx.params as any
  const data = await apiClient.page.getBySlug(page)

  return {
    data,
  }
}

export default PageDetail
