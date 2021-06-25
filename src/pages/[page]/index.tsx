import { ArticleLayout } from 'layouts/ArticleLayout'
import { PageModel } from 'store/store.types'
import { RESTManager } from 'utils'
import { observer } from 'utils/mobx'
import { Markdown } from 'components/Markdown'
export const PageView: SSRPage<{ data: PageModel }> = observer((props) => {
  if (!props.loaded) {
    return null
  }

  const { text, id, title, subtitle } = props.data
  return (
    <ArticleLayout
      title={title}
      subtitle={subtitle}
      id={props.data.id}
      type="page"
    >
      <Markdown value={text} escapeHtml={false} toc />
    </ArticleLayout>
  )
})

PageView.loadData = async (ctx) => {
  const page = ctx.params?.page as string

  const data = (await RESTManager.api.pages.slug(page).get()) as PageModel

  return { data }
}
