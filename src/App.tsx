import { ErrorBoundary } from 'components/error'
import { Seo } from 'components/SEO'
import { useInitialData } from 'hooks/use-initial-data'
import { PageLayout } from 'layouts/page'
import { Helmet } from 'react-helmet'
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
          if (!data) {
            return null
          }
          const { seo } = data

          const { title, description, keywords } = seo
          return (
            <ErrorBoundary>
              <Seo
                title={title}
                description={description}
                meta={[
                  { name: 'keywords', content: keywords?.join(',') || '' },
                ]}
              ></Seo>

              <Helmet
                meta={[
                  {
                    name: 'viewport',
                    content: 'initial-scale=1, maximum-scale=1',
                  },
                ]}
              ></Helmet>
              <PageLayout>{router.view({ ssr: ctx })}</PageLayout>
            </ErrorBoundary>
          )
        }}
      </SSRConsumer>
    </>
  )
}
