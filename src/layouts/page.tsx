import { Header } from 'components/header'

export const PageLayout: React.FC = (props) => {
  return (
    <>
      <Header />

      <div className="">{props.children}</div>
    </>
  )
}
