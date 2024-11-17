import { useState } from 'react'
import './App.css'
import {  Button  } from './Components/Button'
import { Textbox } from './Components/Textbox'
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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pageone">Page One</Link></li>
            <li><Link to="/pagetwo">Page Two</Link></li>
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





{/* 
    <>
      <Textbox/>
      <Button text={"Analyze"} color={"#ADD8E6"}/>
      <TextInput/>
    </>
  )
}

export default App
*/}