'use client'

import Link from 'next/link'
import React from 'react'

import { useModalStack } from '~/components/ui/Modal'
import { Overlay } from '~/components/ui/Overlay'

export default function Home() {
  const [show, setShow] = React.useState(false)
  const modal = useModalStack()

  return (
    <>
      <Link href="/posts">Posts</Link>
      <button
        onClick={() => {
          modal.present({
            component: () => <span>Test</span>,
            name: 'Test',
          })
        }}
      >
        Present
      </button>
      <Overlay
        show={show}
        onClose={() => {
          console.log('close')
          setShow(false)
        }}
        blur
      >
        <Link href="/posts">Posts</Link>
        <br />
        <Link href="/posts?a=1">Posts?a=1</Link>

        <br />
        <Link href="/posts/1">Posts/1</Link>
        <br />

        <Link href="/posts?1">Posts?1</Link>
      </Overlay>
    </>
  )
}