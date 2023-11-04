import { useEffect, useState } from 'react';
import user_forward from '../assets/User/User_Forward.png';
import user_backward from '../assets/User/User_Backwards.png';

interface CharacterProps {
    name: string;
    sprite: string;
    startX: number;
    startY: number;
}

const directions = ['forward', 'backward', 'left', 'right'];
const directionImages = [user_forward, user_backward, user_backward, user_backward];
const userYOffset = -60;
const userXOffset = 0;
const height = 796;
const width = 1570;
const walkableHeight = height + userYOffset;
const walkableWidth = width + userXOffset;

const Character = ({name, sprite, startX, startY} : CharacterProps) => {

    const [x, setX] = useState(startX + userXOffset);
    const [y, setY] = useState(startY + userYOffset);
    const [direction, setDirection] = useState('forward');
    const [currentKey, setCurrentKey] = useState('');
    
    const userImage = directionImages[directions.indexOf(direction)];

    useEffect(() => {
        setTimeout(() => {
            if (currentKey === 'ArrowUp') {
                setDirection('backward');
                if ()
                setY(y - 10);
            } else if (currentKey === 'ArrowDown') {
                setDirection('forward');
                setY(y + 10);
            } else if (currentKey === 'ArrowLeft') {
                setDirection('left');
                setX(x - 10);
            } else if (currentKey === 'ArrowRight') {
                setDirection('right');
                setX(x + 10);
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
        <img src={userImage} style={{position: 'absolute', 'top': y, 'left': x}} >
    )

}

export default Character;