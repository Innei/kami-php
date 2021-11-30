import { PostModel } from '@mx-space/api-client'
import { Markdown } from 'components/markdown'
import { BaseLayout } from 'layouts/base'
import { apiClient } from 'utils/request'

export const PostPage: SSRPage<{ data: PostModel }> = (props) => {
  if (!props.loaded) {
    return <>Loading...</>
  }

  return (
    <BaseLayout>
      <article>
        <h1>{props.data.title}</h1>
        <Markdown text={props.data.text} />
      </article>
    </BaseLayout>
  )
}

PostPage.loadData = async (ctx) => {
  const id = ctx.params?.id
  if (!id) {
    return {
      redirect: '/404',
      data: null as any,
    }
  }
  const data = await apiClient.post.getPost(id)

  return { data }
}

export default PostPage
