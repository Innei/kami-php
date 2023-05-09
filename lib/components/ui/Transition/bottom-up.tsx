'use client'

import { createTransitionView } from './factor'

export const BottomToUpTransitionView = createTransitionView({
  from: {
    translateY: 30,
  },
  to: {
    translateY: 0,
  },
})
