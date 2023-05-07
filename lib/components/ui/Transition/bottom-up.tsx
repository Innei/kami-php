'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

import type { BaseTransitionProps } from './typings'

export const BottomToUpTransitionView: FC<
  PropsWithChildren<BaseTransitionProps>
> = (props) => {
  const { duration = 0.5 } = props
  return (
    <AnimatePresence onExitComplete={props.onExited}>
      {props.in && (
        <motion.div
          initial={{ translateY: 30, opacity: 0 }}
          animate={{ translateY: 0, opacity: 1 }}
          exit={{ translateY: 30, opacity: 0 }}
          transition={{
            duration,
          }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
