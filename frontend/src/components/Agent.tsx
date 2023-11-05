import { useEffect, useState } from 'react';
import user_forward from '../assets/User/User_Forward.png';
import user_backward from '../assets/User/User_Backwards.png';
import Character from './Character';

interface CharacterProps {
    name: string;
    sprite: string;
    startX: number;
    startY: number;
    movement: number;
    characterX: number;
    characterY: number;
}

const modifier = 0.8
const directions = ['forward', 'backward', 'left', 'right'];
const directionImages = [user_forward, user_backward, user_backward, user_backward];
const userYOffset = -60;
const userXOffset = 0;
const height = (796*modifier)/2;
const width = (1570*modifier)/4;
const walkableHeight = height + userYOffset;
const walkableWidth = width + userXOffset;
let currDirection = 0
let count = 0
const spriteCloseby = Character

const Agent = ({name, sprite, startX, startY, movement, characterX, characterY} : CharacterProps) => {

    const [agentX, setAgentX] = useState(startX + userXOffset);
    const [agentY, setAgentY] = useState(startY + userYOffset);
    const [direction, setDirection] = useState('forward');
    const [currentKey, setCurrentKey] = useState('');
    
    const userImage = directionImages[directions.indexOf(direction)];



    const walkingMovement1 = () => {

        if (currDirection == 0){
            setAgentX(agentX + 20);
            count = count + 1
            if (count == 4){
                currDirection = 1;
                count = 0
            } 
        } else if (currDirection == 1) {
            setAgentX(agentX - 20);
            count = count + 1
            if (count == 4){
                currDirection = 0;
                count = 0
            }
        }
    }

    const walkingMovement2 = () => {
        if (currDirection == 0){
            setAgentX(agentX + 20);
            count = count + 1
            if (count == 4){
                currDirection = 1;
                count = 0
            } 
        } else if (currDirection == 1) {
            setAgentX(agentX - 20);
            count = count + 1
            if (count == 4){
                currDirection = 0;
                count = 0
            }
        }
    }

    const walkingMovement3 = () => {
        if (currDirection == 0){
            setAgentX(agentX + 20);
            count = count + 1
            if (count == 4){
                currDirection = 1;
                count = 0
            } 
        } else if (currDirection == 1) {
            setAgentX(agentX - 20);
            count = count + 1
            if (count == 4){
                currDirection = 0;
                count = 0
            }
        }
    }

    const checkSpriteCloseby = () => {
        
       console.log(agentX + "-" + characterX + ">= -100 && " + agentX + "-" + characterX + "<= 100")
        if ((agentX - characterX >= -100) && (agentX - characterX <= 100) ){
            console.log(agentY + "-" + characterY + ">= -100 && " + agentY + "-" + characterY + "<= 100")
            if ((agentY - characterY >= -100) && (agentY - characterY <= 100) ){
                console.log("Closeby")
                return true
            } else {return false}
        } else {return false}
    }
    

    useEffect(() => {
        setTimeout(() => {
            console.log("Sprite is Closeby: " + checkSpriteCloseby())
            if (!checkSpriteCloseby()){
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
            }
        }
        }, 200);
    }, [agentX, agentY, currentKey]);


    return (
        
        <img src={userImage} style={{position: 'absolute', 'top': agentY, 'left': agentX}}/>
            
        
        
    )

}

export default Agent;