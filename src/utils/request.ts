import {
  AggregateController,
  CategoryController,
  createClient,
  NoteController,
  PostController,
} from '@mx-space/api-client'
import axios from 'axios'
import { getToken } from './cookie'
const instance = axios.create({
  timeout: 10000,
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers!['Authorization'] = 'bearer ' + getToken()
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

const apiClient = createClient(instance)(
  (import.meta.env.VITE_APP_API_URL as any) || '/api',
)

apiClient.injectControllers([
  PostController,
  NoteController,
  AggregateController,
  CategoryController,
])

export { instance as $http, apiClient }
