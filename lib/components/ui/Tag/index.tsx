import { motion } from 'framer-motion'
import rc from 'randomcolor'
import type { FC, MouseEventHandler } from 'react'
import { memo, useMemo } from 'react'

import { useCurrentColorMode } from '~/hooks/ui/use-dark'

interface BigTagProps {
  tagName: string
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined
}
export const BigTag: FC<BigTagProps> = memo(({ tagName, onClick }) => {
  const colorMode = useCurrentColorMode()
  const bgColor = useMemo(
    () =>
      rc({
        format: 'hex',
        luminosity: colorMode == 'dark' ? 'dark' : 'light',
        seed: tagName,
      }),
    [colorMode, tagName],
  )

  return (
    <motion.a
      whileTap={{
        scale: 0.8,
      }}
      className="flex cursor-pointer items-center justify-center break-all rounded-full px-8 py-4 hover:text-inherit"
      style={{ background: bgColor }}
      onClick={onClick}
    >
      <i className="icon-[mdi--tag-heart-outline] mr-2 inline-block text-lg" />
      {tagName}
    </motion.a>
  )
})
