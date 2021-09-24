import { useInitialData } from 'hooks/use-initial-data'
import { PageModel } from 'models/page'
import { proxy } from 'utils/rest'
import './Home.css'

const About: SSRPage<{ data: PageModel }> = (props) => {
  if (!props.loaded) {
    return <span>Loading Data...</span>
  }
  const { data } = useInitialData()
  return (
    <>
      <h1>About</h1>
      <p>username: {data.user.username}</p>
      <article>{props.data.text}</article>
    </>
  )
}

About.loadData = async function (ctx) {
  const data = await proxy.api.pages.slug('about').get<PageModel>()

  return {
    data,
  }
}

export default About
