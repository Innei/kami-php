import { NoteWrappedPayload } from '@mx-space/api-client'
import { Markdown } from 'components/markdown'
import { BaseLayout } from 'layouts/base'
import { apiClient } from 'utils/request'

const NotePage: SSRPage<NoteWrappedPayload> = (props) => {
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
      ? await apiClient.note.getNoteById(nid)
      : await apiClient.note.getLatest()
  return {
    ...data,
  }
}
export default NotePage
