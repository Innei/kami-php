import type { FC } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import { useStateToRef } from 'react-shortcut-guide'

import type { AggregateTop } from '@mx-space/api-client'

import { withNoSSR } from '~/components/app/no-ssr'
import { IcTwotoneSignpost } from '~/components/icons/menu-collection'
import type { HomePageSectionName } from '~/data/typings/theme'
import { useKamiConfig } from '~/hooks/app/use-initial-data'
import { useRandomImage } from '~/hooks/app/use-kami'

import type { SectionNewsProps } from './SectionNews'
import SectionNews from './SectionNews'
import { FriendsSection } from './SectionNews/friend-section'
import { MoreSection } from './SectionNews/more-section'
import { useHomePageViewContext } from './context'
import styles from './section.module.css'

const SectionsInternal: FC<Omit<AggregateTop, 'says'>> = ({ notes, posts }) => {
  const notesRef = useStateToRef(notes)
  const postsRef = useStateToRef(posts)

  const randomImages = useRandomImage('all')
  const currentImageIndex = useRef(0)
  const getRandomUnRepeatImage = useCallback(
    () => randomImages[currentImageIndex.current++ % randomImages.length],
    [randomImages],
  )

  const {
    page: { home: homePageConfig },
  } = useKamiConfig()
  const { sections: sectionShouldUsedList, titleMapping } = homePageConfig
  const sectionSet = useMemo(
    () => new Set(sectionShouldUsedList),
    [sectionShouldUsedList],
  )

  const sections = useMemo(() => {
    const result = {} as Record<'postSection' | 'noteSection', SectionNewsProps>
    if (sectionSet.has('post')) {
      const posts = postsRef.current
      result.postSection = {
        title: titleMapping.post || '文章',
        icon: <IcTwotoneSignpost />,
        moreUrl: 'posts',

        content: posts.slice(0, 4).map(($) => {
          return {
            title: $.title,
            background:
              $.meta?.cover ?? $.images?.[0]?.src ?? getRandomUnRepeatImage(),
            id: $.id,
            ...buildRoute('Post', $),
          }
        }),
      }
    }
    if (sectionSet.has('note')) {
      const notes = notesRef.current
      result.noteSection = {
        title: titleMapping.note || '日记',
        icon: <i className="icon-[mdi--draw-pen]" />,
        moreUrl: 'notes',
        content: notes.slice(0, 4).map(($) => {
          return {
            title: $.title,
            background:
              $.meta?.cover ?? $.images?.[0]?.src ?? getRandomUnRepeatImage(),
            id: $.id,
            ...buildRoute('Note', $),
          }
        }),
      }
    }

    return result
  }, [sectionSet, titleMapping.note, titleMapping.post])

  const { doAnimation } = useHomePageViewContext()

  const sectionMap: Record<HomePageSectionName, JSX.Element | null> = {
    post: sections.postSection ? (
      <SectionNews {...sections.postSection} key="1" />
    ) : null,
    note: sections.noteSection ? (
      <SectionNews {...sections.noteSection} key="2" />
    ) : null,
    friend: sectionSet.has('friend') ? (
      <FriendsSection key="3" title={titleMapping.friend || '朋友们'} />
    ) : null,
    more: sectionSet.has('more') ? (
      <MoreSection
        getRandomUnRepeatImage={getRandomUnRepeatImage}
        title={titleMapping.more || '了解更多'}
        key="4"
      />
    ) : null,
  }
  const SectionElementList: (JSX.Element | null)[] = sectionShouldUsedList.map(
    (currentSectionName) => {
      return sectionMap[currentSectionName]
    },
  )

  return (
    <section className={styles['root']}>
      {/* TODO */}
      {/* <TransitionGroup appear={doAnimation}>
        {SectionElementList.map((El, i) => {
          return (
            <BottomUpTransitionView timeout={{ enter: 1200 + 200 * i }} key={i}>
              {El}
            </BottomUpTransitionView>
          )
        })}
      </TransitionGroup> */}
    </section>
  )
}

export const HomeSections = withNoSSR(SectionsInternal)

function buildRoute<T extends { id: string } & { nid?: number }>(
  type: keyof typeof ContentType,
  obj: T,
): { as: string; href: string } {
  switch (type) {
    case 'Post': {
      const { slug, category } = obj as any
      return {
        as: `/posts/${category.slug}/${slug}`,
        href: `/posts/[category]/[slug]`,
      }
    }
    case 'Note': {
      const { nid } = obj
      return {
        as: `/notes/${nid}`,
        href: `/notes/[id]`,
      }
    }
    case 'Say': {
      return { as: `/says`, href: `/says` }
    }
    // case 'Project': {
    //   const { id } = obj
    //   return { as: `/projects/${id}`, href: `/projects/[id]` }
    // }
  }
}

enum ContentType {
  Note,
  Post,
  Say,
  // Project,
}
