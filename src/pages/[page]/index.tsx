import { observer } from 'mobx-react-lite'

export const PageView: SSRPage<{ data: any }> = observer((props) => {
  if (!props.loaded) {
    return null
  }

  const { text, id, title, subtitle } = props.data
  return text
})

PageView.loadData = async (ctx) => {
  const page = ctx.params?.page as string

  return { data: page }
}
