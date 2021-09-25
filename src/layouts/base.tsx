import { memo } from 'react'

export const BaseLayout = memo(({ children }) => {
  return <div className="container">{children}</div>
})
