document.querySelector('#cancel-payment-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    const booking_id = evt.target.nextElementSibling.value;
    fetch('/booking/' + booking_id + '/payment', {
        method: 'DELETE'
    }).then(res => {
        window.location.href = res.url;
    });
});