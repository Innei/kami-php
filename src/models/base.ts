export interface PaginationModel {
  total: number
  size: number
  currentPage: number
  totalPage: number
  hasPrevPage: boolean
  hasNextPage: boolean
}

export interface BaseModel {
  created: string
  modified: string
  id: string
}

export interface BaseCommentIndexModel extends BaseModel {
  commentsIndex?: number
}
export type ImageSizeRecord = {
  type?: string
  height?: number
  width?: number
  src: string
}
export type ImageMap = Map<
  string,
  {
    type?: string
    height?: number
    width?: number
    src?: string
    accent?: string
  }
>

export type ResponseWrapper<T> = { data: T }
