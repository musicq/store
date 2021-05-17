import { pipe } from 'rxjs'
import { filter } from 'rxjs/operators'
import { Action } from '../types'

export function ofType(types: string | string[]) {
  return pipe(
    filter((action: Action) =>
      Array.isArray(types) ? types.includes(action.type) : action.type === types
    )
  )
}
