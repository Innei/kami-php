'use client'

import Link from 'next/link'
import type { FC } from 'react'
import React, { Fragment, useCallback } from 'react'

import Package from '~/../package.json'
import { useAppStore } from '~/atoms/app'
import { ImpressionView } from '~/components/app/impression-view'
import { withNoSSR } from '~/components/app/no-ssr'
import { TrackerAction } from '~/enums/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useInitialData, useThemeConfig } from '~/hooks/app/use-initial-data'
import { useFooterBackground } from '~/hooks/app/use-kami'

import { FooterActions } from './actions'
import styles from './index.module.css'

const version = Package.version

const FooterContainer = (props) => {
  useFooterBackground(styles['footer'])

  return (
    <footer className={styles['footer']} id="app-footer">
      {props.children}
    </footer>
  )
}

export const FooterContent: FC = () => {
  const thisYear = new Date().getFullYear()
  const initialData = useInitialData()
  const name = initialData.user.name
  const kamiConfig = useThemeConfig()
  const motto = kamiConfig.site.footer.motto

  const icp = kamiConfig.site.footer.icp
  const navigation = kamiConfig.site.footer.navigation

  const { event } = useAnalyze()
  const trackerToGithub = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: '底部点击去 Github',
    })
  }, [])

  return (
    <div className={styles.wrap}>
      <div className="flex flex-col items-center justify-center sm:items-start">
        <p>
          © {thisYear !== 2020 && '2020-'}
          {thisYear}{' '}
          <a href={kamiConfig.site.footer.homePage ?? '#'} target="_blank">
            {name}
          </a>
          .{' '}
          <span title={`${motto.content} -- ${motto.author}`}>
            {motto.content}
          </span>
        </p>
        <ImpressionView trackerMessage="底部曝光">
          <p className="children:flex-shrink-0 flex flex-wrap justify-center space-x-2">
            <span>Powered by </span>
            <a href="https://github.com/mx-space" onClick={trackerToGithub}>
              mx-space
            </a>
            .
            <a
              href="https://github.com/mx-space/kami"
              onClick={trackerToGithub}
              title={version}
            >
              Kami
            </a>
            .
            {icp.enable && !!icp.label && !!icp.link && (
              <span className="inline-block text-center">
                <a href={icp.link} target="_blank" rel="noreferrer">
                  {icp.label}
                </a>
              </span>
            )}
          </p>
        </ImpressionView>
      </div>
      <div className="flex flex-col items-center justify-center sm:items-end">
        <p className="mr-12 phone:mr-0">
          {navigation.map((nav, i) => {
            return (
              <Fragment key={nav.name}>
                <Link
                  href={nav.path}
                  target={nav.newtab ? '_blank' : undefined}
                >
                  {nav.name}
                </Link>
                {i === navigation.length - 1 ? '' : ' · '}
              </Fragment>
            )
          })}
        </p>

        <p className="mr-12 phone:mr-0">
          <GatewayCount /> 个小伙伴正在浏览
        </p>
      </div>
    </div>
  )
}

const GatewayCount = () => {
  const gatewayCount = useAppStore((state) => state.gatewayOnline)
  return <>{gatewayCount || 1}</>
}
export const SiteFooter = withNoSSR(() => {
  return (
    <FooterContainer>
      <FooterContent />
      <FooterActions />
    </FooterContainer>
  )
})
