'use client'

import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useMemo, useState } from 'react'

import type { Pager, PostModel } from '@mx-space/api-client'

import { EmptyIcon } from '~/components/icons/empty'
import { PostBlock } from '~/components/in-page/posts/PostBlock'
import { TagFAB } from '~/components/in-page/posts/SpecialButton/tag-fab'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { Loading } from '~/components/ui/Loading'
import { BottomToUpTransitionView } from '~/components/ui/Transition/bottom-up'
import { SearchFAB } from '~/components/widgets/Search'
import { apiClient } from '~/utils/api-client'
import { springScrollToTop } from '~/utils/spring'

export default function PostPage() {
  const [pagination, setPagination] = useState<Pager | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])

  const search = useSearchParams()

  const query = useMemo(
    () =>
      Array.from(search.entries()).reduce((acc, cur) => {
        return { ...acc, [cur[0]]: cur[1] }
      }, {}) as any,
    [search],
  )

  const fetch = async () => {
    const { page, year, size = 10 } = query as any,
      payload = await apiClient.post.getList(page, size, {
        year: +year || undefined,
      })
    setPagination(payload.pagination)
    setPosts(payload.data)
  }

  const currentPage = search.get('page') || 1
  useEffect(() => {
    springScrollToTop()
  }, [currentPage])
  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.year])

  const router = useRouter()

  return (
    <ArticleLayout>
      <article>
        {posts.length > 0 ? (
          <Fragment>
            {posts.map((post, i) => {
              return (
                <BottomToUpTransitionView
                  key={post.id}
                  timeout={{ enter: 100 * i }}
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

      {pagination && (
        <section className="mt-4 flex justify-between">
          {pagination.hasPrevPage ? (
            <PaginationButton
              onClick={() => {
                router.push(`/posts?page=${pagination.currentPage - 1}`)
              }}
            >
              上一页
            </PaginationButton>
          ) : (
            <div />
          )}
          {pagination.hasNextPage && (
            <PaginationButton
              onClick={() => {
                router.push(`/posts?page=${pagination.currentPage + 1}`)
              }}
            >
              下一页
            </PaginationButton>
          )}
        </section>
      )}
      <TagFAB />
      <SearchFAB />
    </ArticleLayout>
  )
}

const PaginationButton = (props: { onClick: () => void; children: string }) => {
  const { onClick, children: text } = props
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="btn !rounded-md !border-[2px] !border-theme-accent !bg-transparent !text-theme-accent"
      onClick={onClick}
    >
      {text}
    </motion.button>
  )
}
