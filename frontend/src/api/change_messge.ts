

const changeMessage = (oldMessage : string, value: boolean, title: string, newMessage: string) => {

    const form = new FormData();
    form.append("suggestion", oldMessage);
    form.append("newcompleted", value.toString());
    form.append("newphase", title)
    form.append("newsuggestion", newMessage);
    
    const options = {
      method: 'POST',
      headers: {
        'mode': 'no-cors'
      },
      body: form
    };
    
    fetch('https://highly-boss-dodo.ngrok-free.app/update_suggestion', options)
      .then(response => response.text())
      .then(response => {
        console.log(response);
      })
      .catch(err => console.error(err));

}

export default changeMessage;