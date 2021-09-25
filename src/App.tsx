import { ErrorBoundary } from 'components/error'
import { Header } from 'components/header'
import { Seo } from 'components/SEO'
import { useInitialData } from 'hooks/use-initial-data'
import './App.css'
import { SSRConsumer } from './context'
import ErrorPage from './pages/Error'
import router from './router'
export function App() {
  const data = useInitialData()
  return (
    <>
      <SSRConsumer>
        {(ctx) => {
          if (ctx.$ssrErrorMsg) {
            return <ErrorPage message={ctx.$ssrErrorMsg} status={ctx.status!} />
          }
          const {
            seo: { title, description, keywords },
          } = data
          return (
            <ErrorBoundary>
              <Seo
                title={title}
                description={description}
                meta={[{ name: 'keywords', content: keywords.join(',') }]}
              ></Seo>
              <Header />

              <div className="">{router.view({ ssr: ctx })}</div>
            </ErrorBoundary>
          )
        }}
      </SSRConsumer>
    </>
  )
}
