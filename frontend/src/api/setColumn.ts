

const setColumn = (message : string, title : string) => {

    console.log(title);

    const form = new FormData();
    form.append("suggestion", message);
    form.append("newcompleted", "False");
    form.append("newphase", title);
    form.append("newsuggestion", message);
    
    const options = {
      method: 'POST',
      headers: {
        'mode': 'no-cors'
      },
      body: form
    };
    
    fetch('https://highly-boss-dodo.ngrok-free.app/update_suggestion', options)
      .then(response => response.text())
      .catch(err => console.error(err));

}

export default setColumn;