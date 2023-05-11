/* eslint-disable react-hooks/rules-of-hooks */
import type { MarkdownToJSX } from 'markdown-to-jsx'
import { sanitizeUrl } from 'markdown-to-jsx'
import type { FC, PropsWithChildren } from 'react'
import React, { Fragment, Suspense, memo, useMemo } from 'react'

import { isDev } from '~/utils/env'
import { springScrollToElement } from '~/utils/spring'

import { CodeBlock } from '../CodeBlock'
import type { MdProps } from '../Markdown'
import { Markdown } from '../Markdown'
import { MarkdownToc } from './MarkdownToc'
import { MHeading, MImage, MLink } from './renderers'
import { MFootNote } from './renderers/footnotes'
import { LinkCard } from './renderers/link-card'

const Noop = () => null

export interface KamiMarkdownProps extends MdProps {
  toc?: boolean
}
export const KamiMarkdown: FC<
  PropsWithChildren<KamiMarkdownProps & MarkdownToJSX.Options>
> = memo((props) => {
  const {
    value,
    renderers,

    extendsRules,

    ...rest
  } = props

  const Heading = useMemo(() => {
    return MHeading()
  }, [value, props.children])

  return (
    <Suspense>
      {' '}
      <Markdown
        tocSlot={props.toc ? MarkdownToc : Noop}
        value={value}
        overrides={{
          footer: MFootNote,

          img: MImage,
          // for custom react component
          LinkCard,
        }}
        extendsRules={{
          link: {
            react(node, output, state) {
              const { target, title } = node
              return (
                <MLink
                  href={sanitizeUrl(target)!}
                  title={title}
                  key={state?.key}
                >
                  {output(node.content, state!)}
                </MLink>
              )
            },
          },
          heading: {
            react(node, output, state) {
              return (
                <Heading id={node.id} level={node.level} key={state?.key}>
                  {output(node.content, state!)}
                </Heading>
              )
            },
          },

          footnoteReference: {
            react(node, output, state) {
              const { footnoteMap, target, content } = node
              const footnote = footnoteMap.get(content)
              const linkCardId = (() => {
                try {
                  const thisUrl = new URL(footnote?.footnote?.replace(': ', ''))
                  const isCurrentHost =
                    thisUrl.hostname === window.location.hostname

                  if (!isCurrentHost && !isDev) {
                    return undefined
                  }
                  const pathname = thisUrl.pathname
                  return pathname.slice(1)
                } catch {
                  return undefined
                }
              })()

              return (
                <Fragment key={state?.key}>
                  <a
                    href={sanitizeUrl(target)!}
                    onClick={(e) => {
                      e.preventDefault()

                      springScrollToElement(
                        document.getElementById(content)!,
                        -window.innerHeight / 2,
                      )
                    }}
                  >
                    <sup key={state?.key}>^{content}</sup>
                  </a>
                  {linkCardId && <LinkCard id={linkCardId} source="self" />}
                </Fragment>
              )
            },
          },
          codeBlock: {
            react(node, output, state) {
              return (
                <CodeBlock
                  key={state?.key}
                  content={node.content}
                  lang={node.lang}
                />
              )
            },
          },
          ...extendsRules,
          ...renderers,
        }}
        {...rest}
      >
        {props.children}
      </Markdown>
    </Suspense>
  )
})
