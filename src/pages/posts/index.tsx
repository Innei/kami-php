import { Pager, PostModel } from '@mx-space/api-client'
import { useRouter } from 'hooks/use-router'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from 'utils/request'

const PostListPage: FC = () => {
  const router = useRouter()
  const [pagination, setPagination] = useState<Pager | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])
  const fetch = async () => {
    const { page, year } = router.query as any
    apiClient.post.getList(page, 10, { year }).then((data) => {
      setPosts(data.data)
      setPagination(data.pagination)
    })
  }
  useEffect(() => {
    fetch()
  }, [])
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </div>
      ))}
    </div>
  )
}

export default PostListPage
