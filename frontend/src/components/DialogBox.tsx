import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import send_message from '../api/send_message.js';
import '../SpritePage.css';
import addAction from '../api/addAction.js';


interface DialogBoxProps {
    boxWidth: number;
    boxHeight: number;
    division: string
    kanbanData: any;
    setSpeakingWithAgent: (speakingWithAgent: boolean) => void;
}

const dialogWidth = 400;
const dialogHeight = 400;
const agents : {[key: string]: string} = {"Marketing": "Alice", "Admin": "Sally", "Research": "Bob", "Finance": "Jerry", "Legal": "Keith", "IT": "Tim", "HR": "Robert"}

const DialogBox = ({boxWidth, boxHeight, division, kanbanData, setSpeakingWithAgent} : DialogBoxProps) => {

    const useStyle = {
        Button: {
            backgroundColor: '#eee4f7',
            color: 'black',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
            boxShadow: '2px 2px 2px #D0D0D0',
            textTransform: 'none',
            margin: '10px',
          "&:hover": {
            backgroundColor: "#dbbff4",
            color: 'black',
            boxShadow: "'2px 2px 2px #D0D0D0'",
          },
          "&:active": {
            boxShadow: "none",
            backgroundColor: "#3c52b2",
          },
        },
        SecondButton: {
            backgroundColor: '#eee4f7',
            color: 'black',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
            boxShadow: '2px 2px 2px #D0D0D0',
            textTransform: 'none',
            marginTop: 3,
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 10,
          "&:hover": {
            backgroundColor: "#dbbff4",
            color: 'black',
            boxShadow: "'2px 2px 2px #D0D0D0'",
          },
          "&:active": {
            boxShadow: "none",
            backgroundColor: "#3c52b2",
          },
        },
        ThirdButton: {
            backgroundColor: '#eee4f7',
            color: 'black',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
            boxShadow: '2px 2px 2px #D0D0D0',
            textTransform: 'none',
            margin: 1.5,
          "&:hover": {
            backgroundColor: "#dbbff4",
            color: 'black',
            boxShadow: "'2px 2px 2px #D0D0D0'",
          },
          "&:active": {
            boxShadow: "none",
            backgroundColor: "#3c52b2",
          },
        },
      };

    const [conversationState, setConversationState] = useState(0); // [agentName, division, conversation
    const [agentInput, setAgentInput] = useState('');
    const [userInput, setUserInput] = useState('');

    useEffect(() => {
    }, [conversationState]);

    const relativeX = (boxWidth - dialogWidth) / 2;
    const relativeY = (boxHeight - dialogHeight) / 2;

    const agentName = agents[division]

    let displayElement = <></>;
    if (conversationState === 0) {
        displayElement = <>
            <h2 style={{marginLeft: 30,marginRight: 30, marginTop: 30, marginBottom: 20, padding: 10}}>Hi, I'm {agentName} from {division}!</h2>
            <p style={{fontWeight: 500}}>How can I help you today?</p>
            <div style={{display: 'flex', flexDirection: 'column', marginTop: 25, marginLeft: 35, marginRight: 35, marginBottom: 35}}>
            <Button sx={useStyle.Button} onClick={() => setConversationState(1)}>I Want to Ask a Question</Button>
            <Button sx={useStyle.Button} onClick={() => setSpeakingWithAgent(false)}>Never Mind (Cancel Conversation)</Button>
            </div>
        </>
    } else if (conversationState === 1) {
        displayElement = <>
            <h2 style={{margin: 30, padding: 10}}>What would you like to ask?</h2>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <input style={{padding: 5, marginLeft: 30, marginRight: 30, marginBottom: 30}} type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
                <Button sx={useStyle.SecondButton} onClick={async () => {
                    setConversationState(2);
                    await send_message(setAgentInput, setConversationState, userInput, division);
                }}>Submit Question</Button>
            </div>
        </>
    } else if (conversationState === 2) {
        displayElement = <>
            <h2 style={{marginLeft: 30,marginRight: 30, marginTop: 30, marginBottom: 20, padding: 10}}>Thanks for the question!</h2>
            <p>Let me see if I can find an answer for you...</p>
        </>
    } else if (conversationState === 3) {
        displayElement = <>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{height: 120, width: 315, overflowY: 'scroll', marginTop: 20}}>{agentInput}</div>
        </div>
            <div style={{display: 'flex', flexDirection: 'column', margin: 25}}>
            <Button sx={useStyle.ThirdButton} onClick={() => setConversationState(1)}>Ask a Follow Up</Button>
            <Button sx={useStyle.ThirdButton} onClick={() => {
                addAction(userInput, division);
                setSpeakingWithAgent(false)
                }}>Add Action Item</Button>
            <Button sx={useStyle.ThirdButton} onClick={() => setSpeakingWithAgent(false)}>End Conversation</Button>
            </div>
        </>
    }

    const style = {
        backgroundColor: '#F3F3F2',
        border: 'solid black',
        borderRadius: 4,
        width: '400px',
        height: '400px',
        position: 'absolute' as 'absolute',
        left: relativeX, 
        top: relativeY,
        zIndex: 10,
      };

    return (
        <div 
        style={style}
        >
            {displayElement}
        </div>
    );

}

export default DialogBox;