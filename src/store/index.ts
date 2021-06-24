import { createContext, useContext } from 'react'

import { isClientSide, isServerSide } from 'utils'
import { enableStaticRendering } from 'mobx-react-lite'
import { configure } from 'mobx'
import { uiStore } from './ui.store'
import { appStore } from './app.store'
import { userStore } from './user.store'

configure({
  useProxies: 'always',
  enforceActions: 'always',
})

enableStaticRendering(isServerSide())

export const stores = {
  ui: uiStore,
  app: appStore,
  user: userStore,
}
if (__DEV__ && isClientSide()) {
  window.store = stores
}

export const StoreContext = createContext(stores)

export const useStore = () => useContext(StoreContext)

export { uiStore, appStore }
