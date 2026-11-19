// main.jsx — Entry point of the React app
// This file connects React to the HTML page (the <div id="root">)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// ReactDOM.createRoot finds the <div id="root"> in index.html
// .render(<App />) puts our App component inside it
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
