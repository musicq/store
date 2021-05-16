import { mapTo, tap } from 'rxjs/operators'
import {
  Action,
  combineReducers,
  createEffect,
  createStore,
  ofType
} from '../../index'

type TodoState = Array<{ text: string; completed: boolean }>

const todoReducer = (state: TodoState = [], action: Action) => {
  switch (action.type) {
    case 'Add':
      return [...state, { text: action.payload, completed: false }]
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
    tap((s) => {
      console.log('init event', s)
    }),
    mapTo(1)
  )
)

store.registerEffects([effect])

store.state$.subscribe((state) => console.log('[State]: \n', state))

store.dispatch({ type: 'Add', payload: 'apple' })

setTimeout(() => {
  store.dispatch({ type: 'Add', payload: 'banana' })
}, 1000)
