import { assign } from 'xstate'
import { createInstance } from '../src'

export const instanceId = 'TOGGLE_MACHINE'

export const machineDefinition = {
  predictableActionArguments: true,
  id: 'test-machine',
  initial: 'off',
  schema: {
    context: {} as { usageNumber: number },
    events: {} as
      | { type: 'TOGGLE' }
  },
  context: {
    usageNumber: 0,
  },
  states: {
    off: {
      on: {
        TOGGLE: {
          target: 'on',
          actions: 'assignUsageNumber'
        }
      }
    },
    on: {
      on: {
        TOGGLE: 'off'
      }
    },
  }
}

export const myInstance = createInstance(instanceId, machineDefinition, {
  actions: {
    assignUsageNumber: assign({
      usageNumber: (context) => context.usageNumber + 1,
    })
  }
})