const detailsform = document.querySelector('.needs-validation');

detailsform.addEventListener('submit', function(evt){
    detailsform.classList.add('was-validated');
    evt.preventDefault();
    evt.stopPropagation();
    if (detailsform.checkValidity()) {
        const queryString = window.location.search;
        const formData = new FormData(document.querySelector('#booking-details-form'));
        const urlParams = new URLSearchParams(queryString);
        const body = new URLSearchParams(formData);
        console.log(body.toString());
        fetch('/booking/payment?' + urlParams.toString(), {
            method: 'POST',
            body: body
        }).then(res => {
            if(res.redirected){
                window.location.href = res.url;
            }
        });
    }
});