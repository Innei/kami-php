import type { FC, PropsWithChildren } from 'react'
import { memo, useEffect } from 'react'

import { useAppStore } from '~/atoms/app'

import { ModalStackProvider } from '../ui/Modal'

export const DebugLayout: FC = memo((props: PropsWithChildren) => {
  useEffect(() => {
    useAppStore.getState().updateViewport()
  }, [])

  return (
    <ModalStackProvider>
      <div
        style={{
          maxWidth: '600px',
          margin: '100px auto 0',
          position: 'relative',
        }}
      >
        {props.children}
      </div>
    </ModalStackProvider>
  )
})
