import axios, { AxiosError } from 'axios'

const service = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || '/api',
  // withCredentials: true,
  timeout: 10000,
})

service.interceptors.request.use(
  (config) => {
    // const token = getToken()
    // if (token) {
    //   config.headers['Authorization'] = 'bearer ' + getToken()
    // }

    return config
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.log(error.message)
    }

    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<Record<string, any> | undefined>) => {
    return error
  },
)

export { service as request }
