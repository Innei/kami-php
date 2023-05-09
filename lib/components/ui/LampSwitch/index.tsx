'use client'

import { motion } from 'framer-motion'
import { memo, useRef, useState } from 'react'

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

    const [y, setY] = useState(0)
    return (
      <motion.div
        className={styles['select-container']}
        ref={containerRef}
        data-hide-print
        transition={{ type: 'inertia', velocity: 50 }}
        animate={{
          y,
          transition: {
            type: 'spring',
            velocity: 0.5,
            damping: 5,
          },
        }}
      >
        <div className={styles['select-line']}>
          <div className={styles['line']} />
        </div>
        <div className={styles['sakura-wrap']} {...props}>
          <div
            className={styles['sakura-img']}
            onClick={() => {
              event({
                action: TrackerAction.Interaction,
                label: `颜色切换`,
              })

              toggle()
              props.onToggle()

              setY(window.innerHeight / 10)

              setTimeout(() => {
                setY(0)
              }, 500)
            }}
          />
        </div>
      </motion.div>
    )
  }),
)
