import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'
import React from 'react'

import { cn } from '~/utils/helper'

export const MParagraph: FC<
  DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = (props) => {
  const { children, ...other } = props
  const { className, ...rest } = other
  return (
    <p
      suppressHydrationWarning
      className={cn('paragraph', className)}
      {...rest}
    >
      {children}
    </p>
  )
}
