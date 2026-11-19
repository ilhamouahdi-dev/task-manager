// App.jsx — The main component of our Task Manager
//
// REACT CONCEPTS USED HERE (important for interview):
//   - useState  : stores data that can change (tasks, filter, input value)
//   - useEffect : runs code when something changes (here: saves to localStorage)
//   - JSX       : HTML written inside JavaScript
//   - Props     : data passed from parent to child component
//   - map()     : loops over array to create list of elements
//   - filter()  : creates a new array keeping only matching items

import { useState, useEffect } from 'react'

// ============================================================
// TASKCARD COMPONENT
// A separate component for each task card.
// Receives : task object, onToggle function, onDelete function
// ============================================================
function TaskCard({ task, onToggle, onDelete }) {

  // Priority badge color based on priority value
  const priorityClass = {
    haute:   'priority-haute',
    moyenne: 'priority-moyenne',
    basse:   'priority-basse',
  }[task.priority]

  return (
    // If task.done is true, we add the class "task done" → strikethrough style
    <div className={`task ${task.done ? 'done' : ''}`}>

      {/* Circle checkbox */}
      <div className="task-check" onClick={() => onToggle(task.id)}>
        {task.done ? '✓' : ''}
      </div>

      {/* Task content */}
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={`priority ${priorityClass}`}>{task.priority}</span>
        </div>
      </div>

      {/* Delete button */}
      <button className="btn-delete" onClick={() => onDelete(task.id)}>🗑</button>
    </div>
  )
}


// ============================================================
// APP COMPONENT (main)
// This is the root component that contains everything
// ============================================================
export default function App() {

  // ---- STATE ----
  // useState(initialValue) returns [value, setterFunction]
  // When you call the setter, React re-renders the component

  // The list of tasks — loaded from localStorage or empty array
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('react-tasks')
    return saved ? JSON.parse(saved) : []
  })

  // The text in the input field
  const [inputValue, setInputValue] = useState('')

  // The selected priority in the dropdown
  const [priority, setPriority] = useState('moyenne')

  // Which filter tab is active : 'all', 'active', 'done', 'haute', etc.
  const [filter, setFilter] = useState('all')

  // ---- EFFECT ----
  // useEffect runs AFTER every render where [tasks] changed
  // Here we use it to save tasks to localStorage automatically
  useEffect(() => {
    localStorage.setItem('react-tasks', JSON.stringify(tasks))
  }, [tasks]) // ← dependency array : only runs when `tasks` changes


  // ---- FUNCTIONS ----

  // ADD a new task
  function addTask() {
    const title = inputValue.trim()
    if (!title) return // don't add if empty

    const newTask = {
      id:       Date.now(),  // unique number using current timestamp
      title,
      priority,
      done:     false,
    }

    // setTasks creates a NEW array (never mutate state directly in React!)
    setTasks([...tasks, newTask])  // spread operator : copies all old tasks + adds new one

    setInputValue('')  // clear the input
  }

  // TOGGLE done/not done
  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, done: !task.done }  // flip the done value
        : task                            // leave others unchanged
    ))
  }

  // DELETE a task
  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))  // keep all EXCEPT this id
  }

  // FILTER the tasks to display
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active')  return !task.done
    if (filter === 'done')    return task.done
    if (filter === 'haute')   return task.priority === 'haute'
    if (filter === 'moyenne') return task.priority === 'moyenne'
    if (filter === 'basse')   return task.priority === 'basse'
    return true  // 'all' : return everything
  })

  // Stats for the counter cards
  const total  = tasks.length
  const active = tasks.filter(t => !t.done).length
  const done   = tasks.filter(t => t.done).length


  // ---- JSX (what gets rendered on screen) ----
  return (
    <div>
      {/* Header */}
      <header>
        <div className="logo">Task<span>Manager</span></div>
      </header>

      <main>
        <h1>Mes <span>Tâches</span></h1>
        <p className="subtitle">Application React — useState, useEffect, localStorage</p>

        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <div className="stat-number blue">{total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat">
            <div className="stat-number yellow">{active}</div>
            <div className="stat-label">En cours</div>
          </div>
          <div className="stat">
            <div className="stat-number teal">{done}</div>
            <div className="stat-label">Terminées</div>
          </div>
        </div>

        {/* Add task form */}
        <div className="form-card">
          <div className="form-title">+ Nouvelle tâche</div>
          <div className="form-row">

            {/* Controlled input : value comes from state, onChange updates state */}
            <input
              type="text"
              placeholder="Titre de la tâche..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />

            {/* Controlled select */}
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="moyenne">Priorité moyenne</option>
              <option value="haute">Priorité haute</option>
              <option value="basse">Priorité basse</option>
            </select>

            <button className="btn-add" onClick={addTask}>Ajouter</button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="filters">
          {['all', 'active', 'done', 'haute', 'moyenne', 'basse'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Toutes' : f === 'active' ? 'En cours' : f === 'done' ? 'Terminées' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📭</div>
              <div>Aucune tâche ici.</div>
            </div>
          ) : (
            // .map() loops over filteredTasks and creates a TaskCard for each one
            // key={task.id} is required by React to track each element
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </main>

      <footer>
        Développé par <span>Ilham Ouahdi</span> · React + Vite · useState · useEffect · localStorage
      </footer>
    </div>
  )
}
