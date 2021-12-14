import { FC } from 'react'
import SimpleMarkdown from 'simple-markdown'

const mdParse = SimpleMarkdown.defaultBlockParse

interface MarkdownProps {
  text: string
}
export const Markdown: FC<MarkdownProps> = ({ text }) => {
  return (
    <article className="prose prose-base">
      {SimpleMarkdown.outputFor(
        { ...SimpleMarkdown.defaultRules },
        'react',
      )(mdParse(text))}
    </article>
  )
}
