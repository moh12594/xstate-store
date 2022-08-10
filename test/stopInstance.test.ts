
import { assign } from 'xstate'
import { createInstance, sendToInstance, stopInstance } from '../src'
import { machineDefinition } from './machine-test'

const instanceId = 'STOP_INSTANCE_TEST'

let myInstance: any = null

describe('createInstance', () => {
  beforeAll(() => {
    myInstance = createInstance(instanceId, machineDefinition, {
      actions: {
        assignUsageNumber: assign({
          usageNumber: (context) => context.usageNumber + 1,
        })
      }
    })
    return myInstance
  })
  it('should return null when trying to stop a machine that dont exists', () => {
    const result = stopInstance('some-random-id')
    expect(result).toBeNull()
  })
  it('should delete the instance after stopping it', () => {
    expect(myInstance.state.matches('off')).toBe(true)
    stopInstance(instanceId)
    expect(() => sendToInstance(instanceId, { type: 'TOGGLE' })).toThrow(`The service with id: ${instanceId} doesn't exist`)
  })
})
