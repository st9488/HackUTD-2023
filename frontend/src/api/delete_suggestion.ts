

const deleteSuggestion = (message : string) => {

    const form = new FormData();
    form.append("suggestion", message);
    
    const options = {
      method: 'POST',
      headers: {
        'mode': 'no-cors'
      },
      body: form
    };
    
    fetch('https://highly-boss-dodo.ngrok-free.app/delete_suggestion', options)
      .then(response => response.text())
      .then(response => {
        console.log(response);
      })
      .catch(err => console.error(err));

}

export default deleteSuggestion;