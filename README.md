[![npm version](https://badge.fury.io/js/xstate-store.svg)](https://badge.fury.io/js/xstate-store)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[](coverage/lcov-report/sort-arrow-sprite.png)
# A declarative state container built on top of xState

xState-store is a library built on top of xstate, that allows you to access your machines/services through your **React** application and simplify sharing the same instance/actor between your different components.

## Why ?

Because xState and state machines are an awesome way to simplify complex applications logic especially for frontend applications using React library.

Sometimes we need to have a global store or make different components sharing the same logic coming form the same instance, it's where **xState-store** can helps you.

## Installation

Using npm:

```
$ npm install xstate-store xstate @xstate/react
```

## Usage

xstate-store exposes multiple functions that will help you managing your global application states.

### createInstance

To create a new machine instance, you could use `createInstance` method that uses the `createMachine` and `interpret` functions from xstate behind the scenes.

```js
createInstance(
  instanceId: string // it's the unique id that will define the instance and helps us accessing it through the application
  config: MachineDefinition // it's the machine definition that we pass to `createMachine` in xstate
  options?: MachineOptions // optional: the options that would be passed to the xstate `createMachine` function
)
```

For example, if we want to create an instance with the id `LIGHT_INSTANCE_ID`, we can do something like this:

```js
const LIGHT_INSTANCE_ID = '_LIGHT_INSTANCE_ID_'

createInstance(LIGHT_INSTANCE_ID, {
  id: 'test-machine',
  initial: 'off',
  context: {
    usageNumber: 0,
  },
  states: {
    off: {
      on: {
        TOGGLE: {
          target: 'on',
          actions: assign({
            usageNumber: (context) => context.usageNumber + 1,
          })
        }
      }
    },
    on: {
      on: {
        TOGGLE: 'off'
      }
    },
  }
})
```

### stopInstance

Like xstate does, you can stop the instance of your service using the `stopInstance` function by passing the `instanceId`.

```js
stopInstance(LIGHT_INSTANCE_ID)
```

### sendToInstance

`sendToInstance` function allows you to `send` events to your service using the same [`send`](https://xstate.js.org/docs/guides/events.html#sending-events) function from xState.

For example, if we want to send an event `TOGGLE` to our previous service, we can do something like this:

```js
sendToInstance(
  LIGHT_INSTANCE_ID,
  { type: 'TOGGLE' }
)
```

### useInstance
`useInstance` hook works same as the [`useActor`](https://xstate.js.org/docs/packages/xstate-react/#useactor-actor-getsnapshot) function from xstate, you can pass directly your `instanceId` to the hook in order to retrieve the current `state` of the service and a `send` function.

```js
function MyComponent() {
  const [state, send] = useInstance(LIGHT_INSTANCE_ID)

  return (
    <p>The light is now: <strong>{state.value}</strong></p>
  );
}
```

### useDataFromContext
`useDataFromContext` hook allow us more easily accessing the context data through the application.

The purpose is that you can retrieve an object with defined values from the context directly.

The hook will return an object with all asked data passed as an array or string to the hook.

For example, in our previous instance we have a value `usageNumber` in our context. we can retrieve and use it like this:

```js
export default function Component2() {
  const data = useDataFromContext(LIGHT_INSTANCE_ID, 'usageNumber')
  // we can also pass an array to retrieve multiple values directly
  // const data = useDataFromContext(LIGHT_INSTANCE_ID, ['usageNumber', 'otherData'])

  return (
    <p>
      Number of light usage: <strong>{data.usageNumber}</strong>
    </p>
  )
}
```

Not passing a second argument to `useDataFromContext` or passing an empty array will return the whole context to you so you can use it directly like the example below:

```js
export default function Component2() {
  const context = useDataFromContext(LIGHT_INSTANCE_ID, [])
  // same as doing like this:
  // const data = useDataFromContext(LIGHT_INSTANCE_ID)

  return (
    <p>
      Number of light usage: <strong>{context.usageNumber}</strong>
    </p>
  )
}
```

### Making actors communicating

One of the challenges we are all facing using xState is how to make multiple actors communicating between them if they don't have any hierarchical relationship. `xstate-store` helps you facing this challenge using the 
[receptionnist pattern](https://doc.akka.io/docs/akka/current/typed/actor-discovery.html).

For example, you can use the `sendToInstance` function as an action from another service in order to send an event to another actor using its id (reference).

The solution is inspired from the [RFC](https://github.com/statelyai/rfcs/pull/5/files) that the xState team is working on.

```js
const FIRST_LIGHT_INSTANCE_ID = '_FIRST_LIGHT_INSTANCE_ID_'

createInstance(LIGHT_INSTANCE_ID, {
  // machine definition here
})

const SECOND_LIGHT_INSTANCE_ID = '_SECOND_LIGHT_INSTANCE_ID_'
createInstance(SECOND_LIGHT_INSTANCE_ID, {
  // machine definition here and other stuffs
  states: {
    someState: {
      on: {
        EVENT: {
          actions: sendToInstance(FIRST_LIGHT_INSTANCE_ID, { type: 'TOGGLE' })
        }
      }
    }
  }
})
```

## Examples
- [The complete light turn on/off example using react](https://github.com/moh12594/xstate-store/tree/main/example)

## What's next ?

The library can cover a lot of use cases and the most simple ones. But there's some improvements to come for it:

- [x] useInstance
- [x] useDataFromContext
- [x] Add tests to the library
- [ ] Handle spawned machines

And other awesome stuffs.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/moh12594"><img src="https://avatars.githubusercontent.com/u/22661810?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Axel Mohamed SADAT</b></sub></a><br /><a href="https://github.com/moh12594/xstate-store/commits?author=moh12594" title="Code">💻</a> <a href="#infra-moh12594" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/moh12594/xstate-store/commits?author=moh12594" title="Tests">⚠️</a> <a href="#maintenance-moh12594" title="Maintenance">🚧</a> <a href="https://github.com/moh12594/xstate-store/commits?author=moh12594" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!