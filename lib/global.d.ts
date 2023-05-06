import type { FC } from 'react'
import 'react-dom/next'

import type { AggregateRoot } from '@mx-space/api-client'

import type { XLogMeta } from '~/types/xlog'

import type { KamiConfig } from './data/typings/theme'

declare global {
  export interface History {
    backPath: string[]
  }
  export interface Window {
    [key: string]: any

    data?: {
      aggregateData: AggregateRoot
      config: KamiConfig
    }

    umami?: Umami
  }

  export type IdProps = { id: string }
  export type PageOnlyProps = FC<IdProps>

  interface Umami {
    (event: string): void
    trackEvent(
      event_value: string,
      event_type: string,
      url?: string,
      website_id?: string,
    ): void

    trackView(url?: string, referrer?: string, website_id?: string): void
  }
}

declare module 'react' {
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-hide-print'?: boolean
    'aria-hidden'?: boolean
  }
}

declare module '@mx-space/api-client' {
  export interface PostMeta {
    style?: string
    cover?: string
    banner?: string | { type: string; message: string }
    xLog?: XLogMeta
  }
  interface TextBaseModel extends BaseCommentIndexModel {
    meta?: PostMeta
  }

  interface AggregateTopNote {
    meta?: PostMeta
  }

  interface AggregateTopPost {
    meta?: PostMeta
  }
}

export {}
