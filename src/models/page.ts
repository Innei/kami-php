import { BaseModel, ImageSizeRecord } from './base'

export interface PageRespDto extends BaseModel {
  data: PageModel
}

export interface PageModel {
  commentsIndex: number
  order: number
  type: string
  created: string
  modified: string
  title: string
  text: string
  slug: string
  subtitle: string
  id: string
  allowComment?: boolean
  images: ImageSizeRecord[]
}

export interface PagesPagerRespDto extends BaseModel {
  data: PageModel[]
}
