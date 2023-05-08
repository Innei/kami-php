'use client'

import { animateValue } from 'framer-motion'

export const springScrollToTop = () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop
  const animation = animateValue({
    keyframes: [scrollTop, 0],
    autoplay: true,
    type: 'spring',
    damping: 24,

    onUpdate(latest) {
      if (latest <= 0) {
        animation.stop()
      }
      window.scrollTo(0, latest)
    },
  })
}
