import { PostModel } from 'models/post'
import { proxy } from 'utils/rest'
import PostPage from '../[id]'

const PostPage2 = PostPage.bind({})

PostPage2.loadData = async function ({ params, query }) {
  const { category, slug } = params as any

  const data = await proxy.api.posts(category)(slug).get<PostModel>()

  return { data }
}

export default PostPage2
