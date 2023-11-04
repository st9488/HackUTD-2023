import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SpritePage from './SpritePage';
import KanbanPage from './KanbanPage';

function App() {

  return (

    <Router>
    <Routes>
      <Route path="/" element={<SpritePage />}></Route>
      <Route path="/kanban" element={<KanbanPage />} />
      
      
    </Routes>
  </Router>

  )
}

export default App
