'use client'

import React from 'react'
import type { FC } from 'react'

import { cn } from '~/utils/helper'

import {
  ClaritySuccessLine,
  FluentShieldError20Regular,
  FluentWarning28Regular,
  IonInformation,
} from '../../icons/status'

const IconMap = {
  warning: FluentWarning28Regular,
  info: IonInformation,
  error: FluentShieldError20Regular,
  success: ClaritySuccessLine,
}

const bgColorMap = {
  warning: 'bg-amber-50 dark:bg-amber-300',
  info: 'bg-default-blue-50 dark:bg-default-blue-300',
  success: 'bg-default-green-50 dark:bg-default-green-300',
  error: 'bg-default-red-50 dark:bg-default-red-300',
}

const borderColorMap = {
  warning: 'border-amber-300',
  info: 'border-default-blue-300',

  success: 'border-default-green-300',
  error: 'border-default-red-300',
}

const iconColorMap = {
  warning: 'text-amber-500',
  info: 'text-default-blue-500',
  success: 'text-default-green-500',
  error: 'text-default-red-500',
}

export const Banner: FC<{
  type: 'warning' | 'error' | 'success' | 'info'
  message?: string | React.ReactNode
  className?: string
  children?: React.ReactNode
  placement?: 'center' | 'left'
  showIcon?: boolean
}> = (props) => {
  const Icon = IconMap[props.type] || IconMap.info
  const { placement = 'center', showIcon = true } = props
  return (
    <div
      className={cn(
        'flex items-center space-x-4 rounded-md border p-6 text-dark-100 dark:bg-opacity-10 dark:text-[#c4c4c4] phone:block ' +
          `${bgColorMap[props.type] || bgColorMap.info} ${
            borderColorMap[props.type] || borderColorMap.info
          }`,
        placement == 'center' ? 'justify-center' : 'justify-start',
        props.className,
      )}
    >
      {showIcon && (
        <Icon
          className={`flex-shrink-0 self-start text-3xl ${
            iconColorMap[props.type] || iconColorMap.info
          } mr-2 phone:float-left phone:-mr-2`}
        />
      )}
      {props.message ? (
        <span className="leading-[1.8]">{props.message}</span>
      ) : (
        props.children
      )}
    </div>
  )
}
