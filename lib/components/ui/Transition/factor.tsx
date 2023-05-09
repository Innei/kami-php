import type { Target } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

import type { BaseTransitionProps } from './typings'

interface TransitionViewParams {
  from: Target
  to: Target
  initial?: Target
}

export const createTransitionView = (
  params: TransitionViewParams,
): FC<PropsWithChildren<BaseTransitionProps>> => {
  const { from, to, initial } = params
  return (props) => {
    const { timeout = {}, duration = 0.5, appear, in: In = true } = props
    const { enter = 0, exit = 0 } = timeout
    return (
      <AnimatePresence onExitComplete={props.onExited}>
        {In && appear ? (
          props.children
        ) : (
          <motion.div
            initial={{ ...(initial || from) }}
            animate={{
              ...to,
              transition: {
                delay: enter / 1000,
              },
              onTransitionEnd() {
                props.onEntered?.()
              },
            }}
            exit={{
              ...from,
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
        )}
      </AnimatePresence>
    )
  }
}
