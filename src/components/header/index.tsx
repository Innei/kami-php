import clsx from 'clsx'
import { RiSearchLine } from 'components/icons/icons'
import { useInitialData } from 'hooks/use-initial-data'
import styles from './index.module.css'
import { HeaderMenu } from './menu'

export const Header = () => {
  const {
    seo: { title },
  } = useInitialData()
  return (
    <header className={clsx('h-[5.7rem]', styles['header'])}>
      <h1 className="flex items-center flex-1 justify-center lg:justify-start text-xl font-bold">
        <a href="/" aria-label="homeLink" className="">
          {title}
        </a>
      </h1>

      <nav className="items-center justify-center hidden h-full gap-4 lg:flex">
        <HeaderMenu></HeaderMenu>
      </nav>
      <div className="flex items-center justify-end gap-1 lg:flex-1">
        <RiSearchLine></RiSearchLine>
      </div>
    </header>
  )
}
