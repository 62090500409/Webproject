const new_flight_form = document.querySelector('#new-fligth-form');
const aircraft_list = new_flight_form.querySelector('select#aircraft-list');

new_flight_form.querySelector('select#airline-list').addEventListener('change', function(evt){
    aircraft_list.innerHTML = '';
    new_flight_form.querySelector('#facility-field').innerHTML = '';
    let aircraft_none = document.createElement('OPTION');
    aircraft_none.value = 0;
    aircraft_none.innerText = 'none';
    aircraft_list.appendChild(aircraft_none);
    if(this.value != 0) {
        fetch('/database/airline/' + this.value + '/aircraft', {
            method: 'GET'
            }).then(res => { 
                res.json().then(result => {
                    result.forEach(function(list){
                        let newaircraft_item = document.createElement('OPTION');
                        newaircraft_item.value = list._id;
                        newaircraft_item.innerText = list.model;
                        aircraft_list.appendChild(newaircraft_item);
                    });
                });
            }).catch(err => {
                console.log(err);
        });
    }
});

aircraft_list.addEventListener('change', function(evt){
    new_flight_form.querySelector('#facility-field').innerHTML = '';
    if(this.value != 0) {
        fetch('/database/aircraft/' + this.value, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                let xml = new DOMParser().parseFromString(result, 'text/html');
                new_flight_form.querySelector('#facility-field').innerHTML = xml.body.innerHTML;
            });
        });
    }
});

const flight_edit_modal_content = document.querySelector('#flight-edit-modal .modal-content');
const flight_filter = document.querySelector('input#flight-filter');
const flight_table = document.querySelector('#flight-table');

flight_filter.addEventListener('input', (evt) => {
    const row = flight_table.querySelectorAll('tbody tr');
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

document.querySelectorAll('.flight-edit-modal-btn').forEach((btn) => {
    const flight_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/flight-edit.ejs/' + flight_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                flight_edit_modal_content.innerHTML = xml.body.innerHTML;
                const aircraft_list = flight_edit_modal_content.querySelector('select#aircraft-list');
                flight_edit_modal_content.querySelector('select#airline-list').addEventListener('change', function(evt){
                    aircraft_list.innerHTML = '';
                    flight_edit_modal_content.querySelector('#facility-field').innerHTML = '';
                    let aircraft_none = document.createElement('OPTION');
                    aircraft_none.value = 0;
                    aircraft_none.innerText = 'none';
                    aircraft_list.appendChild(aircraft_none);
                    if(this.value != 0) {
                        fetch('/database/airline/' + this.value + '/aircraft', {
                            method: 'GET'
                            }).then(res => { 
                                res.json().then(result => {
                                    result.forEach(function(list){
                                        let newaircraft_item = document.createElement('OPTION');
                                        newaircraft_item.value = list._id;
                                        newaircraft_item.innerText = list.model;
                                        aircraft_list.appendChild(newaircraft_item);
                                    });
                                });
                            }).catch(err => {
                                console.log(err);
                        });
                    }
                });
                aircraft_list.addEventListener('change', function(evt){
                    flight_edit_modal_content.querySelector('#facility-field').innerHTML = '';
                    if(this.value != 0) {
                        fetch('/database/aircraft/' + this.value, {
                            method: 'GET'
                        }).then(res => {
                            res.text().then(result => {
                                let xml = new DOMParser().parseFromString(result, 'text/html');
                                flight_edit_modal_content.querySelector('#facility-field').innerHTML = xml.body.innerHTML;
                            });
                        });
                    }
                });
            });
        })
    })
});