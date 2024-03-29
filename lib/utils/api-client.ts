import type { AxiosError, AxiosInstance } from 'axios'
import { CanceledError } from 'axios'

import { allControllers, createClient } from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/dist/adaptors/axios'

import { API_URL } from '~/constants/env'

import { getToken } from './cookie'
import { isClientSide } from './env'
import { message } from './message'

const genUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const apiClient = createClient(axiosAdaptor)(API_URL, {
  controllers: allControllers,
})

const uuid = genUUID()

export const $axios = axiosAdaptor.default as AxiosInstance

$axios.defaults.timeout = 10000

$axios.interceptors.request.use((config) => {
  const token = getToken()
  if (config.headers) {
    if (token) {
      config.headers['Authorization'] = token
    }
    config.headers['x-uuid'] = uuid
  }

  return config
})

$axios.interceptors.response.use(
  undefined,
  (error: AxiosError<Record<string, any> | undefined>) => {
    if (error instanceof CanceledError) {
      return Promise.reject(error)
    }

    // if (process.env.NODE_ENV === 'development') {
    //   console.error(error.message)
    // }

    if (isClientSide()) {
      if (
        !error.response ||
        error.response.status === 408 ||
        error.code === 'ECONNABORTED'
      ) {
        const msg = '上游服务器请求超时'
        message.error(msg)
        console.error(msg, error.message)
      }

      const response = error.response
      if (response) {
        const data = response.data

        // eslint-disable-next-line no-empty
        if (response.status == 401) {
        } else if (data && data.message) {
          message.error(
            typeof data.message == 'string'
              ? data.message
              : Array.isArray(data.message)
              ? data.message[0]
              : '请求错误',
          )
        }
      }
    }

    return Promise.reject(error)
  },
)
