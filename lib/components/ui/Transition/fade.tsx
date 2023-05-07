'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

import type { BaseTransitionProps } from './typings'

export const FadeInOutTransitionView: FC<
  PropsWithChildren<BaseTransitionProps>
> = (props) => {
  return (
    <AnimatePresence onExitComplete={props.onExited}>
      {props.in && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
          }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
