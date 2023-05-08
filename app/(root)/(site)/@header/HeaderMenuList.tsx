import { usePathname } from 'next/navigation'
import type { FC } from 'react'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'

import { useKamiConfig } from '~/hooks/app/use-initial-data'

import { HeaderNavigationList } from './HeaderNavigationList'
import styles from './index.module.css'

export const MenuList: FC = memo(() => {
  const groupRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const kamiConfig = useKamiConfig()
  const ballIndex = useMemo(() => {
    const menu = kamiConfig.site.header.menu

    if (pathname === '' || pathname === '/') {
      const idx = menu.findIndex((item) => item.type == 'Home')

      return ~idx ? idx : -1
    }
    const firstPath = pathname.split('/')[1]

    const inMenuIndex = menu.findIndex(
      (item) =>
        item.path != '/' &&
        (pathname.startsWith(item.path) ||
          item.subMenu?.find((subItem) => pathname.startsWith(subItem.path))),
    )

    if (inMenuIndex > -1) {
      return inMenuIndex
    }
    switch (firstPath) {
      case 'category':
      case 'posts': {
        return menu.findIndex((item) => item.type == 'Post')
      }
      case 'notes': {
        return menu.findIndex((item) => item.type == 'Note')
      }
      case 'says': {
        return menu.findIndex((item) => item.path == '/says')
      }
      case 'timeline': {
        return menu.findIndex((item) => item.path.startsWith('/timeline'))
      }
      case 'friends': {
        return menu.findIndex((item) => item.path == '/friends')
      }
      case 'recently': {
        return menu.findIndex((item) => item.path.startsWith('/recently'))
      }

      default:
        return 0
    }
  }, [kamiConfig.site.header.menu, pathname])

  // NOTE: force update and re-calculating ball position, biz RSC not mount to dom at first time, will got left = 0px
  const [trigger, update] = useState(0)
  useEffect(() => {
    const timerId = setTimeout(() => {
      update((v) => v + 1)
    }, 150)

    return () => clearTimeout(timerId)
  }, [])

  const [ballOffsetLeft, setBallOffsetLeft] = useState(0)
  useEffect(() => {
    if (!groupRef.current || typeof ballIndex === 'undefined') {
      return
    }

    const $group = groupRef.current

    const $child = $group.children.item(ballIndex) as HTMLElement

    if ($child) {
      setBallOffsetLeft(
        $child.offsetLeft + $child.getBoundingClientRect().width / 2,
      )
    }
  }, [ballIndex, trigger])

  return (
    <div className={styles['link-group']} ref={groupRef}>
      <HeaderNavigationList />

      {ballOffsetLeft ? (
        <div
          className={styles['anchor-ball']}
          style={{ left: `${ballOffsetLeft}px` }}
        />
      ) : null}
    </div>
  )
})
