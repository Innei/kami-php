import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import type { FC } from 'react'

import { microReboundPreset } from '~/constants/spring'
import { cn } from '~/utils/helper'

export const Button: FC<HTMLMotionProps<'button'>> = (props) => {
  const { className, ...rest } = props
  return (
    <motion.button
      className={cn('btn', className)}
      whileTap={{
        transition: microReboundPreset,
        scale: 0.9,
      }}
      {...rest}
    >
      {props.children}
    </motion.button>
  )
}
