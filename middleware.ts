import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const response = NextResponse.next()
  response.headers.set('x-url', url.toString())

  return response
}
