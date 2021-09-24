import { useRouter } from 'hooks/use-router'
import { PaginationModel } from 'models/base'
import { PostModel } from 'models/post'
import { FC, useEffect, useState } from 'react'
import { proxy } from 'utils/rest'

const PostListPage: FC = () => {
  const router = useRouter()
  const [pagination, setPagination] = useState<PaginationModel | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])
  const fetch = async () => {
    const { page, year } = router.query as any
    const data = await proxy.api.posts.get<{
      data: PostModel[]
      pagination: PaginationModel
    }>({
      params: { page: page || 1, year },
    })

    setPagination(data.pagination)
    setPosts(data.data)
  }
  useEffect(() => {
    fetch()
  }, [])
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}

export default PostListPage
