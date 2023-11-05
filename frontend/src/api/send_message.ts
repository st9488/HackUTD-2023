

const sendMessage = async (populateResponse : React.Dispatch<React.SetStateAction<string>>, setConversationState : React.Dispatch<React.SetStateAction<number>>, message : string, division : string) => {

    const form = new FormData();
    form.append("message", message);
    
    const options = {
      method: 'POST',
      headers: {
        'mode': 'no-cors'
      },
      body: form
    };
    
    fetch('https://highly-boss-dodo.ngrok-free.app/send_message/' + division, options)
      .then(response => response.text())
      .then(response => {
        populateResponse(response);
        setConversationState(3);
      })
      .catch(err => console.error(err));

}

export default sendMessage;