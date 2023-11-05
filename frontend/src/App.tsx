import { useState } from 'react'
import './App.css'
import SpritePage from './SpritePage';
import KanbanPage from './kanban/KanbanPage';

function App() {

  const [onGame, setOnGame] = useState(false);

  return (
    <>
      {onGame ? <SpritePage /> : <KanbanPage />}
    </>

  )
}

export default App
