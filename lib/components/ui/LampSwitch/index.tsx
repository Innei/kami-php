'use client'

import { motion } from 'framer-motion'
import { memo, useRef } from 'react'

import { withNoSSR } from '~/components/app/no-ssr'
import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDarkModeSwitch } from '~/hooks/ui/use-dark'

import styles from './index.module.css'

export const LampSwitch = withNoSSR(
  memo<{ onToggle: () => void }>((props) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const { event } = useAnalyze()
    const toggle = useDarkModeSwitch()

    return (
      <motion.div
        className={styles['select-container']}
        ref={containerRef}
        data-hide-print
        whileTap={{
          transition: {
            type: 'spring',
            velocity: 0.5,
            damping: 5,
          },
          y: window.innerHeight / 10,
        }}
        onTap={() => {
          event({
            action: TrackerAction.Interaction,
            label: `颜色切换`,
          })

          toggle()
          props.onToggle()
        }}
      >
        <div className={styles['select-line']}>
          <div className={styles['line']} />
        </div>
        <div className={styles['lamp-wrap']} {...props}>
          <div className={styles['lamp-handle']} />
        </div>
      </motion.div>
    )
  }),
)
