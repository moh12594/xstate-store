import React from 'react'
import { sendToInstance } from 'xstate-store';
import { LIGHT_INSTANCE_ID } from './constant';

export default function Component1() {
  return (
    <button
      onClick={
        () => sendToInstance(
          LIGHT_INSTANCE_ID,
          {
            type: 'TOGGLE',
          })
      }>
        Toggle
    </button>
  )
}
