'use client'

import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { message } from 'react-message-popup'

import type { ModelWithLiked, NoteModel } from '@mx-space/api-client'

import { noteCollection, useNoteCollection } from '~/atoms/collections/note'
import type { ModelWithDeleted } from '~/atoms/collections/utils/base'
import { useIsLogged, useUserStore } from '~/atoms/user'
import { NoteFooterActionBar } from '~/components/in-page/notes/NoteActionBar'
import { NoteFooterNavigationBarForMobile } from '~/components/in-page/notes/NoteFooterNavigation'
import { NoteMarkdownRender } from '~/components/in-page/notes/NoteMarkdownRender'
import { NoteTopic } from '~/components/in-page/notes/NoteTopic'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { NoteLayout } from '~/components/layouts/NoteLayout'
import { Banner } from '~/components/ui/Banner'
import { ImageSizeMetaContext } from '~/components/ui/Image/contexts'
import { Loading } from '~/components/ui/Loading'
import { CommentLazy } from '~/components/widgets/Comment'
import { SearchFAB } from '~/components/widgets/Search'
import { SubscribeBell } from '~/components/widgets/SubscribeBell'
import { BanCopy } from '~/components/widgets/WarningOverlay/ban-copy'
import { XLogInfoForNote } from '~/components/widgets/xLogInfo'
import { XLogSummaryForNote } from '~/components/widgets/xLogSummary'
import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import {
  useSetHeaderMeta,
  useSetHeaderShare,
} from '~/hooks/app/use-header-meta'
import { useJumpToSimpleMarkdownRender } from '~/hooks/app/use-jump-to-render'
import { useNoteMusic } from '~/hooks/app/use-music'
import { useLoadSerifFont } from '~/hooks/ui/use-load-serif-font'
import { isEqualObject } from '~/utils/_'
import { isDev } from '~/utils/env'
import { imagesRecord2Map } from '~/utils/images'
import { getSummaryFromMd } from '~/utils/markdown'
import { parseDate } from '~/utils/time'

const useUpdateNote = (note: ModelWithDeleted<NoteModel>) => {
  const beforeModel = useRef<NoteModel>()
  const { event } = useAnalyze()
  useEffect(() => {
    const hideMessage = '此生活记录已被作者删除或隐藏'
    if (note?.isDeleted) {
      message.error(hideMessage)
      return
    }
    const before = beforeModel.current

    if (!before && note) {
      beforeModel.current = { ...note }
      return
    }

    if (!before || !note || isEqualObject(before, { ...note })) {
      return
    }

    if (before.id === note.id) {
      if (note.hide && !useUserStore.getState().isLogged) {
        message.error(hideMessage)
        return
      }
      message.info('生活记录已更新')

      event({
        action: TrackerAction.Interaction,
        label: `实时更新生活记录触发 - ${note.title}`,
      })

      if (isDev) {
        console.log(
          'note-change: ',
          JSON.stringify(note),
          'before: ',
          JSON.stringify(before),
        )
      }
    }
    beforeModel.current = { ...note }
    // TODO password etc.
  }, [
    note?.title,
    note?.text,
    note?.modified,
    note?.weather,
    note?.hide,
    note?.isDeleted,
    note?.topicId,
  ])
}

