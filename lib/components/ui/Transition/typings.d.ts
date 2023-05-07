export interface BaseTransitionProps {
  in: boolean
  onExited?: () => void
  duration?: number
}
