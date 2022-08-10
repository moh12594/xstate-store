
import { assign } from 'xstate'
import { createInstance, sendToInstance, stopInstance } from '../src'
import { machineDefinition } from './machine-test'

const instanceId = 'SEND_INSTANCE_TEST'

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
  afterAll(() => {
    stopInstance(instanceId)
  })
  it('should throw an error when instance doesnt exists', () => {
    expect(() => sendToInstance('some-random-instance', { type: 'TOGGLE' })).toThrow('The service with id: some-random-instance doesn\'t exist')
  })
  it('should send an event to the machine', () => {
    expect(myInstance.state.matches('off')).toBe(true)
    sendToInstance(instanceId, { type: 'TOGGLE' })
    expect(myInstance.state.matches('on')).toBe(true)
  })
})
