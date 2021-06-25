import Header from 'components/Header'
import { useInitialData } from 'hooks/use-initial-data'
import { throttle } from 'lodash'
import { AggregateModel } from 'models/aggregate'
import { FC, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { appStore, categoryStore } from 'store'
import { PageModel } from 'store/store.types'
import { uiStore } from 'store/ui.store'
import { userStore } from 'store/user.store'
import './App.css'
import { Loader } from './components/Loader'
import { SSRConsumer } from './context'
import ErrorPage from './pages/Error'
import router from './router'
export function App() {
  return (
    <>
      <SSRConsumer>
        {(ctx) => {
          if (ctx.$ssrErrorMsg) {
            return <ErrorPage message={ctx.$ssrErrorMsg} status={ctx.status!} />
          }
          const initialData = ctx.initialData as AggregateModel
          const seo = initialData.seo
          return (
            <>
              <Helmet
                title={seo.title + ' · ' + seo.description}
                meta={[
                  { name: 'description', content: seo.description },
                  { name: 'keywords', content: seo.keywords.join(',') },
                  { name: 'og:site_name', content: seo.title },
                ]}
              ></Helmet>
              <MyCustomApp>{router.view({ ssr: ctx })}</MyCustomApp>
            </>
          )
        }}
      </SSRConsumer>
    </>
  )
}

const MyCustomApp: FC = ({ children }) => {
  const data = useInitialData()
  const _currentY = useRef(0)
  // store

  useEffect(() => {
    appStore.setPage(data.pageMeta as PageModel[])
    categoryStore.setCategory(data.categories)
    userStore.setUser(data.user)
  }, [])

  useEffect(() => {
    window.data = data

    const resizeHandler = throttle(() => {
      uiStore.updateViewport()
    }, 300)
    window.onresize = resizeHandler
    uiStore.updateViewport()

    const handleScroll = throttle(
      () => {
        const currentY = document.documentElement.scrollTop
        const direction = _currentY.current > currentY ? 'up' : 'down'
        uiStore.updatePosition(direction)
        _currentY.current = currentY
      },
      50,
      { leading: true },
    )

    document.addEventListener('scroll', handleScroll)
    document.body.classList.remove('loading')
    return () => {
      window.onresize = null
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const getColormode = <T extends { matches: boolean }>(e: T) => {
      const mode = e.matches ? 'dark' : 'light'
      uiStore.setColorMode(mode)
      return mode
    }

    const getMediaType = <T extends { matches: boolean }>(e: T) => {
      const type = e.matches ? 'screen' : 'print'
      uiStore.setMediaType(type)
      return type
    }
    getColormode(window.matchMedia('(prefers-color-scheme: dark)'))
    getMediaType(window.matchMedia('screen'))
    const cb1 = (e: MediaQueryListEvent): void => {
      if (uiStore.autoToggleColorMode) {
        getColormode(e)
      }
    }
    const cb2 = (e: MediaQueryListEvent): void => {
      getMediaType(e)
    }
    try {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', cb1)

      window.matchMedia('screen').addEventListener('change', cb2)
      // eslint-disable-next-line no-empty
    } catch {}

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', cb1)
      window.matchMedia('screen').removeEventListener('change', cb2)
    }
  }, [])

  return (
    <>
      <Header />
      {children}

      <Loader />
    </>
  )
}
