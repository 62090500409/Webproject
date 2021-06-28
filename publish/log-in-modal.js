const email = document.querySelector('#email'),
    password = document.querySelector('#password');

email.addEventListener('input', function(evt){
    if(email.validity.typeMismatch && email.value) {
        email.classList.add('is-invalid');
        email.nextElementSibling.textContent = "invalid e-mail";
    } else {
        email.classList.remove('is-invalid');
    }
});

document.querySelector("form#log-in-form").addEventListener('submit', function(evt){
    evt.preventDefault();
    if(this.checkValidity()){
        const data = new URLSearchParams(new FormData(this));
        fetch('/login', {
            method: 'POST',
            body: data
        }).then(res => {
            if (res.redirected) {
                window.location.href = res.url;
            }else {
                res.json().then(result => {
                    if(!result.client){
                        email.classList.add('is-invalid');
                        email.nextElementSibling.textContent = "incorrected e-mail or password";
                        password.classList.add('is-invalid');
                        password.nextElementSibling.textContent = "incorrected e-mail or password";
                    } else if(result.client.role == 'blocked'){
                        email.classList.add('is-invalid');
                        email.nextElementSibling.textContent = "this account is blocked";
                    }
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    if(!email.value){
        email.classList.add('is-invalid');
        email.nextElementSibling.textContent = "fill in e-mail";
    }
    if(!password.value){
        password.classList.add('is-invalid');
        password.nextElementSibling.textContent = "fill in password";
    }
});