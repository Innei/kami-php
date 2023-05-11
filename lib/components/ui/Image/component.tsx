'use client'

// import mediumZoom from 'medium-zoom'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useDomEvent,
} from 'framer-motion'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  CSSProperties,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
} from 'react'

import { RootPortal } from '~/components/app/portal'
import { LazyLoad } from '~/components/common/Lazyload'
import { useIsDark } from '~/hooks/ui/use-dark'
import { isDarkColorHex } from '~/utils/color'
import { cn, escapeHTMLTag } from '~/utils/helper'

import styles from './index.module.css'
import { useCalculateNaturalSize } from './use-calculate-size'

interface ImageProps {
  defaultImage?: string
  src: string
  alt?: string
  height?: number | string
  width?: number | string
  backgroundColor?: string
  popup?: boolean
  overflowHidden?: boolean
  getParentElWidth?: ((parentElementWidth: number) => number) | number
  showErrorMessage?: boolean
}

const Image: FC<
  {
    popup?: boolean
    height?: number | string
    width?: number | string
    loaderFn: () => void
    loaded: boolean
  } & Pick<
    DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src' | 'alt'
  >
> = memo(({ src, alt, height, width, popup = false, loaded, loaderFn }) => {
  useEffect(() => {
    loaderFn()
  }, [loaderFn])

  const [show, setShow] = useState(false)
  const id = useId()
  const ref = useRef<HTMLImageElement>(null)
  const controls = useAnimationControls()

  return (
    <div
      suppressHydrationWarning
      className={cn(styles['lazyload-image'], !loaded && styles['image-hide'])}
      data-status={loaded ? 'loaded' : 'loading'}
      onAnimationEnd={onImageAnimationEnd}
    >
      {loaded ? (
        <motion.img
          ref={ref}
          animate={controls}
          className={cn(popup ? 'cursor-zoom-in' : '', 'relative')}
          onClick={
            popup
              ? () => {
                  setShow(true)
                }
              : undefined
          }
          layoutId={id}
          src={src}
          alt={alt}
          // style={{ width, height }}
          onLayoutAnimationStart={() => {
            if (!ref.current) return
            ref.current.style.zIndex = '4'
          }}
          onLayoutAnimationComplete={() => {
            if (!ref.current) return
            ref.current.style.zIndex = ''
          }}
        />
      ) : (
        <img src={src} alt={alt} loading="lazy" style={{ width, height }} />
      )}

      {popup && (
        <ImagePreview
          id={id}
          onClose={() => setShow(false)}
          show={show}
          src={src}
          alt={alt}
        />
      )}
    </div>
  )
})

