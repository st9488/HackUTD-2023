import { useEffect, useState } from 'react';
import Character from './components/Character'
import DialogBox from './components/DialogBox'
import Agent from './components/Agent'
import officeBackground from "./assets/Modern_Office_Revamped/OfficeBackground.png";
import agent2 from './assets/User/Agent2_Forward.png';
import agent3 from './assets/User/Agent3_Forward.png';
import agent4 from './assets/User/Agent4_Forward.png';
import agent5 from './assets/User/Agent5_Forward.png';
import agent7 from './assets/User/Agent7_Forward.png';
import agent6 from './assets/User/Agent6_Forward.png';
import agent1 from './assets/User/Agent1_Forward.png';

const height = 795;
const width = 1571;

const modifer = 0.8

interface SpritePageProps {
  setOnGame: (onGame: boolean) => void;
  setKanbanData: (kanbanData : any) => void;
}

const SpritePage = ({setOnGame, setKanbanData}: SpritePageProps) => {

  //macbook dimensions: 636px, 1256px
  //reg dimensions: 795, 1571

  const [speakingWithAgent, setSpeakingWithAgent] = useState(false);
  const [division, setDivision] = useState('');
  const [characterX, setCharacterX] = useState(0);
  const [characterY, setCharacterY] = useState(0);
  const [currentAgent, setCurrentAgent] = useState('');

  let count1 = 0;
  let currDirection1 = 0;
  let count2 = 0;
  let currDirection2 = 0;
  let count3 = 0;
  let currDirection3 = 0;
  

  useEffect(() => {
    setDivision('Marketing');
  }, [])

  return (
    // make a board that is 16:9 resolution
    <div className="sprite-page" style={{backgroundColor: 'burlywood', height: 795*modifer, width: 1571*modifer, position: 'relative'}}>
      <img src={officeBackground} style={{width: '100%', height: '100%', position: 'relative'}}/>
      {speakingWithAgent ? <DialogBox boxWidth={width * modifer} boxHeight={height * modifer} division={division} setSpeakingWithAgent={setSpeakingWithAgent}/> : null}
      <Character startX={100} startY={650} currentlySpeaking={speakingWithAgent} setCharacterX={setCharacterX} setCharacterY={setCharacterY} setSpeakingWithAgent={setSpeakingWithAgent}/>
      <Agent name="Research" sprite={"hi"} startX={100} startY={200} movement={1} characterX={characterX} characterY={characterY} speakingWithAgent={speakingWithAgent} setCurrentAgent={setCurrentAgent} forward={agent1}/>
      <Agent name="Finance" sprite={"hi"} startX={550} startY={150} movement={2} characterX={characterX} characterY={characterY} speakingWithAgent={speakingWithAgent} setCurrentAgent={setCurrentAgent} forward={agent2}/>
      <Agent name="HR" sprite={"hi"} startX={1125} startY={200} movement={3} characterX={characterX} characterY={characterY} speakingWithAgent={speakingWithAgent} setCurrentAgent={setCurrentAgent} forward={agent3}/>
      <Agent name="Legal" sprite={"hi"} startX={750} startY={160} movement={1} characterX={characterX} characterY={characterY} speakingWithAgent={speakingWithAgent} setCurrentAgent={setCurrentAgent} forward={agent4}/>
      <Agent name="Marketing" sprite={"hi"} startX={600} startY={530} movement={5} characterX={characterX} characterY={characterY} speakingWithAgent={speakingWithAgent} setCurrentAgent={setCurrentAgent} forward={agent5}/>
      <Agent name="IT" sprite={"hi"} startX={975} startY={510} movement={2} characterX={characterX} characterY={characterY} speakingWithAgent={speakingWithAgent} setCurrentAgent={setCurrentAgent} forward={agent6}/>
      <Agent name="Admin" sprite={"hi"} startX={230} startY={380} movement={4} characterX={characterX} characterY={characterY} speakingWithAgent={speakingWithAgent} setCurrentAgent={setCurrentAgent} forward={agent7}/>
    </div>
  )

}

export default SpritePage;