import { Observable, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Action, DispatchFn, EffectFn } from './types'

function isAction(action: any) {
  return action && typeof action === 'object' && action.type
}

export function createEffect<T>(fn: EffectFn<T>) {
  return (
    action$: Subject<Action>,
    state$: Observable<T> & { value: T },
    dispatch: DispatchFn
  ) =>
    fn(action$, state$, dispatch).pipe(
      tap((action) => {
        if (isAction(action)) {
          action$.next(action)
        }
      })
    )
}
