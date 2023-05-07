'use client'

import { useEffect } from 'react'

export default function ErrorPage({ error }: any) {
  useEffect(() => {
    console.log('err', error)
  }, [])

  return (
    <html>
      <body>
        <div className="h-screen w-screen flex items-center justify-center">
          Error
        </div>
      </body>
    </html>
  )
}
