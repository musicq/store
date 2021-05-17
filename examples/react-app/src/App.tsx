import React, { FormEvent, useEffect, useState } from 'react'
import { select } from '../../../src'
import './App.css'
import { store, TodoState } from './store'

const genId = () => Math.random().toString(16).substr(4)

function App() {
  const [todos, setTodos] = useState<TodoState>([])
  const [todo, setTodo] = useState('')

  useEffect(() => {
    const sub = store.state$
      .pipe(select('todos'))
      .subscribe((todos) => setTodos(todos as TodoState))

    return () => {
      sub.unsubscribe()
    }
  }, [store])

  const onChecked = (id: string) => {
    store.dispatch({ type: 'Toggle', payload: id })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!todo) return

    store.dispatch({
      type: 'Add',
      payload: { id: genId(), text: todo, competed: false },
    })

    setTodo('')
  }

  const onDelete = (id: string) => {
    store.dispatch({ type: 'Delete', payload: id })
  }

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Enter something..."
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />

        <button disabled={!todo} type="submit">
          Add
        </button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label htmlFor={todo.id}>
              <input
                id={todo.id}
                type="checkbox"
                checked={todo.completed ?? false}
                onChange={() => onChecked(todo.id)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
            </label>
            <i role="close" onClick={() => onDelete(todo.id)}>
              X
            </i>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
