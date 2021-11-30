import { apiClient } from 'utils/request'
import PostPage from '../[id]'

const PostPage2 = PostPage.bind({})

PostPage2.loadData = async function ({ params, query }) {
  const { category, slug } = params as any

  const data = await apiClient.post.getPost(category, slug)

  return { data }
}

export default PostPage2
