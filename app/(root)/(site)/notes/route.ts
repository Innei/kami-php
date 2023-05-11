import { NextResponse } from 'next/server'

export const GET = () => {
  return NextResponse.redirect('/notes/latest')
}
