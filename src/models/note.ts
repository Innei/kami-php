import { BaseModel, ImageSizeRecord } from './base'
export interface CountRecord {
  read: number
  like: number
}
export interface NoteModel extends BaseModel {
  commentsIndex: number
  allowComment?: boolean
  secret?: Date | null | undefined
  hide: boolean
  count: CountRecord
  title: string
  text: string
  mood?: string
  weather?: string
  hasMemory?: boolean
  nid: number
  id: string
  images: ImageSizeRecord[]
  music?: NoteMusicRecord[]
}

export interface NoteMusicRecord {
  type: string
  id: string
}
export interface NoteLastestModel {
  data: NoteModel
  next: { id: string; nid: number }
}

export interface NoteAggregationModel {
  data: NoteModel
  prev: Partial<NoteModel>
  next: Partial<NoteModel>
}
