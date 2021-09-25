import { FC, useEffect, useState } from 'react'
import styles from './index.module.css'

export interface AvatarProps {
  size?: number
  src: string
}
export const Avatar: FC<AvatarProps> = (props) => {
  const { src, size = 50 } = props

  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setLoaded(true)
    }

    return () => {
      img.onload = null
    }
  }, [src])

  return (
    <div className={styles['wrapper']}>
      <div className="avatar" style={{ width: size, height: size }}>
        {loaded ? (
          <img
            src={src}
            alt="avatar"
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        ) : (
          <div
            className="avatar-placeholder"
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        )}
      </div>
    </div>
  )
}
