import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { getToken } from './cookie'

const instance = axios.create({
  baseURL: (import.meta.env.VITE_APP_API_URL as any) || '/api',
  timeout: 10000,
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'bearer ' + getToken()
    }

    return config
  },
  (error) => {
    if (__DEV__) {
      console.log(error.message)
    }

    return Promise.reject(error)
  },
)

instance.interceptors.response.use((response) => {
  const res = camelcaseKeys(response.data, { deep: true })

  return res
})

export { instance as $http }
