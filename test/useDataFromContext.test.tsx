import * as React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { createInstance, stopInstance, useDataFromContext, useInstance } from '../src'
import { machineDefinition } from './machine-test'
import { render } from '@testing-library/react'
import { assign } from 'xstate'

const instanceId = 'USE_CONTEXT_TEST'
let myInstance
const warn = jest.spyOn(console, "warn").mockImplementation(() => {})

describe('useInstance', () => {
  beforeAll(() => {
    myInstance = createInstance(instanceId, machineDefinition, {
      actions: {
        assignUsageNumber: assign({
          usageNumber: (context) => context.usageNumber + 1,
        })
      }
    })
  })

  afterAll(() => {
    warn.mockReset()
    return stopInstance(instanceId)
  })

  it('should return the whole context when passing undefined', () => {
    const { result } = renderHook(() => useDataFromContext(instanceId))
    expect(result.current).toStrictEqual(myInstance.state.context)
  })

  it('should return the whole context when passing empty array', () => {
    const { result } = renderHook(() => useDataFromContext(instanceId))
    expect(result.current).toStrictEqual(myInstance.state.context)
  })

  it('should return all data asked for in array with warning for unexisting ones', () => {
    const { result } = renderHook(() => useDataFromContext(instanceId, ['usageNumber', 'somerandomone']))
    expect(result.current).toStrictEqual({ usageNumber: 0 })
    expect(warn).toHaveBeenCalledWith(`Warning: the key somerandomone doesn't exist on the instance ${instanceId}`)
  })

  it('should have the context available cross components when passing string', (done) => {
    const FirstTestComponent: React.FC = () => {
      const [state, send] = useInstance(instanceId) as any
  
      React.useEffect(() => {
        send({ type: 'TOGGLE' })
      }, [])

      return <div>Hello state: {state.value}</div>
    }

    const SecondTestComponent: React.FC = () => {
      const data = useDataFromContext(instanceId, 'usageNumber')

      if (data.usageNumber === 1) {
        done()
      }
  
      return <div>Hello state: {data.usageNumber}</div>
    }
  
    render(<FirstTestComponent />)
    render(<SecondTestComponent />)
  })

  it('should throw an error trying to access an instance that dont exists', () => {
    const { result } = renderHook(() => useDataFromContext('UKNOWN_ID', 'some-context-data'))
    expect(result.error?.message).toBe('The service with id: UKNOWN_ID doesn\'t exist')
  })
})
