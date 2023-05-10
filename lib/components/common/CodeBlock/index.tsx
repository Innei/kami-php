import { HighLighter } from '../CodeHighlighter'
import { Mermaid } from '../Mermaid'

export const CodeBlock = (props: {
  lang: string | undefined
  content: string
}) => {
  if (props.lang === 'mermaid') {
    return <Mermaid {...props} />
  } else {
    return <HighLighter {...props} />
  }
}
