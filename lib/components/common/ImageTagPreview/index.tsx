import type { FC } from 'react'

import { IonSearch } from '~/components/icons/search'
import { FloatPopover } from '~/components/ui/FloatPopover'

export const ImageTagPreview: FC<{ src: string; alt: string }> = (props) => {
  const { src, alt } = props
  return (
    <FloatPopover
      wrapperClassNames="inline"
      triggerComponent={() => (
        <a
          href={src}
          target="_blank"
          className="space-x-1 align-middle text-theme-primary"
        >
          <IonSearch className="relative top-[-2px] !inline !align-middle" />
          <span className="leading-[14px]">查看图片</span>
        </a>
      )}
    >
      <img
        className="max-h-[50vh] max-w-[500px] phone:max-w-[90vw] "
        src={src}
        alt={alt}
      />
    </FloatPopover>
  )
}
