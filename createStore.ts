import {BehaviorSubject, Observable} from 'rxjs'
import {scan, shareReplay, tap} from 'rxjs/operators'

export type Reducer<T> = (state: T, action: Action) => T

export interface Action {
  type: string
  payload?: any
}

export type EffectFn<T> = (
  action$: BehaviorSubject<Action>,
  state$: Observable<T>
) => Observable<Action | any>

const action$ = new BehaviorSubject<Action>({type: '@@INIT'})
const stateChannel$ = new BehaviorSubject({} as any)

export function createStore<T>(reducers: Reducer<T>) {
  const state$ = action$.pipe(
    scan((state: T, action: Action) => reducers(state, action), {} as T),
    shareReplay(1),
    tap(state => stateChannel$.next(state))
  )

  function dispatch(action: Action) {
    action$.next(action)
  }

  return {
    state$,
    dispatch
  }
}

export function createEffect<T>(fn: EffectFn<T>) {
  fn(action$, stateChannel$)
    .pipe(
      tap(action => {
        if (action) {
          action$.next(action)
        }
      })
    )
    .subscribe()
}
