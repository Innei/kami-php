import { PageModel } from 'store/store.types'
import { RESTManager } from 'utils'

export const PageView: SSRPage<{ data: PageModel }> = (props) => {
  if (!props.loaded) {
    return null
  }
  console.log(props.data)

  return <>{JSON.stringify(props.data)}</>
}

PageView.loadData = async (ctx) => {
  const page = ctx.params?.page as string

  const data = (await RESTManager.api.pages.slug(page).get()) as PageModel

  return { data }
}
