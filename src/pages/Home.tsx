import { useInitialData } from 'hooks/use-initial-data'
import { $http } from 'utils/request'
import './Home.css'

const Home: SSRPage<any> = (props) => {
  if (!props.loaded) {
    return <span>Loading Data...</span>
  }
  const { data } = useInitialData()
  return (
    <>
      <h1>Home</h1>
      <p>initialData: {JSON.stringify(data, null, 2)}</p>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </>
  )
}

Home.loadData = async function (ctx) {
  const data = await $http.get('/aggregate/top')
  console.log(data)

  return {
    data,
  }
}

export default Home
