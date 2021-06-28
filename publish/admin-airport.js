const airport_edit_modal_content = document.querySelector('#airport-edit-modal .modal-content');
const airport_filter = document.querySelector('input#airport-filter');
const airport_table = document.querySelector('#airports-table');

airport_filter.addEventListener('input', (evt) => {
    const row = airport_table.querySelectorAll('tbody tr');
    for(let i = 0; i < row.length; i++){
        let show = false;
        let colm = row[i].querySelectorAll('td');
        for(let j = 0; j < colm.length; j++){
            if(evt.target.value.toLowerCase() === colm[j].textContent.substr(0, evt.target.value.length).toLowerCase()){
                show = true;
                break;
            }
        }
        if(show) row[i].removeAttribute('style');
        else row[i].style.display = 'none';
    }
});

document.querySelectorAll('.airport-edit-modal-btn').forEach((btn) => {
    const airport_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/airport-edit.ejs/' + airport_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                airport_edit_modal_content.innerHTML = xml.body.innerHTML;
            });
        })
    })
});