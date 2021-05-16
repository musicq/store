import { mapTo, tap } from 'rxjs/operators'
import {
  Action,
  combineReducers,
  createEffect,
  createStore,
  ofType
} from '../../index'

type TodoState = Array<{ id: number; text: string; completed: boolean }>

const todoReducer = (state: TodoState = [], action: Action) => {
  switch (action.type) {
    case 'Add':
      return [...state, action.payload]
    case 'Delete':
      return state.filter((s) => s.id !== action.payload)
    default:
      return state
  }
}

const reducers = combineReducers({
  todo: todoReducer,
})

const store = createStore(reducers)

const effect = createEffect((action$) =>
  action$.pipe(
    ofType('@@INIT'),
    tap((s) => console.log('init event', s)),
    mapTo(1)
  )
)

store.registerEffects([effect])

store.state$.subscribe((state) => console.log('[State]: \n', state))

store.dispatch({
  type: 'Add',
  payload: { id: 1, text: 'apple', completed: false },
})

setTimeout(() => {
  store.dispatch({
    type: 'Add',
    payload: { id: 2, text: 'banana', completed: false },
  })
}, 1000)

setTimeout(() => {
  store.dispatch({ type: 'Delete', payload: 2 })
}, 3000)