const ImagePreview = (props: {
  src?: string
  show: boolean
  onClose: () => void
  alt?: string
  id: string
}) => {
  const isDark = useIsDark()
  const { alt, show, onClose, src, id } = props
  useDomEvent(useRef(window), 'scroll', () => show && onClose())

  return (
    <RootPortal>
      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed inset-0 z-[98] flex cursor-zoom-out items-center justify-center"
            animate={{
              backgroundColor: [
                `#${isDark ? '000000' : 'ffffff'}00`,
                isDark ? '#111' : '#fff',
              ],
            }}
            exit={{
              backgroundColor: [
                isDark ? '#111' : '#fff',
                `#${isDark ? '000000' : 'ffffff'}00`,
              ],
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>
      {show && (
        <motion.div
          layout
          className="fixed inset-0 z-[99] flex cursor-zoom-out items-center justify-center"
          onClick={() => {
            onClose()
          }}
        >
          <motion.img
            layout
            layoutId={id}
            src={src}
            alt={alt}
            className="max-h-[95%] max-w-[95%]"
          />
        </motion.div>
      )}
    </RootPortal>
  )
}

const onImageAnimationEnd: React.AnimationEventHandler<HTMLDivElement> = (
  e,
) => {
  ;(e.target as HTMLElement).dataset.animated = '1'
}

export type ImageLazyRef = { status: 'loading' | 'loaded' }

export const ImageLazy = memo(
  forwardRef<
    ImageLazyRef,
    ImageProps &
      DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
  >((props, ref) => {
    const {
      defaultImage,
      src,
      alt,
      height,
      width,
      backgroundColor = 'rgb(111,111,111)',
      popup = false,
      style,
      // overflowHidden = false,
      getParentElWidth = (w) => w,
      showErrorMessage,
      ...rest
    } = props
    useImperativeHandle(ref, () => {
      return {
        status: loaded ? 'loaded' : ('loading' as any),
      }
    })
    const realImageRef = useRef<HTMLImageElement>(null)
    const placeholderRef = useRef<HTMLDivElement>(null)

    const wrapRef = useRef<HTMLDivElement>(null)
    const [calculatedSize, calculateDimensions] = useCalculateNaturalSize()

    const [loaded, setLoad] = useState(false)
    const loaderFn = useCallback(() => {
      if (!src || loaded) {
        return
      }

      const image = new window.Image()
      image.src = src as string
      // FIXME
      const parentElement = wrapRef.current?.parentElement?.parentElement

      if (!height && !width) {
        calculateDimensions(
          image,
          typeof getParentElWidth == 'function'
            ? getParentElWidth(
                parentElement
                  ? parseFloat(getComputedStyle(parentElement).width)
                  : 0,
              )
            : getParentElWidth,
        )
      }

      image.onload = () => {
        setLoad(true)
        try {
          if (placeholderRef && placeholderRef.current) {
            placeholderRef.current.classList.add('hide')
          }

          // eslint-disable-next-line no-empty
        } catch {}
      }
      if (showErrorMessage) {
        image.onerror = () => {
          try {
            if (placeholderRef && placeholderRef.current) {
              placeholderRef.current.innerHTML = `<p style="color:${
                isDarkColorHex(backgroundColor) ? '#eee' : '#333'
              };z-index:2"><span>图片加载失败!</span><br/>
          <a style="margin: 0 12px;word-break:break-all;white-space:pre-wrap;display:inline-block;" href="${escapeHTMLTag(
            image.src,
          )}" target="_blank">${escapeHTMLTag(image.src)}</a></p>`
            }
            // eslint-disable-next-line no-empty
          } catch {}
        }
      }
    }, [
      src,
      loaded,
      height,
      width,
      calculateDimensions,
      getParentElWidth,
      backgroundColor,
      showErrorMessage,
    ])
    const memoPlaceholderImage = useMemo(
      () => (
        <PlaceholderImage
          height={height}
          width={width}
          backgroundColor={backgroundColor}
          ref={placeholderRef}
        />
      ),
      [backgroundColor, height, width],
    )

    const imageWrapperStyle = useMemo<CSSProperties>(
      () => ({
        height: loaded ? undefined : height || calculatedSize.height,
        width: loaded ? undefined : width || calculatedSize.width,

        // ...(overflowHidden ? { overflow: 'hidden', borderRadius: '3px' } : {}),
      }),
      [
        calculatedSize.height,
        calculatedSize.width,
        height,
        loaded,
        // overflowHidden,
        width,
      ],
    )
    return (
      <figure suppressHydrationWarning style={style} className="inline-block">
        {defaultImage ? (
          <img src={defaultImage} alt={alt} {...rest} ref={realImageRef} />
        ) : (
          <div
            suppressHydrationWarning
            className={cn(
              'relative m-auto inline-block min-h-[1px] max-w-full transition-none',
              rest.className,
            )}
            style={imageWrapperStyle}
            ref={wrapRef}
            data-info={JSON.stringify({ height, width, calculatedSize })}
            data-src={src}
          >
            <LazyLoad offset={100} placeholder={memoPlaceholderImage}>
              <Image
                src={src}
                alt={alt}
                height={height || calculatedSize.height}
                width={width || calculatedSize.width}
                popup={popup}
                loaded={loaded}
                loaderFn={loaderFn}
              />
              {!loaded && memoPlaceholderImage}
            </LazyLoad>
          </div>
        )}
        {alt && <figcaption className={styles['img-alt']}>{alt}</figcaption>}
      </figure>
    )
  }),
)

const PlaceholderImage = memo(
  forwardRef<
    HTMLDivElement,
    { ref: any; className?: string } & Partial<ImageProps>
  >((props, ref) => {
    const { backgroundColor, height, width } = props
    return (
      <div
        className={cn(styles['placeholder-image'], props.className)}
        ref={ref}
        style={{
          height,
          width,
          color: backgroundColor,
        }}
      />
    )
  }),
)
