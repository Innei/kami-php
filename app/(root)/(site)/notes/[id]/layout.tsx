import type { PropsWithChildren } from 'react'

// @see https://github.com/vercel/next.js/issues/49553
export default async (props: PropsWithChildren<{ params: { id } }>) => {
  // const note = await fetchNote(props.params.id)
  // const { wordCount } = getSummaryFromMd(note.text, {
  //   count: true,
  //   length: 150,
  // })

  // const tips = `创建于 ${parseDate(note.created, 'YYYY 年 M 月 D 日 dddd')}${
  //   note.modified
  //     ? `，修改于 ${parseDate(note.modified, 'YYYY 年 M 月 D 日 dddd')}`
  //     : ''
  // }，全文字数：${wordCount}，阅读次数：${note.count.read}，喜欢次数：${
  //   note.count.like
  // }`

  return (
    <>{props.children}</>
    // <NoteLayout title={note.title} date={note.created} tips={tips} id={note.id}>
    // </NoteLayout>
  )
}
