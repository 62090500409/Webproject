const country_edit_modal_content = document.querySelector('#country-edit-modal .modal-content');
const city_edit_modal_content = document.querySelector('#city-edit-modal .modal-content');

document.querySelectorAll('.country-edit-modal-btn').forEach((btn) => {
    const country_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/country-edit.ejs/' + country_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                country_edit_modal_content.innerHTML = xml.body.innerHTML;
            });
        })
    })
});

document.querySelectorAll('.city-edit-modal-btn').forEach((btn) => {
    const city_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/city-edit.ejs/' + city_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                city_edit_modal_content.innerHTML = xml.body.innerHTML;
            });
        })
    })
});

const country_filter = document.querySelector('input#country-filter');
const country_table = document.querySelector('#country-table');

country_filter.addEventListener('input', (evt) => {
    const row = country_table.querySelectorAll('tbody tr');
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

const city_filter = document.querySelector('input#city-filter');
const city_table = document.querySelector('#city-table');

city_filter.addEventListener('input', (evt) => {
    const row = city_table.querySelectorAll('tbody tr');
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