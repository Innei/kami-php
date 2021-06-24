import { BaseModel, PagerModel, BaseModel } from './base'

export interface SayModel extends BaseModel {
  text: string
  source?: string
  author?: string
}
export interface SayRespDto extends BaseModel {
  data: SayModel[]
  page: PagerModel
}
