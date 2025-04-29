function addCaptcha() {
    if(new URLSearchParams(window.location.search).get('captcha') === 'true') {
        $('#captcha-container').append('<div class="g-recaptcha" data-sitekey="6LcYJyQrAAAAAL88WB4-eTm-_LBfVFv8T4NguXha"></div>');
    }
}



function checkAndSubmit (page){
    if(new URLSearchParams(window.location.search).get('captcha') === 'true'){
        checkcaptcha(page)
    } else {
        submitPage(page);
    }
}

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
