import { map } from 'rxjs/operators'
import {
  Action,
  combineReducers,
  createEffect,
  createStore,
  ofType
} from '../../../src'

export type TodoState = Array<{ id: string; text: string; completed: boolean }>

const todosReducer = (state: TodoState = [], action: Action) => {
  switch (action.type) {
    case 'Recover':
      return action.payload
    case 'Add':
      return [...state, action.payload]
    case 'Delete':
      return state.filter((s) => s.id !== action.payload)
    case 'Toggle':
      return state.map((s) =>
        s.id === action.payload ? { ...s, completed: !s.completed } : s
      )
    default:
      return state
  }
}

const reducers = combineReducers({
  todos: todosReducer,
})

export const store = createStore(reducers)

const initEffect = createEffect((action$) =>
  action$.pipe(
    ofType('@@INIT'),
    map(() => {
      const todos = JSON.parse(localStorage.getItem('todos') ?? '[]')
      return { type: 'Recover', payload: todos }
    })
  )
)

const addEffect = createEffect((action$, state$) =>
  action$.pipe(
    ofType('Add'),
    map((action: Action) => {
      const todos = (state$.value as any).todos as TodoState[]

      localStorage.setItem('todos', JSON.stringify([...todos, action.payload]))
    })
  )
)

store.registerEffects([initEffect, addEffect])

store.state$.subscribe((state) => console.log('[State]: \n', state))
