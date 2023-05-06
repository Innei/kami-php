'use server'

import type {
  FetchQueryOptions,
  QueryFunction,
  QueryKey,
} from '@tanstack/query-core'
import { QueryCache, QueryClient } from '@tanstack/query-core'

const queryCache = new QueryCache()
const queryClient = new QueryClient({
  queryCache,
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
  try {
    return await queryClient.fetchQuery({
      queryKey,
      queryFn,
      ...options,
    })
  } catch (error) {
    // TODO
    console.error('query fetch error', error)
    throw error
  }
}
