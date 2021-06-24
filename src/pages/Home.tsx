import { LikeButton } from 'components/LikeButton'
import { OverLay } from 'components/Overlay'
import { Seo } from 'components/SEO'
import { useInitialData } from 'hooks/use-initial-data'
import { observer } from 'mobx-react-lite'
import { uiStore } from 'store/ui.store'
import './Home.css'

const Home: SSRPage<{}> = (props) => {
  const { seo } = useInitialData()

  return (
    <>
      <h1>Home</h1>

      <Seo template={false} title={seo.title + ' · ' + seo.description}></Seo>
      {uiStore.viewport.w}
    </>
  )
}

Home.loadData = async function (ctx) {
  return {}
}

export default observer(Home)
