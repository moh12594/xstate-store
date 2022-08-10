import * as React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { createInstance, stopInstance, useInstance } from '../src'
import { machineDefinition } from './machine-test'
import { render } from '@testing-library/react'
import { assign } from 'xstate'

const instanceId = 'USE_INSTANCE_TEST'

describe('useInstance', () => {
  beforeAll(() => {
    return createInstance(instanceId, machineDefinition, {
      actions: {
        assignUsageNumber: assign({
          usageNumber: (context) => context.usageNumber + 1,
        })
      }
    })
  })

  afterAll(() => {
    return stopInstance(instanceId)
  })

  it('should return an array', () => {
    const { result } = renderHook(() => useInstance(instanceId))

    expect(result.current).toBeInstanceOf(Array)
  })
  it('should an actor immediately available with initial state', () => {
    const { result } = renderHook(() => useInstance(instanceId))
    const [state] = result.current as any
    expect(state.value).toEqual('off')
  })
  it('should transition to another state sending an event', (done) => {
    const FirstTestComponent: React.FC = () => {
      const [state, send] = useInstance(instanceId) as any
  
      React.useEffect(() => {
        send({ type: 'TOGGLE' })
      }, [])

      return <div>Hello state: {state.value}</div>
    }

    const SecondTestComponent: React.FC = () => {
      const [state, send] = useInstance(instanceId) as any


      if (state.matches('on')) {
        done()
      }

      React.useEffect(() => {
        send({ type: 'TOGGLE' })
      }, [])

      return <div>Hello state: {state.value}</div>
    }
  
    render(<FirstTestComponent />)
    render(<SecondTestComponent />)
  })

  it('should throw an error trying to access an instance that dont exists', () => {
    const { result } = renderHook(() => useInstance('UKNOWN_ID'))
    expect(result.error?.message).toBe('The service with id: UKNOWN_ID doesn\'t exist')
  })
})
