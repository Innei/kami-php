import type { FC } from 'react'

import { useUserStore } from '~/atoms/user'
import { withNoSSR } from '~/components/app/no-ssr'
import { Avatar } from '~/components/ui/Avatar'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { FontIcon } from '~/components/ui/FontIcon'
import { BottomToUpTransitionView } from '~/components/ui/Transition/bottom-up'
import { TextUpTransitionView } from '~/components/ui/Transition/text-up'
import { reboundPreset } from '~/constants/spring'
import { useThemeConfig } from '~/hooks/app/use-initial-data'

import { useHomePageViewContext } from './context'
import styles from './intro.module.css'

const wrapperProps = { className: '!w-full !h-full !border-none !shadow-none' }
export const HomeIntro: FC = () => {
  const { doFirstLoadAnimation: doAnimation } = useHomePageViewContext()
  const user = useUserStore((state) => state.master)

  if (!user) {
    return null
  }
  return (
    <section className={styles['root']}>
      <div className="intro-avatar">
        <Avatar
          useRandomColor={false}
          imageUrl={user.avatar || ''}
          alt={user.name}
          wrapperProps={wrapperProps}
        />
      </div>
      <div className="intro-info">
        <h1>
          <TextUpTransitionView>{user.name || ''}</TextUpTransitionView>
        </h1>

        <TextUpTransitionView
          appear={doAnimation}
          className="mt-2 leading-7 text-theme-gray-1"
        >
          {user.introduce || ''}
        </TextUpTransitionView>

        <Social />
      </div>
    </section>
  )
}
// 首页 社交 图标栏
const Social: FC = withNoSSR(() => {
  const config = useThemeConfig()
  const { doFirstLoadAnimation: doAnimation } = useHomePageViewContext()
  const { social } = config.site

  return (
    <div className="social-icons space-x-4">
      {social.map((item, i) => {
        return (
          <BottomToUpTransitionView
            appear={doAnimation}
            animation={{
              enter: {
                ...reboundPreset,
              },
            }}
            timeout={{ enter: 1500 + 50 * i }}
            key={item.title}
          >
            <FloatPopover
              placement="bottom"
              triggerComponent={() => (
                <a
                  href={item.url}
                  target="_blank"
                  style={
                    item.color ? { backgroundColor: item.color } : undefined
                  }
                >
                  <FontIcon icon={item.icon} />
                </a>
              )}
              headless
            >
              <div className="rounded-full border border-dark-100 border-opacity-10 bg-theme-bg px-3 py-2 shadow-out-sm">
                {item.title}
              </div>
            </FloatPopover>
          </BottomToUpTransitionView>
        )
      })}
    </div>
  )
})
