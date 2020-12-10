# Store

Store is a state manager library which is built on top of RxJS. It's inspired by [`redux-observable`](tttps://github.com/redux-observable/redux-observable/), but doesn't depend on redux.

## Installation

Using `npm`

```shell
npm install @musicq/store
```

or using `yarn`

```shell
yarn add @musciq/store
```

## Usage

First of all, we need to create a global store instance using `createStore` function.

Create a **store.js** file and append the below code.

```js
import {createStore} from '@musicq/store'

export const store = createStore()
```

It will create a store instance. It contains 2 objects, one is `state$`, which is the source of our state, the other is `dispatch` function, to dispatch an action to update our state.

Next we need to create some reducers to reduce our state.

Create a file `todo.js`

```js
export function todos(state = [], action) {
  switch (action.type) {
    case 'CREATE TODO':
      return [...state, action.payload]
    case 'DELETE TODO':
      return state.filter(t => t.id !== action.payload)
    case 'UPDATE TODO':
      return state.map(t => t.id === action.payload.id ? action.payload : t)
    default:
      return state
  }
}
```

Then, import todo reduces into `store.js` file

```js
import {todos} from './todo'
```

and pass todo reduce as a parameter of `createStore`

```js
export const store = createStore(todos)
```

Everything is ready, let's play with it!

Create a `app.js` file.

```js
import {store} from 'store'

store.state$.subscribe(state => console.log(state))

store.dispatch({type: 'CREATE TODO', payload: {id: 1, content: 'Learn how to use @musicq/store'}})

setTimeout(() => {
    store.dispatch({type: 'DELETE TODO', payload: 1})
}, 3000)
```

That looks great! However, how could we dispatch an async action? That's super easy in @musicq/store.

Let's say we need to tell the server the new todo data via HTTP request, then update the store once the server responses.

To achieve that goal, let's create an `effects.js` file to manage our effect functions.

```js
import {createEffect} from '@musicq/store'
import {switchMap} from 'rxjs/operators'
import {from} from 'rxjs'

createEffect((action$, state$) =>
  action$.pipe(
    filter(action => action.type === 'CREATE TODO'),
    switchMap(action =>
      // mock communication with server 
      from(new Promise(resolve => {
        setTimeout(() => resolve(action.payload), 1000)
      }))
    ),
    // Dispatch an action
    map(res => ({type: 'CREATE TODO', payload: res}))
  )
)
```

Now, let's import our effects into `store.js` file to let it run.

```js
import './effects.js'
```

Now when we dispatch the `CREATE TODO` action, it won't update the store immediately, instead, there will be a 1s delay, and then update the store.

So the flow will be

```text
dispatch create todo action --- 1s later update the store --------- 3s later delete the todo from store ---->
```
