'use client'

import { useThemeBackground } from '~/hooks/app/use-kami'

export const SiteBackground = () => {
  useThemeBackground()
  return (
    <div className="inset-0 fixed bg-fixed pointer-events-none transition-opacity duration-500 transform-gpu">
      <div className="bg absolute inset-0" />
    </div>
  )
}
