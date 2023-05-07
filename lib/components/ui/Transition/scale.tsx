'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

import type { BaseTransitionProps } from './typings'

export const ScaleTransitionView: FC<PropsWithChildren<BaseTransitionProps>> = (
  props,
) => {
  const { duration = 0.5 } = props
  return (
    <AnimatePresence onExitComplete={props.onExited}>
      {props.in && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
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
