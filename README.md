# Store

Store is a state manager library which is built on top of [`RxJS`](https://rxjs-dev.firebaseapp.com/guide/overview). It's inspired by [`redux-observable`](https://github.com/redux-observable/redux-observable/), but doesn't depend on redux.

## Philosophy

```text
        dispatch                   monitor
view ---------------> action <----------------> side effects (e.g. async tasks)
 ∧                      |
 |                      |
 |                      |
 | subscribe            |
 |                      |
 |                      |
 |                      ∨
store <-------------- reducer
           update
```

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

It will create a store instance. The store instance contains 2 objects, one is `state$`, which is the source of our state, the other is `dispatch` function, it is used to dispatch an action to update our state.

Next we need to create a reducer to reduce our state.

Create a file `todo.js`

```js
export function todos(state = [], action) {
  switch (action.type) {
    case 'CREATE TODO':
      return [...state, action.payload]
    case 'DELETE TODO':
      return state.filter(t => t.id !== action.payload)
    default:
      return state
  }
}
```

Then, import todo reducer into `store.js` file

```js
import {todos} from './todo'
```

Pass todo reducer as a parameter of `createStore`

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

That looks great! However, how could we dispatch an async action? That's super easy in `store`.

Let's say we need to tell the server the new todo data via HTTP request, then update the store once the server responses.

To achieve that goal, let's create an `effects.js` file to manage our effect functions.

```js
import {createEffect} from '@musicq/store'
import {switchMap} from 'rxjs/operators'
import {from} from 'rxjs'

createEffect((action$, state$) =>
  action$.pipe(
    filter(action => action.type === 'SEND NEW TODO TO SERVER'),
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

Then let change the dispatch action name in our `app.js` file

```js
store.dispatch({type: 'SEND NEW TODO TO SERVER', payload: {id: 1, content: 'Learn how to use @musicq/store'}})
```

Now when we run the `app.js`, it won't update the store immediately, instead, there will be a 1s delay, and then update the store.

So the flow will be

```text
dispatch create action --- 1s later update the store --------- 3s later delete the todo from the store ---->
```

## Types

### `Action`

```typescript
interface Action {
  type: string
  payload?: any
}
```

### `Reducer`
```typescript
type Reducer<T> = (state: T, action: Action) => T
```

### `EffectFn`

```typescript
type EffectFn<T> = (
  action$: BehaviorSubject<Action>,
  state$: Observable<T>
) => Observable<Action | any>
```

## API

### `createStore`

To create a store instance

```typescript
type createStore = <T>(reducers: Reducer<T>) => {state$: Observable<T>, dispatch: (action: Action) => void}
```

### `createEffect`

```typescript
type createEffect = <T>(fn: EffectFn<T>) => void
```

### `combineReducers`

Combine multiple reducers

```typescript
type combineReducers = (reducers: {[key: string]: Reducer<any>}) => Reducer<any>
```

For example, if you have a `todo` reducer and a `user` reducer. You can combine them up and pass it to the `createStore`.

```typescript
function todos(state = [], action) {
  switch (action.type) {
    case 'CREATE TODO':
      return [...state, action.payload]
    default:
      return state
  }
}

function users(state = [], action) {
  switch (action.type) {
    case 'CREATE USER':
      return [...state, action.payload]
    default:
      return state
  }
}

const reducers = combineReducers({
  todos,
  users
})

const store = createStore(reducers)
```

