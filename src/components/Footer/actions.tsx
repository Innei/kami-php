import {
  faArrowUp,
  faHeadphones,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { userStore, useStore } from 'common/store'
import { QueueAnim } from 'components/Anime'
import { observer } from 'utils/mobx'
import { FC, useEffect, useState } from 'react'
import { EventTypes } from 'common/socket/types'
import { ChatPanel } from 'components/Chat'
import observable from 'utils/observable'
import styles from './actions.module.css'

export const FooterActions: FC = observer(() => {
  const { /* userStore, */ appStore, actionStore, musicStore } = useStore()
  const { isOverFirstScreenHeight: isOverflow } = appStore
  const [chatShow, setChatShow] = useState(false)
  const [newMessageCount, setCount] = useState(0)
  useEffect(() => {
    const handler = (data: any) => {
      if (
        (!userStore.isLogged && data.author === userStore.name) ||
        data.author === userStore.username
      ) {
        setCount(newMessageCount + 1)
      }
    }
    observable.on(EventTypes.DANMAKU_CREATE, handler)

    return () => {
      observable.off(EventTypes.DANMAKU_CREATE, handler)
    }
  }, [])
  return (
    <>
      <div className="action">
        <button
          className={classNames('top', isOverflow ? 'active' : '')}
          onClick={(e) => {
            // @ts-ignore

            e.preventDefault()

            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            })
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>

        <QueueAnim type="scale" leaveReverse ease="easeInQuart" forcedReplay>
          {actionStore.actions.map((action, i) => {
            return (
              <button key={i} onClick={action.onClick}>
                {action.icon}
              </button>
            )
          })}
        </QueueAnim>

        <button
          onClick={() => {
            musicStore.setHide(!musicStore.isHide)
          }}
        >
          <FontAwesomeIcon icon={faHeadphones} />
        </button>

        {/* <button>
          <FontAwesomeIcon icon={faHeart} />
        </button> */}

        <button
          onClick={(e) => {
            setChatShow(!chatShow)
            setCount(0)
          }}
          className={classNames(
            styles['message-btn'],
            newMessageCount ? 'count' : null,
          )}
          data-count={newMessageCount}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
      {/* <ConfigPanel /> */}
      <ChatPanel show={chatShow} toggle={() => setChatShow(!chatShow)} />
    </>
  )
})
