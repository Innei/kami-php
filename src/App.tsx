import { Header } from 'components/Header'
import { useInitialData } from 'hooks/use-initial-data'
import { AggregateModel } from 'models/aggregate'
import { FC, useEffect, useRef } from 'react'
import './App.css'
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

          return (
            <>
              {/* <Helmet
                title={seo.title + ' · ' + seo.description}
                meta={[
                  { name: 'description', content: seo.description },
                  { name: 'keywords', content: seo.keywords.join(',') },
                  { name: 'og:site_name', content: seo.title },
                ]}
              ></Helmet> */}
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
    if (__DEV__) {
      window.data = data
    }
  }, [])

  return (
    <>
      <Header />
      {children}
    </>
  )
}
