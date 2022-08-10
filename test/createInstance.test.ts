import { assign } from 'xstate'
import { createInstance, stopInstance } from '../src'
import { machineDefinition } from './machine-test'

const instanceId = 'CREATE_INSTANCE_TEST'

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
    return stopInstance(instanceId)
  })
  it('should have the initial state initially', () => {
    expect(myInstance.state.matches(myInstance.initialState)).toBe(true)
  })
  it('should have the usageNumber to 0 initially', () => {
    expect(myInstance.state.context.usageNumber).toBe(0)
  })
  it('should transition from off to on when TOGGLE is sent', () => {
    myInstance.send({ type: 'TOGGLE' })
    expect(myInstance.state.matches('on')).toBe(true)
  })
  it('should have incremented the usageNumber to 1 after 1 toggle', () => {
    expect(myInstance.state.context.usageNumber).toBe(1)
  })
  it('should return the same instance when trying to create with same instanceId', () => {
    const newInstance = createInstance(instanceId, {
      ...machineDefinition, id: 'different-machine'
    }, {
      actions: {
        assignUsageNumber: assign({
          usageNumber: (context) => context.usageNumber + 1,
        })
      }
    })

    expect(newInstance).toEqual(myInstance)
    expect(newInstance.id).toEqual(myInstance.id)
  })
})
