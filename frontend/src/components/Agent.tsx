import { useEffect, useState } from 'react';
import user_forward from '../assets/User/User_Forward.png';
import user_backward from '../assets/User/User_Backwards.png';
import agent2_forward from '../assets/User/Agent2_Forward.png';
import Character from './Character';
import { set } from 'lodash';

interface CharacterProps {
    name: string;
    sprite: string;
    startX: number;
    startY: number;
    movement: number;
    characterX: number;
    characterY: number;
    forward: string;
    speakingWithAgent: boolean;
    setCurrentAgent: (agent: string) => void;
}

const modifier = 0.8
const directions = ['forward', 'backward', 'left', 'right'];
const directionImages = [user_forward, user_backward, user_backward, user_backward];
const userYOffset = 0;
const userXOffset = 0;
const height = (796*modifier)/2;
const width = (1570*modifier)/4;
const walkableHeight = height + userYOffset;
const walkableWidth = width + userXOffset;
const spriteCloseby = 0

const Agent = ({name, sprite, startX, startY, movement, characterX, characterY, speakingWithAgent, setCurrentAgent, forward} : CharacterProps) => {

    const [agentX, setAgentX] = useState(startX + userXOffset);
    const [agentY, setAgentY] = useState(startY + userYOffset);
    const [direction, setDirection] = useState('forward');
    const [count, setCount] = useState(0);
    const [currDirection, setCurrDirection] = useState(0);
    const [imTalkin, setImTalkin] = useState(false);
    
    const userImage = directionImages[directions.indexOf(direction)];

    const walkingMovement1 = () => {
        if (currDirection == 0){
            setAgentX(agentX + 6);
            setCount(count+1)
            if (count >= 4){
                setCurrDirection(1)
                setCount(0)
            } 
        } else if (currDirection == 1) {
            setAgentX(agentX - 6);
            setCount(count+1)
            if (count >= 4){
                setCurrDirection(0)
                setCount(0)
            }
        }
    }

    const walkingMovement2 = () => {
        if (currDirection == 0){
            setAgentY(agentY + 6);
            setCount(count+1)
            if (count == 2){
                setCurrDirection(1)
                setCount(0)
            } 
        } else if (currDirection == 1) {
            setAgentY(agentY - 6);
            setCount(count+1)
            if (count == 2){
                setCurrDirection(0)
                setCount(0)
            }
        }
    }

    const walkingMovement3 = () => {
        if (currDirection == 0){
            if (count == 0){
                setAgentX(agentX + 10);
                setCount(count+1)
                setCurrDirection(1)
            }
            if (count == 2){
                setAgentX(agentX - 10);
                setCount(count+1)
                setCurrDirection(1)
            }
        } 
        if (currDirection == 1){
            if (count == 1){
                setAgentY(agentY + 10);
                setCount(count+1)
                setCurrDirection(0)
            }
            if (count == 3){
                setAgentY(agentY - 10);
                setCount(0)
                setCurrDirection(0)

            }
        }
    }

    const walkingMovement4 = () => {
        if (currDirection == 0){
            if (count == 0){
                setAgentX(agentX + 7)
                setCount(count + 1)
            } else if (count == 1){
                setAgentX(agentX - 7)
                setCount(0)

            }
            
        }
    }

    const walkingMovement5 = () => {
        if (currDirection == 0){
            if (count == 0){
                setAgentX(agentX + 9);
                setCount(count+1)
            }
           else if (count == 1){
                setAgentX(agentX + 9);
                setCount(count+1)
            } else if (count == 2){
                setAgentX(agentX - 9);
                setCount(count+1)
            } else if (count == 3){
                setAgentX(agentX - 9);
                setCount(count+1)
                setCurrDirection(1)
            }
        } else if (currDirection == 1) {
            if (count == 4){
                setAgentY(agentY - 7);
                setCount(count+1)
            } else if (count == 5){
                setAgentY(agentY + 7);
                setCount(count+1)
                setCurrDirection(0)
                setCount(0)
            } 
            
        }
    }

    const checkSpriteCloseby = () => {
        
    //    console.log(agentX + "-" + characterX + ">= -100 && " + agentX + "-" + characterX + "<= 100")
        if ((agentX - characterX >= -100) && (agentX - characterX <= 100) ){
            // console.log(agentY + "-" + characterY + ">= -100 && " + agentY + "-" + characterY + "<= 100")
            if ((agentY - characterY >= -100) && (agentY - characterY <= 100) ){
                // console.log("Closeby")
                return true
            } else {return false}
        } else {return false}
    }
    

    useEffect(() => {
        setTimeout(() => {
            if (!checkSpriteCloseby() && !speakingWithAgent) {
                console.log(speakingWithAgent)
                switch (movement){
                    case 1:
                        walkingMovement1();
                        break;
                    case 2:
                        walkingMovement2();
                        break;
                    case 3:
                        walkingMovement3();
                        break;
                    case 4:
                        walkingMovement4();
                        break;
                    case 5:
                        walkingMovement5();
                        break;
                }              
            } else if (checkSpriteCloseby() && !speakingWithAgent) {
                setCurrentAgent(name);
            }        
        }, 150);
    }, [characterX, characterY, agentX, agentY]);


    return (
        
        <img src={forward} style={{position: 'absolute', 'top': agentY, 'left': agentX}}/>
            
        
        
    )

}

export default Agent;