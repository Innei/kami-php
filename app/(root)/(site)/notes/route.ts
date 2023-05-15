import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const GET = (request: NextRequest) => {
  const url = request.nextUrl.clone()
  url.pathname = '/notes/latest'
  return NextResponse.redirect(url)
}
