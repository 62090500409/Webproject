const user_details_modal_content = document.querySelector('#user-more-details-modal .modal-content');

document.querySelectorAll('.user-details-modal-btn').forEach((btn) => {
    const user_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/user-details.ejs/' + user_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                user_details_modal_content.innerHTML = xml.body.innerHTML;
            });
        })
    })
});

document.querySelectorAll('.user-upgrade-btn').forEach((btn) => {
    const user_id = btn.previousElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/admin/upgrade/user=' + user_id, {
            method: 'PUT'
        }).then(res => {
            window.location.href = res.url;
        })
    });
});

document.querySelectorAll('.user-downgrade-btn').forEach((btn) => {
    const user_id = btn.previousElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/admin/downgrade/user=' + user_id, {
            method: 'PUT'
        }).then(res => {
            window.location.href = res.url;
        })
    });
});