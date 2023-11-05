import { useEffect, useState } from 'react';
import user_forward from '../assets/User/User_Forward.png';
import user_backward from '../assets/User/User_Backwards.png';

interface CharacterProps {
    startX: number;
    startY: number;
    currentlySpeaking: boolean;
}

const directions = ['forward', 'backward', 'left', 'right'];
const directionImages = [user_forward, user_backward, user_backward, user_backward];
const userYOffset = -60;
const userXOffset = 0;
const height = 500;
const width = 1000;
const walkableHeight = height - 144;
const walkableWidth = width - 50;

const Character = ({startX, startY, currentlySpeaking} : CharacterProps) => {

    const [x, setX] = useState(startX + userXOffset);
    const [y, setY] = useState(startY + userYOffset);
    const [direction, setDirection] = useState('forward');
    const [currentKey, setCurrentKey] = useState('');
    
    const userImage = directionImages[directions.indexOf(direction)];

    useEffect(() => {
        setTimeout(() => {
            if (!currentlySpeaking) {
                if (currentKey === 'ArrowUp') {
                    setDirection('backward');
                    if (y - 8 > userYOffset)
                        setY(y - 8);
                } else if (currentKey === 'ArrowDown') {
                    setDirection('forward');
                    if (y + 8 < walkableHeight)
                        setY(y + 8);
                } else if (currentKey === 'ArrowLeft') {
                    setDirection('left');
                    if (x - 8 > userXOffset)
                        setX(x - 8);
                } else if (currentKey === 'ArrowRight') {
                    setDirection('right');
                    if (x + 8 < walkableWidth)
                        setX(x + 8);
                }
            }
        }, 10);
    }, [x, y, currentKey]);

    document.onkeydown = function (e) {
        switch (e.key) {
            case 'ArrowUp':
                setCurrentKey('ArrowUp');
                break;
            case 'ArrowDown':
                setCurrentKey('ArrowDown');
                break;
            case 'ArrowLeft':
                setCurrentKey('ArrowLeft');
                break;
            case 'ArrowRight':
                setCurrentKey('ArrowRight');
        }
    };

    document.onkeyup = function (e) {
        switch (e.key) {
            case 'ArrowUp':
                if (currentKey === 'ArrowUp') {
                    setCurrentKey('');
                }
                break;
            case 'ArrowDown':
                if (currentKey === 'ArrowDown') {
                    setCurrentKey('');
                }
                break;
            case 'ArrowLeft':
                if (currentKey === 'ArrowLeft') {
                    setCurrentKey('');
                }
                break;
            case 'ArrowRight':
                if (currentKey === 'ArrowRight') {
                    setCurrentKey('');
                }
                break;
        }
    }

    return (
        <img src={userImage} style={{position: 'absolute', 'top': y, 'left': x}} />
    )

}

export default Character;