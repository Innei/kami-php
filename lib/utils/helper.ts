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
