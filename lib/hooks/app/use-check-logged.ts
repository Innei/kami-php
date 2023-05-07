import { message } from 'react-message-popup'

import { useUserStore } from '~/atoms/user'
import { useThemeConfig } from '~/hooks/app/use-initial-data'
import { apiClient } from '~/utils/api-client'
import { devtoolForbidden } from '~/utils/console'
import { getToken, removeToken, setToken } from '~/utils/cookie'

export const useCheckLogged = () => {
  const userStore = useUserStore.getState()

  const {
    function: {
      banDevtool: { enable: banDevtoolEnable },
    },
  } = useThemeConfig()
  return {
    async check() {
      return requestAnimationFrame(() => {
        const token = getToken()
        if (token) {
          apiClient.user
            .checkTokenValid(token)
            .then(({ ok }) => {
              if (ok) {
                // refresh token
                apiClient.user.proxy.login
                  .put<{ token: string }>()
                  .then((res) => {
                    userStore.setToken(res.token)
                    message.success(
                      `欢迎回来，${useUserStore.getState().master!.name}`,
                      1500,
                    )
                    setToken(res.token)
                  })
              } else {
                removeToken()
                message.warn('登录身份过期了，再登录一下吧！', 2000)
              }
            })
            .catch(() => {
              removeToken()
              message.warn('登录身份过期了，再登录一下吧！', 2000)
            })
        } else {
          if (banDevtoolEnable) {
            devtoolForbidden()
          }
        }
      })
    },
  }
}
