import { useEffect, useState } from 'react';
import send_message from '../api/send_message.js';

interface DialogBoxProps {
    boxWidth: number;
    boxHeight: number;
    division: string
    setSpeakingWithAgent: (speakingWithAgent: boolean) => void;
}

const dialogWidth = 400;
const dialogHeight = 400;
const agents : {[key: string]: string} = {"Marketing": "Alice"}

const DialogBox = ({boxWidth, boxHeight, division, setSpeakingWithAgent} : DialogBoxProps) => {

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
            <h2>Hi, I'm {agentName} from {division}</h2>
            <p>How can I help you today?</p>
            <button onClick={() => setConversationState(1)}>I want to ask a question</button>
            <button onClick={() => setSpeakingWithAgent(false)}>Never Mind (Cancel Conversation)</button>
        </>
    } else if (conversationState === 1) {
        displayElement = <>
            <h2>What would you like to ask?</h2>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
                <button onClick={async () => {
                    setConversationState(2);
                    await send_message(setAgentInput, setConversationState, userInput, division);
                }}>Submit Question</button>
            </div>
        </>
    } else if (conversationState === 2) {
        displayElement = <>
            <h2>Thanks for the question!</h2>
            <p>Let me see if I can find an answer for you...</p>
        </>
    } else if (conversationState === 3) {
        displayElement = <>
            <p>{agentInput}</p>
            <button onClick={() => setConversationState(1)}>Ask a follow up</button>
            <button onClick={() => setSpeakingWithAgent(false)}>Add action item</button>
            <button onClick={() => setSpeakingWithAgent(false)}>End Conversation</button>
        </>
    }

    return (
        <div 
        style={{position: 'relative', height: '400px', width: '400px', left: relativeX, top: relativeY, border: 'solid black', backgroundColor: "green"}}
        >
            <div style={{position: 'relative', height: '150px', width: '400px', left: 0, top: 0, backgroundColor: 'black'}}/>
            {displayElement}
        </div>
    );

}

export default DialogBox;