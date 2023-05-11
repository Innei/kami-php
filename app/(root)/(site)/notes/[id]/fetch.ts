import { useNoteCollection } from '~/atoms/collections/note'
import { dedupeFetch } from '~/utils/query-core'

// password validation 403
export const fetchNote = (nid: string | number) => {
  return dedupeFetch(['notes', nid], () => {
    if (nid === 'latest') return useNoteCollection.getState().fetchLatest()
    return useNoteCollection.getState().fetchById(+nid)
  })
}
