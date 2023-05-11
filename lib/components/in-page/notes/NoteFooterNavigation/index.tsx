import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import { memo } from 'react'
import { shallow } from 'zustand/shallow'

import { noteCollection, useNoteCollection } from '~/atoms/collections/note'
import {
  IcRoundKeyboardDoubleArrowLeft,
  IcRoundKeyboardDoubleArrowRight,
} from '~/components/icons/arrow'
import { MdiClockTimeThreeOutline } from '~/components/icons/clock'
import { Divider } from '~/components/ui/Divider'
import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDetectIsNarrowThanLaptop } from '~/hooks/ui/use-viewport'
import { springScrollToTop } from '~/utils/spring'

export const NoteFooterNavigation: FC<{ id: string }> = memo(({ id }) => {
  const [prevNid, nextNid] = useNoteCollection<
    [number | undefined, number | undefined]
  >((state) => {
    const [prev, next] = state.relationMap.get(id) || []
    return [prev?.nid, next?.nid] as [number | undefined, number | undefined]
  }, shallow)

  const router = useRouter()
  const { event } = useAnalyze()

  const goNext = (nid: number) => {
    router.push(`/notes/${nid}`)
    springScrollToTop()
  }
  return (
    <>
      {/* // 没有 0 的情况 */}
      {(!!prevNid || !!nextNid) && (
        <>
          <Divider className="!w-15 m-auto" />
          <section
            className="relative mt-4 py-2 text-center text-theme-gray-1"
            data-hide-print
          >
            <div className="flex items-center justify-between children:inline-flex children:items-center children:space-x-2 children:px-2 children:py-2">
              {!!nextNid && (
                <>
                  <div
                    tabIndex={1}
                    role="button"
                    className="hover:text-theme-primary"
                    onClick={() => {
                      goNext(nextNid)
                    }}
                  >
                    <IcRoundKeyboardDoubleArrowLeft />
                    <span>前一篇</span>
                  </div>
                </>
              )}

              {!!prevNid && (
                <>
                  <div
                    tabIndex={1}
                    role="button"
                    className="hover:text-theme-primary"
                    onClick={() => {
                      goNext(prevNid)
                    }}
                  >
                    <span>后一篇</span>
                    <IcRoundKeyboardDoubleArrowRight />
                  </div>
                </>
              )}
            </div>
            <div
              tabIndex={1}
              role="button"
              className="text-pink absolute bottom-0 left-1/2 top-0 flex -translate-x-1/2 transform items-center space-x-2 opacity-80 hover:text-theme-primary"
              onClick={() => {
                const note = noteCollection.get(id)

                event({
                  action: TrackerAction.Click,
                  label: `时间线点击 - ${note?.nid} - ${note?.title}`,
                })

                springScrollToTop()
                router.push(`/timeline?type=note&id=${id}`)
              }}
            >
              <span>时间线</span>
              <MdiClockTimeThreeOutline />
            </div>
          </section>
        </>
      )}
    </>
  )
})

export const NoteFooterNavigationBarForMobile: typeof NoteFooterNavigation = (
  props,
) => {
  const isWiderThanLaptop = useDetectIsNarrowThanLaptop()

  if (isWiderThanLaptop) {
    return <NoteFooterNavigation {...props} />
  }
  return null
}
