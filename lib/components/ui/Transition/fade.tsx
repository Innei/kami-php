'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

import type { BaseTransitionProps } from './typings'

export const FadeInOutTransitionView: FC<
  PropsWithChildren<BaseTransitionProps>
> = (props) => {
  const { timeout = {}, duration = 0.5, appear } = props
  const { enter = 0, exit = 0 } = timeout
  return (
    <AnimatePresence onExitComplete={props.onExited}>
      {props.in &&
        (appear ? (
          props.children
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: enter / 1000,
              },
              onTransitionEnd() {
                props.onEntered?.()
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: exit / 1000,
              },
            }}
            transition={{
              duration,
            }}
          >
            {props.children}
          </motion.div>
        ))}
    </AnimatePresence>
  )
}
