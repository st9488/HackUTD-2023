import { useEffect, useState } from 'react';
import Character from './components/Character'
import DialogBox from './components/DialogBox'

const height = 500;
const width = 1000;

const SpritePage = () => {

  const [speakingWithAgent, setSpeakingWithAgent] = useState(true);
  const [division, setDivision] = useState('');

  useEffect(() => {
    setDivision('Marketing');
  }, [])

  return (
    // make a board that is 16:9 resolution
    <div className="sprite-page" style={{backgroundColor: 'burlywood', height: height, width: width, border: 'solid black', position: 'relative'}}>
      {speakingWithAgent ? <DialogBox boxWidth={width} boxHeight={height} division={division} setSpeakingWithAgent={setSpeakingWithAgent}/> : null}
      <Character startX={0} startY={0} currentlySpeaking={speakingWithAgent}/>
    </div>
  )

}

export default SpritePage;