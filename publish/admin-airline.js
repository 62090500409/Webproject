const new_airline_form = document.querySelector('#new-airline-form');

let extbag_no = 1;
let extbag_list_inn = new_airline_form.querySelector('div.extrabaggage-list').innerHTML;

function update_extbaglist_index(parent){
    let i = 0;
    parent.querySelectorAll('div.extrabaggage-list').forEach(function(elem){
        elem.querySelector('input.extbag-weight').setAttribute('name', 'extrabaggage[' + i + '][weight]');
        elem.querySelector('input.extbag-price').setAttribute('name', 'extrabaggage[' + i + '][price]');
        i++;
    });
}

new_airline_form.querySelector('button.del-extbag-btn').addEventListener('click', function(evt){
    if(extbag_no < 1) return;
    else {
        this.parentElement.parentElement.remove(this.parentElement);
        update_extbaglist_index(new_airline_form);
        extbag_no--;
    }
});

new_airline_form.querySelector('button#add-extbag-btn').addEventListener('click', function(evt){
    if(extbag_no < 8){
        let new_extbag_list = document.createElement('DIV');
        new_extbag_list.setAttribute('class', 'row mb-3 extrabaggage-list');
        new_extbag_list.innerHTML = extbag_list_inn;
        this.parentElement.parentElement.insertBefore(new_extbag_list, this.parentElement);
        new_extbag_list.querySelector('input.extbag-weight').setAttribute('name', 'extrabaggage[' + extbag_no + '][weight]');
        new_extbag_list.querySelector('input.extbag-price').setAttribute('name', 'extrabaggage[' + extbag_no + '][price]');
        new_extbag_list.querySelector('button.del-extbag-btn').addEventListener('click', function(e){
            if(extbag_no < 1) return;
            else {
                this.parentElement.parentElement.remove(this.parentElement);
                update_extbaglist_index(new_airline_form);
                extbag_no--;
            }
        });
        extbag_no++;
    }
});

const airline_edit_modal_content = document.querySelector('#airline-edit-modal .modal-content');
const airline_filter = document.querySelector('input#airline-filter');
const airline_table = document.querySelector('#airline-table');

airline_filter.addEventListener('input', (evt) => {
    const row = airline_table.querySelectorAll('tbody tr');
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

document.querySelectorAll('.airline-edit-modal-btn').forEach((btn) => {
    const airline_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/airline-edit.ejs/' + airline_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                airline_edit_modal_content.innerHTML = xml.body.innerHTML;
                let extbag_no = airline_edit_modal_content.querySelectorAll('.extrabaggage-list').length;

                airline_edit_modal_content.querySelectorAll('button.del-extbag-btn').forEach((btn) => {
                    btn.addEventListener('click', function(evt){
                        if(extbag_no < 1) return;
                        else {
                            this.parentElement.parentElement.remove(this.parentElement);
                            update_extbaglist_index(airline_edit_modal_content);
                            extbag_no--;
                        }
                    });
                });

                airline_edit_modal_content.querySelector('button#add-extbag-btn').addEventListener('click', function(evt){
                    if(extbag_no < 8){
                        let new_extbag_list = document.createElement('DIV');
                        new_extbag_list.setAttribute('class', 'row mb-3 extrabaggage-list');
                        new_extbag_list.innerHTML = extbag_list_inn;
                        this.parentElement.parentElement.insertBefore(new_extbag_list, this.parentElement);
                        new_extbag_list.querySelector('input.extbag-weight').setAttribute('name', 'extrabaggage[' + extbag_no + '][weight]');
                        new_extbag_list.querySelector('input.extbag-price').setAttribute('name', 'extrabaggage[' + extbag_no + '][price]');
                        new_extbag_list.querySelector('button.del-extbag-btn').addEventListener('click', function(e){
                            if(extbag_no < 1) return;
                            else {
                                this.parentElement.parentElement.remove(this.parentElement);
                                update_extbaglist_index(airline_edit_modal_content);
                                extbag_no--;
                            }
                        });
                        extbag_no++;
                    }
                });
            });
        })
    })
});

const new_aircraft_form = document.querySelector('#new-aircraft-form');

new_aircraft_form.querySelectorAll('div#aircraftSeats .form-check-input').forEach(function(elem){
    elem.addEventListener('click', function(evt){
        let seatnumber = this.parentElement.nextElementSibling;
        let seatlayout = seatnumber.nextElementSibling;
        let seatpitch = seatlayout.nextElementSibling;
        if(this.checked === true){
            seatnumber.disabled = seatlayout.disabled = seatpitch.disabled = false;
            seatnumber.name = this.id + '[' + 'number' + ']';
            seatlayout.name = this.id + '[' + 'seatlayout' + ']';
            seatpitch.name = this.id + '[' + 'seatpitch' + ']';
        } else {
            seatnumber.disabled = seatlayout.disabled = seatpitch.disabled = true;
            seatnumber.value = seatlayout.value = seatpitch.value = '';
            seatnumber.removeAttribute("name");
            seatlayout.removeAttribute("name");
            seatpitch.removeAttribute("name");
        }
    });
});

const aircraft_filter = document.querySelector('input#aircraft-filter');
const aircraft_table = document.querySelector('#aircraft-table');

aircraft_filter.addEventListener('input', (evt) => {
    const row = aircraft_table.querySelectorAll('tbody tr');
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

const aircraft_edit_modal_content = document.querySelector('#aircraft-edit-modal .modal-content');

document.querySelectorAll('.aircraft-edit-modal-btn').forEach((btn) => {
    const aircraft_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/aircraft-edit.ejs/' + aircraft_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                aircraft_edit_modal_content.innerHTML = xml.body.innerHTML;
                aircraft_edit_modal_content.querySelectorAll('div#aircraftSeats .form-check-input').forEach(function(elem){
                    elem.addEventListener('click', function(evt){
                        let seatnumber = this.parentElement.nextElementSibling;
                        let seatlayout = seatnumber.nextElementSibling;
                        let seatpitch = seatlayout.nextElementSibling;
                        if(this.checked === true){
                            seatnumber.disabled = seatlayout.disabled = seatpitch.disabled = false;
                            seatnumber.name = this.id + '[' + 'number' + ']';
                            seatlayout.name = this.id + '[' + 'seatlayout' + ']';
                            seatpitch.name = this.id + '[' + 'seatpitch' + ']';
                        } else {
                            seatnumber.disabled = seatlayout.disabled = seatpitch.disabled = true;
                            seatnumber.value = seatlayout.value = seatpitch.value = '';
                            seatnumber.removeAttribute("name");
                            seatlayout.removeAttribute("name");
                            seatpitch.removeAttribute("name");
                        }
                    });
                });
            });
        })
    })
});

const add_aircraft_selected_airline = document.querySelector('#add-aircraft-selected-airline');
const add_selected_aircraft = document.querySelector('#add-selected-aircraft');

add_aircraft_selected_airline.addEventListener('change', (evt) => {
    add_selected_aircraft.innerHTML = "<option value='0'>none</option>";
    if(evt.target.value == 0) return;
    fetch('/database/airline/' + evt.target.value + '/aircraft/nin', {
        method: 'GET'
    }).then(res => { res.json().then(result => {
        // console.log(result);
        result.forEach(aircraft => {
            let aircraft_opt = document.createElement('option');
            aircraft_opt.value = aircraft._id;
            aircraft_opt.textContent = aircraft.model;
            add_selected_aircraft.appendChild(aircraft_opt);
        })
    })})
});