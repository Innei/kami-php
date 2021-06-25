import Toc from 'components/Toc'
import { FC } from 'react'
import { uiStore } from 'store/ui.store'
import { observer } from 'utils/mobx'

export const RenderSpoiler: FC<{ value: string }> = (props) => {
  return (
    <del className={'spoiler'} title={'你知道的太多了'}>
      {props.value}
    </del>
  )
}
export const RenderParagraph: FC<{}> = (props) => {
  return <div className={'paragraph'}>{props.children}</div>
}
export const RenderCommentAt: FC<{ value: string }> = ({ value }) => {
  return <>@{value}</>
}
export const _TOC: FC = observer(() => {
  const { isPadOrMobile } = uiStore
  return !isPadOrMobile ? <Toc /> : null
})
