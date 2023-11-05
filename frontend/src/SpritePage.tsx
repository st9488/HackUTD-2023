import { useEffect, useState } from 'react';
import Character from './components/Character'
import DialogBox from './components/DialogBox'
import Agent from './components/Agent'
import officeBackground from "./assets/Modern_Office_Revamped/OfficeBackground.png";

const height = 795;
const width = 1571;

const modifer = 0.8

interface SpritePageProps {
  setOnGame: (onGame: boolean) => void;
}

const SpritePage = () => {

  //macbook dimensions: 636px, 1256px
  //reg dimensions: 795, 1571

  const [speakingWithAgent, setSpeakingWithAgent] = useState(false);
  const [division, setDivision] = useState('');
  const [characterX, setCharacterX] = useState(0);
  const [characterY, setCharacterY] = useState(0);
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
      <Character startX={200} startY={600} currentlySpeaking={speakingWithAgent} setCharacterX={setCharacterX} setCharacterY={setCharacterY}/>
      <Agent name="Agent1" sprite={"hi"} startX={100} startY={200} movement={1} characterX={characterX} characterY={characterY}  />
      <Agent name="Agent2" sprite={"hi"} startX={450} startY={200} movement={2} characterX={characterX} characterY={characterY} />
      <Agent name="Agent3" sprite={"hi"} startX={1075} startY={200} movement={3} characterX={characterX} characterY={characterY} />
      <Agent name="Agent4" sprite={"hi"} startX={750} startY={200} movement={1} characterX={characterX} characterY={characterY} />
      <Agent name="Agent5" sprite={"hi"} startX={600} startY={530} movement={5} characterX={characterX} characterY={characterY} />
      <Agent name="Agent6" sprite={"hi"} startX={975} startY={510} movement={2} characterX={characterX} characterY={characterY} />
      <Agent name="Agent4" sprite={"hi"} startX={250} startY={400} movement={4} characterX={characterX} characterY={characterY} />
      
    </div>
  )

}

export default SpritePage;