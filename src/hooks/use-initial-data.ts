import { SSRContext } from 'context'
import { AggregateResp } from 'models/aggregate'
import { useContext } from 'react'

export const useInitialData = () => {
  return useContext(SSRContext).initialData as AggregateResp
}
