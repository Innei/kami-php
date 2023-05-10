'use client'

import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

import type { Pager, PostModel } from '@mx-space/api-client'

import { EmptyIcon } from '~/components/icons/empty'
import { PostBlock } from '~/components/in-page/posts/PostBlock'
import { Loading } from '~/components/ui/Loading'
import { BottomToUpTransitionView } from '~/components/ui/Transition/bottom-up'
import { apiClient } from '~/utils/api-client'

export default async function PostPage() {
  const [pagination, setPagination] = useState<Pager | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])

  const router = useRouter()

  const {
    query: { page: currentPage },
  } = router

  // useEffect(() => {
  //   springScrollToTop()
  // }, [currentPage])
  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.page, router.query.year])

  const fetch = async () => {
    const { page, year, size = 10 } = router.query as any,
      payload = await apiClient.post.getList(page, size, {
        year: +year || undefined,
      })
    setPagination(payload.pagination)
    setPosts(payload.data)
  }
  return (
    <article key="note">
      {posts.length > 0 ? (
        <Fragment>
          {posts.map((post, i) => {
            return (
              <BottomToUpTransitionView
                key={post.id}
                timeout={{ enter: 66 * i }}
              >
                <PostBlock
                  post={post}
                  onPinChange={() => {
                    fetch()
                  }}
                />
              </BottomToUpTransitionView>
            )
          })}
        </Fragment>
      ) : pagination ? (
        <div className="flex flex-col">
          <EmptyIcon />
          <p>站长没有写过一篇文章啦</p>
          <p>稍后来看看吧！</p>
        </div>
      ) : (
        <Loading loadingText="正在加载.." />
      )}
    </article>
  )
}
