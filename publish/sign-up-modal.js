const sign_in_email = document.querySelector('#sign-up-email'),
    sign_in_password = document.querySelector('#sign-up-password'),
    confirmpass = document.querySelector('#sign-up-confirm-password');

document.querySelectorAll('.eye-btn').forEach(function(button){
    button.addEventListener('click', function(evt){
        if(this.classList.contains('close-eye')){
            this.classList.remove('close-eye');
            this.firstChild.setAttribute('class', 'fas fa-eye');
            this.nextElementSibling.type = 'text';
        } else {
            this.classList.add('close-eye');
            this.firstChild.setAttribute('class', 'fas fa-eye-slash');
            this.nextElementSibling.type = 'password';
        }
    });
});

sign_in_email.addEventListener('input', function(evt){
    if(sign_in_email.validity.typeMismatch && sign_in_email.value) {
        sign_in_email.classList.add('is-invalid');
        sign_in_email.nextElementSibling.textContent = "invalid e-mail";
    } else {
        sign_in_email.classList.remove('is-invalid');
    }
})

sign_in_password.addEventListener('input', function(evt){
    if(sign_in_password.value !== confirmpass.value) {
        sign_in_password.classList.remove('is-valid');
        sign_in_password.classList.add('is-invalid');
        sign_in_password.nextElementSibling.textContent = "be not match with confirm password.";
        confirmpass.classList.remove('is-valid');
        confirmpass.classList.add('is-invalid');
        confirmpass.nextElementSibling.textContent = "be not match with password.";
    }
    else if(sign_in_password.value){
        sign_in_password.classList.remove('is-invalid');
        sign_in_password.classList.add('is-valid');
        confirmpass.classList.remove('is-invalid');
        confirmpass.classList.add('is-valid');
    }

    if(!sign_in_password.value){
        sign_in_password.classList.remove('is-invalid');
    }
    if(!confirmpass.value){
        confirmpass.classList.remove('is-invalid');
    }
});

confirmpass.addEventListener('input', function(evt){
    if(sign_in_password.value !== confirmpass.value) {
        confirmpass.classList.remove('is-valid');
        confirmpass.classList.add('is-invalid');
        confirmpass.nextElementSibling.textContent = "be not match with password.";
        sign_in_password.classList.remove('is-valid');
        sign_in_password.classList.add('is-invalid');
        sign_in_password.nextElementSibling.textContent = "be not match with confirm password.";
    }
    else if(sign_in_password.value){
        confirmpass.classList.remove('is-invalid');
        confirmpass.classList.add('is-valid');
        sign_in_password.classList.remove('is-invalid');
        sign_in_password.classList.add('is-valid');
    }

    if(!confirmpass.value){
        confirmpass.classList.remove('is-invalid');
    }
    if(!sign_in_password.value){
        sign_in_password.classList.remove('is-invalid');
    }
});

document.querySelector("form#sign-up-form").addEventListener('submit', function(evt){
    evt.preventDefault();
    if(this.checkValidity() && sign_in_password.value === confirmpass.value) {
        const data = new URLSearchParams(new FormData(this));
        fetch('/register', {
            method: 'POST',
            body: data
        }).then(res => {
            if (res.redirected) {
                window.location.href = res.url;
            }else {
                res.json().then(result => {
                    if(result.err){
                        sign_in_email.classList.add('is-invalid');
                        sign_in_email.nextElementSibling.textContent = "this e-mail is already registered";
                    }
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
    if(!sign_in_password.value){
        sign_in_password.classList.add('is-invalid');
        sign_in_password.nextElementSibling.textContent = "fill in password";
    }
    if(!confirmpass.value){
        confirmpass.classList.add('is-invalid');
        confirmpass.nextElementSibling.textContent = "fill in confirm password";
    }
    if(!sign_in_email.value){
        sign_in_email.classList.add('is-invalid');
        sign_in_email.nextElementSibling.textContent = "fill in e-mail";
    }

});