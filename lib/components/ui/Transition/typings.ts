import type { Inertia, Keyframes, Spring, Tween } from 'framer-motion'

export interface BaseTransitionProps {
  in?: boolean
  onExited?: () => void
  duration?: number
  onEntered?: () => void
  appear?: boolean
  timeout?: {
    exit?: number
    enter?: number
  }

  animation?: {
    enter?: Tween | Spring | Keyframes | Inertia
    exit?: Tween | Spring | Keyframes | Inertia
  }
}
