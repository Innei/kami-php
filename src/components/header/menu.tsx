import clsx from 'clsx'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import styles from './menu.module.css'
export const HeaderMenu: FC = () => {
  return (
    <ul className={clsx('inline-flex space-x-4', styles['wrapper'])}>
      <li>
        <Link to="/">源</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/posts">文</Link>
      </li>
      <li>
        <Link to="/notes">记</Link>
      </li>
    </ul>
  )
}
