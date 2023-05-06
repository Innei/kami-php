'use client'

import type { MessageInstance } from 'react-message-popup'

const _m = () => import('react-message-popup').then((mo) => mo.message)
export const message: MessageInstance = {
  async error(...rest) {
    const m = await _m()
    return await m.error(...rest)
  },

  async info(...rest) {
    const m = await _m()
    return await m.info(...rest)
  },
  async success(...rest) {
    const m = await _m()
    return await m.success(...rest)
  },
  async warning(...rest) {
    const m = await _m()
    return await m.warning(...rest)
  },
  async loading(...rest) {
    const m = await _m()
    return await m.loading(...rest)
  },
  get warn() {
    return this.warning
  },
}
