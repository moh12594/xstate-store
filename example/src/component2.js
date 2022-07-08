import React from 'react';
import { useDataFromContext } from 'xstate-store';
import { LIGHT_INSTANCE_ID } from './constant';

export default function Component2() {
  const data = useDataFromContext(LIGHT_INSTANCE_ID, 'usageNumber')

  return (
    <p>
      Number of light usage: <strong>{data.usageNumber}</strong>
    </p>
  )
}
