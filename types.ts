import { Observable, Subject } from 'rxjs'

export type EffectFn<T> = (
  action$: Subject<Action>,
  state$: Observable<T>,
  dispatch: DispatchFn
) => Observable<Action | any>

export interface Action {
  type: string
  payload?: any
}

export type Reducer<T> = (state: T, action: Action) => T

export type DispatchFn = (action: Action) => void
