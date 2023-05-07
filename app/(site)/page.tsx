'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Link href="/posts">Posts</Link>
      <br />
      <Link href="/posts?a=1">Posts?a=1</Link>

      <br />
      <Link href="/posts/1">Posts/1</Link>
      <br />

      <Link href="/posts?1">Posts?1</Link>
    </>
  )
}
