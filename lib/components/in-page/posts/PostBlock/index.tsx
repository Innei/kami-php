import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import removeMd from 'remove-markdown'

import type { PostModel } from '@mx-space/api-client'

import { useAppStore } from '~/atoms/app'
import { useIsLogged } from '~/atoms/user'
import { IconTransition } from '~/components/ui/Transition/icon-switch'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { apiClient } from '~/utils/api-client'
import { cn } from '~/utils/helper'
import { springScrollToTop } from '~/utils/spring'
import { parseDate } from '~/utils/time'

import styles from './index.module.css'

interface PostBlockProps {
  post: PostModel
  onPinChange: () => any
}

export const PostBlock: FC<PostBlockProps> = (props) => {
  const isMobile = useAppStore((state) => state.viewport.mobile)
  const isLogged = useIsLogged()

  const post = props.post

  const { created: date, title, slug, pin, text, id } = post

  const parsedTime = isMobile
    ? parseDate(date, 'MM-DD ddd')
    : parseDate(date, 'YYYY-MM-DD ddd')
  const [d, week] = parsedTime.split(' ')
  const initialData = useInitialData()
  const categoryMap = useMemo(() => {
    const categories = initialData.categories

    const map = new Map()

    categories.map((category) => {
      map.set(category.id, category.slug)
    })
    return map
  }, [initialData.categories])

  const router = useRouter()

  const postLink = useMemo(() => {
    const categorySlug = post.category?.slug ?? categoryMap.get(post.categoryId)
    return `/posts/${categorySlug}/${slug}`
  }, [])
  const goToPost = useCallback(() => {
    router.push(postLink)
    springScrollToTop()
  }, [postLink, router])

  const hasImage = post.images?.length > 0 && post.images[0].src

  const [pinState, setPinState] = useState(!!pin)

  const handlePin = async () => {
    await apiClient.post.proxy(id).patch({
      data: {
        pin: !pinState,
      },
    })
    setPinState(!pinState)
    props.onPinChange()
  }

  const pinEl = (
    <div
      className={cn(
        'absolute bottom-0 right-0 top-0 hidden h-5 w-5 items-center overflow-hidden',
        isLogged && '!inline-flex cursor-pointer',
        !isLogged && pinState && 'pointer-events-none',
        pinState && 'text-red !inline-flex',
      )}
      role="button"
      onClick={handlePin}
    >
      <i className="absolute h-full w-full">
        <IconTransition
          currentState={pinState ? 'solid' : 'regular'}
          regularIcon={<i className="icon-[ph--push-pin]" />}
          solidIcon={<i className="icon-[ph--push-pin-fill]" />}
        />
      </i>
    </div>
  )

  const tilteEl = (
    <>
      <div className={styles.title} onClick={goToPost}>
        {title}
      </div>
    </>
  )
  return (
    <>
      <h1 className={cn(styles.head, 'headline', isMobile && '!mb-0')}>
        <div
          className={cn('inline w-[calc(100%-1rem)]', !isMobile && 'relative')}
        >
          {d}
          <small className="text-theme-gray-2">（{week}）</small>
          {isMobile && pinEl}
        </div>
        {!isMobile && (
          <>
            {tilteEl} {pinEl}
          </>
        )}
      </h1>
      <div className={styles.text}>
        {isMobile && <div className="my-2 text-lg font-medium">{tilteEl}</div>}
        {post.summary && (
          <p className="mb-2 text-sm leading-6 text-theme-gray-1">
            摘要：{post.summary}
          </p>
        )}
        <article
          className={cn(
            styles['content'],
            hasImage ? styles['has-image'] : null,
          )}
        >
          {hasImage && (
            <div
              className={styles['post-image-preview']}
              style={{ backgroundImage: `url(${hasImage})` }}
            />
          )}

          <p>
            {useMemo(() => {
              const r = removeMd(text)
              return r.length >= 250 ? `${r.slice(0, 250)}..` : r
            }, [text])}
          </p>
          <div className="mb-10" />
        </article>
        <div className="mt-3 flex justify-end">
          <Link
            href={postLink}
            className="inline-flex items-center text-theme-accent hover:text-theme-accent [&>i]:hover:ml-2"
            onClick={(e) => {
              e.preventDefault()

              goToPost()
            }}
          >
            阅读全文{' '}
            <i className="icon-[material-symbols--arrow-right-alt-rounded] text-lg transition-[margin]" />
          </Link>
        </div>
      </div>
      <div className="mb-4 pb-8" />
    </>
  )
}
