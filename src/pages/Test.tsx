import { useInitialData } from 'hooks/use-initial-data'
import { FC } from 'react'
import './Home.css'
import loadable from '@loadable/component'
const OnlyClient: FC = () => {
  return <span>{location.href}</span>
}

const OT = loadable(() => Promise.resolve(OnlyClient), { ssr: false })

const Home: SSRPage<{ data: any[] }> = (props) => {
  const data = useInitialData()
  console.log(props.data)

  return (
    <>
      <h1>Test</h1>
      <p>{JSON.stringify(data.lastestNoteNid)}</p>
      {/* {props.data[0]} */}
      <OT />
    </>
  )
}

Home.loadData = async function (ctx) {
  return {
    data: [{ a: 1 }], // props.data
  }
}

export default Home
