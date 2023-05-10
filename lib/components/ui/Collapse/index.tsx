'use client'

import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

export const Collapse = ({
  isOpened,
  className,
  children,
}: React.PropsWithChildren<{ isOpened: boolean } & { className?: string }>) => {
  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <>
      <AnimatePresence initial={false}>
        {isOpened && (
          <motion.details
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            className={className}
          >
            {children}
          </motion.details>
        )}
      </AnimatePresence>
    </>
  )
}
