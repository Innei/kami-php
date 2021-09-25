import { Markdown } from 'components/markdown'
import { BaseLayout } from 'layouts/base'
import { PostModel } from 'models/post'
import { proxy } from 'utils/rest'

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
  const data = await proxy.api.posts(id).get<PostModel>()
  return { data }
}

export default PostPage
