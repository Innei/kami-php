import { usePathname, useSearchParams } from 'next/navigation'
import type { FC } from 'react'
import React, { Fragment, memo } from 'react'

import { useInitialData } from '~/hooks/app/use-initial-data'

import {
  HeaderActionButton,
  HeaderActionButtonsContainer,
  HeaderActionLikeButtonForNote,
} from './HeaderActionButton'
import { HeaderActionShareButton } from './HeaderActionShareButton'
import styles from './index.module.css'

export const HeaderActionBasedOnRouterPath: FC = memo(() => {
  const search = useSearchParams()
  const pathname = usePathname()
  const {
    seo: { title },
  } = useInitialData()

  const Comp = (() => {
    const titleComp = <div className={styles['site-info']}>{title}</div>
    // TODO case
    switch (pathname) {
      case '/notes/[id]': {
        const id = parseInt(search.get('id') as any)

        if (id && typeof id === 'number') {
          return (
            <>
              <HeaderActionButtonsContainer>
                <HeaderActionShareButton />
                <HeaderActionButton className="h-10 w-20" tabIndex={-1}>
                  <HeaderActionLikeButtonForNote id={id} />
                </HeaderActionButton>
              </HeaderActionButtonsContainer>
              <div className="flex flex-col flex-shrink-0">
                <span>{id}</span>
                {titleComp}
              </div>
            </>
          )
        }
        return null
      }

      case '/[page]': {
        return (
          <Fragment>
            <HeaderActionShareButton />
            <div className="flex flex-col flex-shrink-0">
              <span>/{search.get('page')}</span>
              {titleComp}
            </div>
          </Fragment>
        )
      }
      default: {
        return (
          <Fragment>
            <HeaderActionShareButton />
            {titleComp}
          </Fragment>
        )
      }
    }
  })()

  return <Fragment>{Comp}</Fragment>
})
