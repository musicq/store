import { OperatorFunction } from 'rxjs'
import { map } from 'rxjs/operators'

export function select<T, R>(path: string): OperatorFunction<T, R> {
  return map((state) => {
    if (!path) return state

    const props = path.split('.')
    let prop: keyof T
    let res = state

    while (
      (prop = props.shift() as keyof T) !== undefined &&
      res !== undefined
    ) {
      res = res[prop] as any
    }

    return res as any
  })
}
