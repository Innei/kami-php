import { motion } from 'framer-motion'
import type { FC } from 'react'
import React from 'react'

export const TextUpTransitionView: FC<
  {
    text?: string
    children?: string

    delay?: number
    appear?: boolean
  } & JSX.IntrinsicElements['div']
> = (props) => {
  const { appear = true, delay = 100, children, text, ...rest } = props

  if (!appear) {
    return <div {...rest}>{text ?? children}</div>
  }
  return (
    <div {...rest}>
      {Array.from(text ?? (children as string)).map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ translateY: '10px', opacity: 0 }}
          animate={{
            type: 'spring',
            translateY: '0px',
            opacity: 1,
            transition: {
              // TODO
              delay: i * delay,
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}
