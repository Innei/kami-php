import { useInitialData } from 'hooks/use-initial-data'
import './Home.css'

const Home: SSRPage<{ a: number; data: { a: number } }> = (props) => {
  const data = useInitialData()

  return (
    <>
      <h1>Home</h1>
      <p>{JSON.stringify(data)}</p>
    </>
  )
}

Home.loadData = async function (ctx) {
  return {
    data: { a: 1 },
    a: 1,
  }
}

export default Home
