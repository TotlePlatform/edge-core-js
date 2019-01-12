// @flow

import React from 'react'

import {
  type EdgeContext,
  type EdgeContextOptions,
  type EdgeFakeUser,
  type EdgeFakeWorld
} from '../../types/types.js'
import { EdgeCoreBridge } from './client-bridge.js'

export {
  DustSpendError,
  errorNames,
  InsufficientFundsError,
  SpendToSelfError,
  NetworkError,
  NoAmountSpecifiedError,
  ObsoleteApiError,
  OtpError,
  PasswordError,
  PendingFundsError,
  SameCurrencyError,
  SwapAboveLimitError,
  SwapBelowLimitError,
  SwapCurrencyError,
  SwapPermissionError,
  UsernameError
} from '../../types/error.js'
export * from '../../types/types.js'

function onErrorFallback (e: any): mixed {
  console.error(e)
}

export function MakeEdgeContext (props: {
  debug?: boolean,
  onError?: (e: any) => mixed,
  onLoad: (context: EdgeContext) => mixed,
  options: EdgeContextOptions,
  nativeIo?: Array<Object>
}) {
  const { onError = onErrorFallback, onLoad } = props
  if (onLoad == null) {
    throw new TypeError('No onLoad passed to MakeEdgeContext')
  }

  return (
    <EdgeCoreBridge
      debug={props.debug}
      onError={error => onError(error)}
      onLoad={(io, root) =>
        root.makeEdgeContext(io, props.options).then(onLoad)
      }
      nativeIo={props.nativeIo}
    />
  )
}

export function MakeFakeEdgeWorld (props: {
  debug?: boolean,
  onError?: (e: any) => mixed,
  onLoad: (world: EdgeFakeWorld) => mixed,
  users?: Array<EdgeFakeUser>,
  nativeIo?: Array<Object>
}) {
  const { onError = onErrorFallback, onLoad } = props
  if (onLoad == null) {
    throw new TypeError('No onLoad passed to MakeFakeEdgeWorld')
  }

  return (
    <EdgeCoreBridge
      debug={props.debug}
      onError={error => onError(error)}
      onLoad={(io, root) =>
        root.makeFakeEdgeWorld(io, props.users).then(onLoad)
      }
      nativeIo={props.nativeIo}
    />
  )
}