const NoteView: React.FC<{ id: string }> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const note = useNoteCollection((state) => state.get(props.id))!

  const router = useRouter()
  const search = useSearchParams()
  const routerId = search.get('id')

  useEffect(() => {
    if (routerId === 'latest') {
      // router.replace({
      //   pathname: `/notes/${note.nid}`,
      //   query: { ...omit(router.query, 'id' as any) },
      // })

      router.replace(`/notes/${note.nid}${search.toString()}`)
    }
  }, [note.nid, router, routerId, search])

  useEffect(() => {
    // FIXME: SSR 之后的 hydrate 没有同步数据
    if (!noteCollection.relationMap.has(props.id)) {
      noteCollection.fetchById(note.nid, undefined, { force: true })
    }
  }, [note.nid])

  useSetHeaderShare(note.title)
  useUpdateNote(note)
  useLoadSerifFont()
  useSetHeaderMeta(
    note.title,
    `生活观察日记${note.topic ? ` / ${note.topic.name}` : ''}`,
  )
  useNoteMusic(note.music)
  useJumpToSimpleMarkdownRender(note.id)

  const { title, id, text } = note
  const { wordCount } = getSummaryFromMd(text, {
    count: true,
    length: 150,
  })

  const tips = useMemo(() => {
    return `创建于 ${parseDate(note.created, 'YYYY 年 M 月 D 日 dddd')}${
      note.modified
        ? `，修改于 ${parseDate(note.modified, 'YYYY 年 M 月 D 日 dddd')}`
        : ''
    }，全文字数：${wordCount}，阅读次数：${note.count.read}，喜欢次数：${
      note.count.like
    }`
  }, [note.count.like, note.count.read, note.created, note.modified, wordCount])

  const isSecret = note.secret ? dayjs(note.secret).isAfter(new Date()) : false
  const secretDate = useMemo(() => new Date(note.secret!), [note.secret])
  const dateFormat = note.secret
    ? Intl.DateTimeFormat('zh-cn', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        year: 'numeric',
        day: 'numeric',
        month: 'long',
      }).format(secretDate)
    : ''
  useEffect(() => {
    console.log(
      'sc',
      +secretDate,
      +new Date(),
      secretDate,
      +secretDate - +new Date(),
    )

    let timer: any
    const timeout = +secretDate - +new Date()
    // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    const MAX_TIMEOUT = (2 ^ 31) - 1
    if (isSecret && timeout && timeout < MAX_TIMEOUT) {
      timer = setTimeout(() => {
        message.info('刷新以查看解锁的文章', 10e3)
      }, timeout)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate])

  const imageSizeProviderValue = useMemo(
    () => imagesRecord2Map(note.images || []),
    [note.images],
  )
  const isLogged = useIsLogged()

  return (
    <>
      <NoteLayout title={title} date={note.created} tips={tips} id={note.id}>
        {isSecret && !isLogged ? (
          <Banner type="warning" className="mt-4">
            这篇文章暂时没有公开呢，将会在 {dateFormat} 解锁，再等等哦
          </Banner>
        ) : (
          <ImageSizeMetaContext.Provider value={imageSizeProviderValue}>
            {isSecret && (
              <Banner type="info" className="mt-4">
                这是一篇非公开的文章。(将在 {dateFormat} 解锁)
              </Banner>
            )}
            <XLogSummaryForNote id={props.id} />

            <BanCopy>
              <article>
                <h1 className="sr-only">{title}</h1>
                <NoteMarkdownRender text={text} />
              </article>
            </BanCopy>
          </ImageSizeMetaContext.Provider>
        )}
        <div className="pb-8" />
        {note.topic && <NoteTopic noteId={props.id} topic={note.topic} />}

        <NoteFooterNavigationBarForMobile id={props.id} />
        <div className="pb-4" />
        <SubscribeBell defaultType="note_c" />
        <XLogInfoForNote id={props.id} />
        <NoteFooterActionBar id={props.id} />
      </NoteLayout>
      {!isSecret && (
        <ArticleLayout
          className="!min-h-[unset] !pt-0"
          key={`comments-${props.id}`}
        >
          <CommentLazy
            id={id}
            key={id}
            allowComment={note.allowComment ?? true}
          />
        </ArticleLayout>
      )}

      <SearchFAB />
    </>
  )
}

export default (props: ModelWithLiked<NoteModel>) => {
  const { id } = props
  const noteId = useNoteCollection((state) => state.data.get(id)?.id)

  if (!noteId) {
    useNoteCollection.getState().add(props)
    return <Loading />
  }

  return <NoteView id={id} />
}
