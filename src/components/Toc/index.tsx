/*
 * @Author: Innei
 * @Date: 2020-06-12 21:41:12
 * @LastEditTime: 2021-01-10 11:03:04
 * @LastEditors: Innei
 * @FilePath: /web/components/Toc/index.tsx
 * @Coding with Love
 */

import classNames from 'clsx'
import isNull from 'lodash/isNull'
import range from 'lodash/range'
import throttle from 'lodash/throttle'
import dynamic from '@loadable/component'

import QueueAnim from 'rc-queue-anim'
import {
  FC,
  memo,
  PureComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import observable from 'utils/observable'
import styles from './index.module.css'
import { useRouter } from 'hooks/use-router'
declare const window: Window & typeof globalThis & { [key: string]: any }

class Item extends PureComponent<{
  title: string
  depth: number
  active: boolean
  rootDepth: number
  onClick: (i: number) => void
  index: number
}> {
  // componentDidUpdate() {}
  render() {
    const { index, active, depth, title, rootDepth, onClick } = this.props

    return (
      <a
        data-scroll
        href={'#' + title}
        data-index={depth}
        className={classNames(styles['toc-link'], active && styles['active'])}
        style={{
          paddingLeft:
            depth > rootDepth ? `${1.2 * depth - rootDepth}rem` : undefined,
        }}
        data-depth={depth}
        onClick={(e) => {
          onClick(index)
          if (typeof window.SmoothScroll === 'undefined') {
            e.preventDefault()
            const el = document.getElementById(title)
            el?.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        <span className={styles['a-pointer']}>{title}</span>
      </a>
    )
  }
}

const _Toc: FC = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [index, setIndex] = useState(-1)
  useEffect(() => {
    const handler = (index: number) => {
      setIndex(index)
    }
    observable.on('toc', handler)
    return () => {
      observable.off('toc', handler)
    }
  }, [])

  const [headings, setHeadings] = useState<
    | null
    | {
        title: string
        depth: number
      }[]
  >([])

  const [rootDepth, setDepth] = useState(Infinity)
  const setMaxWidth = throttle(() => {
    if (containerRef.current) {
      containerRef.current.style.maxWidth =
        document.documentElement.getBoundingClientRect().width -
        containerRef.current.getBoundingClientRect().x -
        30 +
        'px'
    }
  }, 14)
  const getHeadings = throttle(() => {
    const $write = document.getElementById('write')
    if (!$write) {
      return getHeadings()
    }
    setMaxWidth()

    const $headings = range(1, 6).map((h) =>
      Array.from($write.querySelectorAll('h' + h)),
    ) as HTMLHeadingElement[][]
    if (isNull(headings)) {
      return
    }
    if (headings.length === 0) {
      let _rootDepth = rootDepth
      // @ts-ignore
      const headings = $headings
        .flat<HTMLHeadingElement>(2)
        .sort((a, b) => {
          return (
            parseInt(a.dataset['idTitle'] as any) -
            parseInt(b.dataset['idTitle'] as any)
          )
        })
        .map((d: HTMLHeadingElement) => {
          const depth = ~~d.tagName.toLowerCase().slice(1)
          if (depth < _rootDepth) {
            _rootDepth = depth
          }
          const title =
            (d.children.length == 0
              ? d.textContent
              : d.children.item(0)!.textContent) ?? ''
          return {
            title: title,
            depth,
            // isActive: false,
            // @ts-ignore
            // top: ~~d.dataset['offset'] as number,
          }
        })

      setDepth(_rootDepth)
      setHeadings(headings.length === 0 ? null : headings)
    }
  }, 20)

  const router = useRouter()
  const { pathname } = router
  useEffect(() => {
    window.addEventListener('resize', setMaxWidth)
    getHeadings()
    return () => {
      window.removeEventListener('resize', setMaxWidth)
    }
  }, [setMaxWidth])

  useEffect(() => {
    setHeadings(null)
    setTimeout(() => {
      getHeadings()
    }, 1000)
  }, [pathname])

  const handleItemClick = useCallback((i) => {
    setTimeout(() => {
      setIndex(i)
    }, 350)
  }, [])

  return (
    <section
      className={classNames('kami-toc', styles['toc'])}
      style={{ zIndex: 3 }}
    >
      <div
        className={classNames('container', styles['container'])}
        ref={containerRef}
      >
        <QueueAnim className={styles['anime-wrapper']}>
          {headings &&
            headings.map((heading, i) => {
              return (
                <Item
                  index={i}
                  onClick={handleItemClick}
                  active={i === index}
                  depth={heading.depth}
                  title={heading.title}
                  key={heading.title}
                  rootDepth={rootDepth}
                />
              )
            })}
        </QueueAnim>
      </div>
    </section>
  )
})

const Toc = dynamic(() => Promise.resolve(_Toc), {
  ssr: false,
})

export default Toc
