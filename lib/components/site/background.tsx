'use client'

import { useThemeBackground } from '~/hooks/app/use-kami'

export const SiteBackground = () => {
  useThemeBackground()
  return (
    <div className="pointer-events-none fixed inset-0 transform-gpu bg-fixed transition-opacity duration-500">
      <div className="bg absolute inset-0" />
    </div>
  )
}
