'use client'

import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useContext } from 'react'

import { useInitialData } from './hooks'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  console.log(useInitialData())
  return null
}
