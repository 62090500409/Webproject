const booking_modal_content = document.querySelector('#booking-more-details-modal .modal-content');

document.querySelectorAll('.booking-details-modal-btn').forEach((btn) => {
    const bid = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        console.log(bid);
        fetch('/booking-modal-content.ejs/' + bid, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                console.log(xml);
                booking_modal_content.innerHTML = xml.body.innerHTML;
            });
        })
    })
});