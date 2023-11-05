import { useState, useEffect } from 'react'
import SpritePage from './SpritePage';
import KanbanPage from './kanban/KanbanPage';
import './App.css';
import getTasks from './api/get_tasks';

function App() {

  const [onGame, setOnGame] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getTasks(setTasks, setColumns);
  }, []);

  return (
    <>
      <button style={{color: 'black', position: 'fixed', left: 50, top: 50}} onClick={() => setOnGame(!onGame)}>Start Game</button>
      {onGame ? 
        <SpritePage setOnGame={setOnGame} setKanbanData={setTasks}/> 
        : 
        <KanbanPage tasks={tasks} columns={columns} setTasks={setTasks} setColumns={setColumns}/>
      }
    </>

  )
}

export default App
