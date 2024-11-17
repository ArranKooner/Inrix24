import { useState } from 'react'
import './App.css'
import {  Button  } from './Components/Button'
import TextInput from './Components/TextInput'

import Home from './Components/home'
import PageOne from './Components/pageone'
import PageTwo from './Components/pagetwo'

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav>
          <ul>
            <li><Link to="/"className="nav-link">Home</Link></li>
            <li><Link to="/pagetwo"className="nav-link">About</Link></li>
          </ul>
        </nav>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pageone" element={<PageOne />} />
          <Route path="/pagetwo" element={<PageTwo />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;