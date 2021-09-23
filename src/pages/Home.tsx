import { observer } from 'mobx-react-lite'
import './Home.css'

const Home: SSRPage<{}> = (props) => {
  // const { seo } = useInitialData()

  return (
    <>
      <h1>Home</h1>

      {/* <Seo template={false} title={seo.title + ' · ' + seo.description}></Seo> */}
    </>
  )
}

Home.loadData = async function (ctx) {
  return {}
}

export default observer(Home)
