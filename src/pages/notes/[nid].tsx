import { Markdown } from 'components/markdown'
import { NoteAggregationModel } from 'models/note'
import { proxy } from 'utils/rest'

const NotePage: SSRPage<NoteAggregationModel> = (props) => {
  if (!props.loaded) {
    return <div>Loading...</div>
  }
  return (
    <article>
      <h1>{props.data.title}</h1>
      <Markdown text={props.data.text}></Markdown>
    </article>
  )
}

NotePage.loadData = async (ctx) => {
  const { nid } = ctx.params || {}
  const data = await proxy.api.notes(nid).get<NoteAggregationModel>()
  return {
    ...data,
  }
}
export default NotePage
