import * as xState from 'xstate'
import * as xStateReact from '@xstate/react'
import {
  BaseActionObject,
  EventObject,
  InternalMachineOptions,
  MachineConfig,
  ResolveTypegenMeta,
  ServiceMap,
  Subscribable,
  TypegenConstraint,
  TypegenDisabled,
  Interpreter,
  Actor,
  EmittedFrom,
  ActorRef,
} from 'xstate'

const CREATED_SERVICES = {}

function createInstance<TContext, TServiceMap extends ServiceMap = ServiceMap, TTypesMeta extends TypegenConstraint = TypegenDisabled>(
  instanceId: string,
  config: MachineConfig<TContext, any, EventObject, BaseActionObject, TServiceMap, TTypesMeta>,
  options: InternalMachineOptions<TContext, EventObject, ResolveTypegenMeta<TTypesMeta, EventObject, BaseActionObject, TServiceMap>, false> | undefined = undefined
): Interpreter<TContext, any, EventObject, { value: any; context: TContext; }, ResolveTypegenMeta<TTypesMeta, EventObject, BaseActionObject, TServiceMap>> {
  if (CREATED_SERVICES[instanceId]) {
    return CREATED_SERVICES[instanceId]
  }
  const machine = xState.createMachine(config, options)
  const instance = xState.interpret(machine as any)
  instance.start()

  CREATED_SERVICES[instanceId] = instance
  return instance as any
}

const stopInstance = (instanceId: string): any | undefined => (CREATED_SERVICES[instanceId]
  ? CREATED_SERVICES[instanceId].stop()
  : null)

function sendToInstance(instanceId: string, event: EventObject, payload?) {
  if (!CREATED_SERVICES[instanceId]) {
    throw new Error(`The service with id: ${instanceId} doesn't exist`)
  }
  return CREATED_SERVICES[instanceId].send(event, payload)
}

function useInstance(
  instanceId: string,
  getSnapshot?: (actor: ActorRef<EventObject, unknown>) => unknown
): [EmittedFrom<Actor>, Actor['send']] {
  if (!CREATED_SERVICES[instanceId]) {
    throw new Error(`The service with id: ${instanceId} doesn't exist`)
  }

  return xStateReact.useActor(CREATED_SERVICES[instanceId], getSnapshot) as [EmittedFrom<Actor>, Actor['send']]
}

function useDataFromContext(instanceId: string, dataKeys: string | string[]): any {
  if (!CREATED_SERVICES[instanceId]) {
    throw new Error(`The service with id: ${instanceId} doesn't exist`)
  }

  const context = xStateReact.useSelector(
    CREATED_SERVICES[instanceId],
    (state: Actor extends Subscribable<infer Emitted> ? Emitted : never): any => state.context
  )

  const computedKeys = Array.isArray(dataKeys) ? [...dataKeys] : [dataKeys]
  const values = {}
  computedKeys.forEach((key) => {
    if (!context[key] && context[key] !== null && context[key] !== 0 && context[key] !== false) {
      // eslint-disable-next-line no-console
      console.warn(
        `Warning: the key ${key} doesn't exist on the instance ${CREATED_SERVICES[instanceId]}`
      )
    } else {
      values[key] = context[key]
    }
  })

  return values
}

export {
  createInstance,
  stopInstance,
  sendToInstance,
  useInstance,
  useDataFromContext,
}
