import { SSRContext } from 'context'
import { AggregateModel } from 'models/aggregate'
import { useContext } from 'react'

export const useInitialData = () => {
  return useContext(SSRContext).initialData as { data: AggregateModel }
}
