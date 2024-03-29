'use client'

import type { FC } from 'react'
import { useRef } from 'react'

import { CustomLogo } from '~/components/common/Logo'

const Loader: FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className="loader" ref={ref} />
      <div className="loader-logo">
        <CustomLogo
          className="animation"
          height="150px"
          onAnimationEnd={(e) => {
            ref.current?.remove()
            ;(e.target as any)?.remove()
          }}
        />
      </div>
    </>
  )
}

export default Loader
