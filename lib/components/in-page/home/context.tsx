import { createContext, useContext } from 'react'

const Context = createContext({ doFirstLoadAnimation: true })
export const HomePageViewProvider = Context.Provider

export const useHomePageViewContext = () => useContext(Context)
