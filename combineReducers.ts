import { Action, Reducer } from './types'

interface Reducers {
  [key: string]: Reducer<any>
}

export function combineReducers(reducers: Reducers) {
  const keys = Object.keys(reducers)

  return (state: any, action: Action) => {
    const r: Reducers = {}

    for (const key of keys) {
      r[key] = reducers[key]((state || {})[key], action)
    }

    return r
  }
}
