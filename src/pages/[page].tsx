import { PageModel } from 'models/page'
import { proxy } from 'utils/rest'

const PageDetail: SSRPage<{ data: PageModel }> = (props) => {
  if (!props.loaded) {
    return <span>Loading Data...</span>
  }

  return (
    <>
      <h1>About</h1>

      <article>{props.data.text}</article>
    </>
  )
}

PageDetail.loadData = async function (ctx) {
  const { page } = ctx.params as any
  const data = await proxy.api.pages.slug(page).get<PageModel>()

  return {
    data,
  }
}

export default PageDetail
