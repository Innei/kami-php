/*
 * @Author: Innei
 * @Date: 2020-06-20 20:51:31
 * @LastEditTime: 2021-05-29 17:51:50
 * @LastEditors: Innei
 * @FilePath: /web/utils/utils.ts
 * @Coding with Love
 */

import loadable from '@loadable/component'
import type { ServerResponse } from 'http'
import { ComponentType } from 'react'
import RemoveMarkdown from 'remove-markdown'

export const isClientSide = () => {
  return typeof window !== 'undefined'
}
export const isServerSide = () => {
  return !isClientSide()
}

export const isDev = process.env.NODE_ENV === 'development'

export function getSummaryFromMd(text: string): string
export function getSummaryFromMd(
  text: string,
  options: { count: true; length?: number },
): { description: string; wordCount: number }

export function getSummaryFromMd(
  text: string,
  options: { count?: boolean; length?: number } = {
    count: false,
    length: 150,
  },
) {
  const rawText = RemoveMarkdown(text, { gfm: true })
  const description = rawText.slice(0, options.length).replace(/[\s]/gm, ' ')
  if (options.count) {
    return {
      description,
      wordCount: rawText.length,
    }
  }
  return description
}

export function flattenChildren<T extends { children: T[] }>(
  data: T[],
  level = 0,
): Omit<T, 'children'>[] {
  return data.reduce(
    (arr, { children = [], ...rest }) =>
      // @ts-ignore
      arr.concat([{ ...rest }], flattenChildren(children, level + 1)),
    [],
  )
}

export function _uuid() {
  let d = Date.now()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
export class UUID {
  public uuid = _uuid()

  public equal(uuid: UUID) {
    return uuid.uuid === this.uuid
  }
}

export const resolveUrl = (pathname: string | undefined, base: string) => {
  const _URL = new URL(base)

  return pathname ? _URL.origin.concat(pathname) : _URL.origin
}

export const NoSSR = <T>(comp: ComponentType<T>) =>
  loadable(() => Promise.resolve(comp), { ssr: false })

// for api server
export const writeBody = (
  res: ServerResponse,
  bodyJSON: any,
  code?: number,
) => {
  res.writeHead(code ?? 200, { 'Content-Type': 'application/json' })
  const json = JSON.stringify(bodyJSON)
  res.end(json)
}

// export function checkOldBrowser() {
//   const parser = new UAParser(window.navigator.userAgent)
//   const browser = parser.getBrowser()
//   const isOld: boolean = (() => {
//     if (browser.name === 'IE') {
//       alert(
//         '欧尼酱, 乃真的要使用 IE 浏览器吗, 不如换个 Chrome 好不好嘛（o´ﾟ□ﾟ`o）',
//       )
//       location.href = 'https://www.google.com/chrome/'
//       return true
//     }
//     // check build-in methods
//     const ObjectMethods = ['fromEntries', 'entries']
//     const ArrayMethods = ['flat']
//     if (
//       !window.Reflect ||
//       !(
//         ObjectMethods.every((m) => Reflect.has(Object, m)) &&
//         ArrayMethods.every((m) => Reflect.has(Array.prototype, m))
//       ) ||
//       !window.requestAnimationFrame ||
//       !window.Proxy ||
//       !window.IntersectionObserver ||
//       !window.ResizeObserver ||
//       !window.Intl ||
//       typeof globalThis === 'undefined' ||
//       typeof Set === 'undefined' ||
//       typeof Map === 'undefined'
//     ) {
//       return true
//     }

//     return false
//   })()
//   if (isOld) {
//     const { name: osName, version: osVersion } = parser.getOS()

//     return {
//       isOld: true,
//       msg: `User browser(${browser.name} ${browser.version}) is too old. OS: ${osName}/${osVersion}`,
//     }
//   }

//   return { isOld: false, msg: '' }
// }

export const escapeHTMLTag = (html: string) => {
  const lt = /</g,
    gt = />/g,
    ap = /'/g,
    ic = /"/g
  return html
    .toString()
    .replace(lt, '&lt;')
    .replace(gt, '&gt;')
    .replace(ap, '&#39;')
    .replace(ic, '&#34;')
}

export function sleep(t: number) {
  return new Promise((r) => setTimeout(r, t))
}

export function queryStringToObject(query: any) {
  // @ts-expect-error
  return Object.fromEntries(new URLSearchParams(query)!)
}
