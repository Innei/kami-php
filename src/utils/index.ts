export function queryStringToObject(query: any) {
  // @ts-expect-error
  return Object.fromEntries(new URLSearchParams(query)!)
}
