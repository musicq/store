import { BehaviorSubject, Observable } from 'rxjs'
import { scan, shareReplay, tap } from 'rxjs/operators'
import { Action, EffectFn, Reducer } from './types'

const identify = <T>(x: T) => x

export function createStore<T>(reducers: Reducer<T> = identify) {
  const action$ = new BehaviorSubject<Action>({ type: '@@INIT' })

  const state$ = action$.pipe(
    scan((state: T, action: Action) => reducers(state, action), {} as T),
    tap((state) => (state$.value = state)),
    shareReplay(1)
  ) as Observable<T> & { value: T }

  function dispatch(action: Action) {
    action$.next(action)
  }

  function registerEffects(effects: EffectFn<T>[]) {
    for (const effect of effects) {
      effect(action$, state$, dispatch).subscribe()
    }
  }

  return {
    state$,
    dispatch,
    registerEffects,
  }
}
