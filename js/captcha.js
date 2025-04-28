function checkcaptcha(nextPage) {
    console.log ("Get token fmor google.")
    const token = grecaptcha.getResponse();
    console.log('token: ' + token);

    if (!token) {
        alert('please fill teh reCAPTCHA!');
        return;
    }

    fetch('https://gentle-sky-64c0.redaizoltan.workers.dev', {
        method: 'POST',
        body: JSON.stringify({token}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log('reCAPTCHA check is done:'+JSON.stringify(data));
            if (data.success) {
                submitPage(nextPage);
            } else {
                alert('Yu are not a human based on reCAPTCHA check!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
