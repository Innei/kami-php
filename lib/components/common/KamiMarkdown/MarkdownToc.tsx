import type { FC } from 'react'
import { useEffect } from 'react'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { withNoSSR } from '~/components/app/no-ssr'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { useModalStack } from '~/components/ui/Modal'
import type { TocProps } from '~/components/widgets/Toc'
import { Toc } from '~/components/widgets/Toc'
import { useDetectIsNarrowThanLaptop } from '~/hooks/ui/use-viewport'

export const MarkdownToc: FC<TocProps> = withNoSSR((props) => {
  const { present } = useModalStack()
  const isNarrowThanLaptop = useDetectIsNarrowThanLaptop()
  const isMobile = useAppStore((state) => state.viewport.mobile)
  useEffect(() => {
    if (!isNarrowThanLaptop || props.headings.length == 0) {
      return
    }
    const actionStore = useActionStore.getState()
    const InnerToc = () => <Toc {...props} useAsWeight />
    const id = 'toc'
    actionStore.appendActions({
      element: !isMobile ? (
        <FloatPopover
          placement="left-end"
          strategy="fixed"
          wrapperClassNames="flex flex-1"
          offset={20}
          triggerComponent={() => (
            <button aria-label="toc button">
              <i className="icon-[fluent--list-16-filled]" />
            </button>
          )}
          trigger="click"
        >
          <InnerToc />
        </FloatPopover>
      ) : undefined,
      icon: isMobile ? <i className="icon-[fluent--list-16-filled]" /> : null,
      id,
      onClick() {
        present({
          component: <InnerToc />,

          modalProps: {
            title: 'Table of Content',
            blur: false,
          },
        })
      },
    })
    return () => {
      actionStore.removeActionById(id)
    }
  }, [isNarrowThanLaptop, isMobile, present, props])
  return !isNarrowThanLaptop ? <Toc {...props} /> : null
})
