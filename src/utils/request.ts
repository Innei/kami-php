import {
  AggregateController,
  CategoryController,
  createClient,
  NoteController,
  PageController,
  PostController,
} from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/lib/adaptors/axios'
import { getToken } from './cookie'
const $axios = axiosAdaptor.default
$axios.defaults.timeout = 10000

$axios.interceptors.request.use(
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

const apiClient = createClient(axiosAdaptor)(
  (import.meta.env.VITE_APP_API_URL as any) || '/api',
)

apiClient.injectControllers([
  PostController,
  NoteController,
  AggregateController,
  CategoryController,
  PageController,
])

export { apiClient }
