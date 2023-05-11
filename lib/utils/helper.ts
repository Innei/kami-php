export const cn = (
  ...args: (string | number | boolean | null | undefined)[]
) => {
  return args.filter(Boolean).join(' ')
}

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
export const resolveUrl = (pathname: string | undefined, base: string) => {
  return base.replace(/\/$/, '').concat(pathname || '')
}

/**
 * 2022 xxxx -> 2022
 * 月色真美！ -> 月
 */
export const textToBigCharOrWord = (name: string | undefined) => {
  if (!name) {
    return ''
  }
  const splitOnce = name.split(' ')[0]
  const bigChar = splitOnce.length > 4 ? name[0] : splitOnce
  return bigChar
}
