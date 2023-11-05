
const addAction = (message : string, division : string) => {

    const form = new FormData();
    form.append("message", message);

    const options = {
      method: 'POST',
      headers: {
        'mode': 'no-cors'
      },
      body: form
    };
    
    fetch('https://highly-boss-dodo.ngrok-free.app/generate_suggestion/' + division, options)
      .then(response => response.text())
      .then(response => {
        console.log(response);
      })
      .catch(err => console.error(err));

};

export default addAction;