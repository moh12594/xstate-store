import { createInstance, useInstance } from 'xstate-store';
import { LIGHT_INSTANCE_ID } from './constant';
import Component1 from './component1';
import Component2 from './component2';
import { assign } from 'xstate';
import './App.css';

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

function App() {
  const [state] = useInstance(LIGHT_INSTANCE_ID)

  return (
    <main className="app-container">
      <div>
        <p>The light is now: <strong>{state.value}</strong></p>
        <Component1 />
        <Component2 />
      </div>
    </main>
  );
}

export default App;
