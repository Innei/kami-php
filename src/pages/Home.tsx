import { Avatar } from 'components/avatar'
import { LaTwitter } from 'components/icons/icons'
import { useInitialData } from 'hooks/use-initial-data'
import { BaseLayout } from 'layouts/base'
import { Top } from 'models/aggregate'
import { Link } from 'react-router-dom'
import { proxy } from 'utils/rest'
import styles from './Home.module.css'

const Home: SSRPage<{ data: Top.Aggregate }> = (props) => {
  const initialData = useInitialData()
  if (!props.loaded) {
    return <span>Loading Data...</span>
  }
  const { user } = initialData
  return (
    <BaseLayout>
      <section className="pt-16 pb-4">
        <div className="flex justify-between items-center">
          <div className="grid grid-cols-2 gap-9">
            <Avatar size={120} src={user.avatar} />
            <div className="flex flex-col justify-start">
              <h1 className="text-3xl font-medium my-[10px]">{user.name}</h1>
              <h2 className="text-base text-background-gray mb-3">
                {user.introduce}
              </h2>

              <div className="text-2xl space-x-4">
                <a href="#">
                  <LaTwitter />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles['sb']}>
        <h3 className="text-2xl font-medium"># 最近折腾了啥？</h3>
        <ul>
          {props.data.posts.map((post) => {
            return (
              <li key={post.id}>
                <Link to={`/posts/${post.category.slug}/${post.slug}`}>
                  {post.title}
                </Link>

                {/* <span>{post.created}</span> */}
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles['sb']}>
        <h3 className="text-2xl font-medium"># 最近写了啥？</h3>
        <ul>
          {props.data.notes.map((note) => {
            return (
              <li key={note.id}>
                <Link to={`/notes/${note.nid}`}>{note.title}</Link>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles['sb']}>
        <h3 className="text-2xl font-medium"># 最近说了啥？</h3>
        <ul>
          {props.data.says.map((say) => {
            return (
              <li key={say.id}>
                <span>{say.text}</span>
                <span>{say.author || say.source || '佚名'}</span>
              </li>
            )
          })}
        </ul>
      </section>
    </BaseLayout>
  )
}

Home.loadData = async function (ctx) {
  const data = await proxy.api.aggregate.top.get<Top.Aggregate>()

  return {
    data,
  }
}

export default Home
