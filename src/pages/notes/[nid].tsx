import { Markdown } from 'components/markdown'
import { BaseLayout } from 'layouts/base'
import { NoteAggregationModel } from 'models/note'
import { proxy } from 'utils/rest'

const NotePage: SSRPage<NoteAggregationModel> = (props) => {
  if (!props.loaded) {
    return <div>Loading...</div>
  }
  return (
    <BaseLayout>
      <article>
        <h1>{props.data.title}</h1>
        <Markdown text={props.data.text}></Markdown>
      </article>
    </BaseLayout>
  )
}

NotePage.loadData = async (ctx) => {
  const { nid } = ctx.params || {}

  const data =
    typeof +nid === 'number' && +nid
      ? await proxy.api.notes.nid(nid).get<NoteAggregationModel>()
      : await proxy.api.notes('latest').get<NoteAggregationModel>()
  return {
    ...data,
  }
}
export default NotePage
