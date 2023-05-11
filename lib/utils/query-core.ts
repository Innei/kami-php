'use server'

import { headers as NextHeaders } from 'next/headers'
import { userAgent } from 'next/server'

import type {
  FetchQueryOptions,
  QueryFunction,
  QueryKey,
} from '@tanstack/query-core'
import { QueryCache, QueryClient } from '@tanstack/query-core'

import PKG from '~/../package.json'

import { $axios } from './api-client'

const queryCache = new QueryCache()
const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: 10_000,
    },
  },
})

export const dedupeFetch = async <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): Promise<TData> => {
  const headers = NextHeaders()
  const wrapQueryFn = async (...rest) => {
    const userAgentObject = userAgent({
      headers,
    })

    let ip =
      headers.get('x-forwarded-for') ||
      headers.get('X-Forwarded-For') ||
      headers.get('X-Real-IP') ||
      headers.get('x-real-ip') ||
      undefined
    if (ip && ip.split(',').length > 0) {
      ip = ip.split(',')[0]
    }
    ip && ($axios.defaults.headers.common['x-forwarded-for'] = ip as string)

    $axios.defaults.headers.common[
      'User-Agent'
    ] = `${userAgentObject.ua} NextJS/v${PKG.dependencies.next} Kami/${PKG.version}`

    // @ts-ignore
    return await queryFn.call(null, ...rest)
  }

  try {
    return await queryClient.fetchQuery({
      queryKey,
      queryFn: wrapQueryFn,
      ...options,
    })
  } catch (error) {
    // TODO
    console.error('query fetch error')
    throw error
  }
}
