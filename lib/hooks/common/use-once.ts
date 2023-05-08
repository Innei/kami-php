import { useEffect, useRef } from 'react'
import { useStateToRef } from 'react-shortcut-guide'

export const useOnceEffect = (
  fn: () => any,
  deps: any[],
  conditionFn: () => boolean,
) => {
  const fnRef = useStateToRef(fn)
  const onceRef = useRef(false)
  const conditionFnRef = useStateToRef(conditionFn)
  useEffect(() => {
    if (onceRef.current) return
    if (!conditionFnRef.current()) return
    const cb = fnRef.current()
    onceRef.current = true
    return cb
  }, deps)
}
