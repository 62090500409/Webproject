document.querySelectorAll('div#aircraftSeats .form-check-input').forEach(function(elem){
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
            seatnumber.value = seatlayout.value = seatpitch = '';
            seatnumber.removeAttribute("name");
            seatlayout.removeAttribute("name");
            seatpitch.removeAttribute("name");
        }
    });
});

let extbag_no = 1;
let extbag_list_inn = document.querySelector('div.extrabaggage-list').innerHTML;

function update_extbaglist_index(){
    let i = 0;
    document.querySelectorAll('div.extrabaggage-list').forEach(function(elem){
        elem.querySelector('input.extbag-weight').setAttribute('name', 'extrabaggage[' + i + '][weight]');
        elem.querySelector('input.extbag-price').setAttribute('name', 'extrabaggage[' + i + '][price]');
        i++;
    });
}

document.querySelector('button.del-extbag-btn').addEventListener('click', function(evt){
    if(extbag_no < 1) evt.preventDefault();
    else {
        this.parentElement.parentElement.remove(this.parentElement);
        update_extbaglist_index();
        extbag_no--;
    }
});

document.querySelector('button#add-extbag-btn').addEventListener('click', function(evt){
    if(extbag_no < 8){
        let new_extbag_list = document.createElement('DIV');
        new_extbag_list.setAttribute('class', 'row mb-3 extrabaggage-list');
        new_extbag_list.innerHTML = extbag_list_inn;
        this.parentElement.parentElement.insertBefore(new_extbag_list, this.parentElement);
        new_extbag_list.querySelector('input.extbag-weight').setAttribute('name', 'extrabaggage[' + extbag_no + '][weight]');
        new_extbag_list.querySelector('input.extbag-price').setAttribute('name', 'extrabaggage[' + extbag_no + '][price]');
        new_extbag_list.querySelector('button.del-extbag-btn').addEventListener('click', function(e){
            if(extbag_no < 1) e.preventDefault();
            else {
                this.parentElement.parentElement.remove(this.parentElement);
                update_extbaglist_index();
                extbag_no--;
            }
        });
        extbag_no++;
    }
});

const aircraft_list = document.querySelector('select#aircraft-list');

document.querySelector('select#airline-list').addEventListener('change', function(evt){
    aircraft_list.innerHTML = '';
    document.querySelector('#facility-field').innerHTML = '';
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
    document.querySelector('#facility-field').innerHTML = '';
    if(this.value != 0) {
        fetch('/database/aircraft/' + this.value, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                let xml = new DOMParser().parseFromString(result, 'text/html');
                document.querySelector('#facility-field').innerHTML = xml.body.innerHTML;
            });
        });
    }
});

const airline = document.querySelector('#transit-airline');
const transitclass = document.querySelector('#transit-class');

airline.addEventListener('change', function(evt){
    let transits = document.querySelectorAll(".transit-detail");

    transits.forEach(function(transit){
        let departure_from = transit.querySelector('.transit-departure-from');
        let arrival_to = transit.querySelector('.transit-arrival-to');
        let flight = transit.querySelector('.flight-list');
        let nseat = transit.querySelector('.seats-number');
        let fetch_condi = !(airline.value == 0 || departure_from.value == 0 || arrival_to.value == 0);
        flight.innerHTML = "<option value='0'>none</option>";

        if(fetch_condi){
            fetch('/database/flight/' +
            'airline=' + airline.value + 
            '&&class=' + transitclass.value + 
            '/from=' + departure_from.value + 
            '&&to=' + arrival_to.value, {
                method: 'GET'
            }).then(res => {
                res.json().then(result => {
                    result.forEach(function(list){
                        let newoption = document.createElement('OPTION');
                        let utc_fsym = '+'; 
                        let utc_tsym = '+';
                        newoption.value = list._id;
                        if(list.from.city.UTC < 0) utc_fsym = '-';
                        if(list.to.city.UTC < 0) utc_tsym = '-';
                        newoption.innerText =   list.airline.name + " " +
                                                list.name + " [" + 
                                                list.departuretime + "(UTC" + utc_fsym +
                                                list.from.city.UTC + ")>" +
                                                list.arrivaltime + "(UTC" + utc_tsym +
                                                list.from.city.UTC + ")]";
                        flight.appendChild(newoption);
                        nseat.value = list.aircraft.seats[transitclass.value].number;
                    });
                });
            });
        }
    });
});

document.querySelector('#transit-class').addEventListener('change', function(evt){
    let transits = document.querySelectorAll(".transit-detail");

    transits.forEach(function(transit){
        let departure_from = transit.querySelector('.transit-departure-from');
        let arrival_to = transit.querySelector('.transit-arrival-to');
        let flight = transit.querySelector('.flight-list');
        let nseat = transit.querySelector('.seats-number');
        let fetch_condi = !(airline.value == 0 || departure_from.value == 0 || arrival_to.value == 0);
        flight.innerHTML = "<option value='0'>none</option>";

        if(fetch_condi){
            fetch('/database/flight/' +
            'airline=' + airline.value + 
            '&&class=' + transitclass.value + 
            '/from=' + departure_from.value + 
            '&&to=' + arrival_to.value, {
                method: 'GET'
            }).then(res => {
                res.json().then(result => {
                    result.forEach(function(list){
                        let newoption = document.createElement('OPTION');
                        let utc_fsym = '+'; 
                        let utc_tsym = '+';
                        newoption.value = list._id;
                        if(list.from.city.UTC < 0) utc_fsym = '-';
                        if(list.to.city.UTC < 0) utc_tsym = '-';
                        newoption.innerText =   list.airline.name + " " +
                                                list.name + " [" + 
                                                list.departuretime + "(UTC" + utc_fsym +
                                                list.from.city.UTC + ")>" +
                                                list.arrivaltime + "(UTC" + utc_tsym +
                                                list.from.city.UTC + ")]";
                        flight.appendChild(newoption);
                        nseat.value = list.aircraft.seats[transitclass.value].number;
                    });
                });
            });
        }
    });
});

function updatelast(){
    let transits = document.querySelectorAll(".transit-detail");
    let n = transits.length - 1;
    const departure_from = transits[n].querySelector('.transit-departure-from');
    const arrival_to = transits[n].querySelector('.transit-arrival-to');
    const flight = transits[n].querySelector('.flight-list');
    const nseat = transits[n].querySelector('.seats-number');

    flight.name = "flight[" + n + "]";
    nseat.name = "seats[" + n + "]";
    departure_from.name = "from[" + n + "]";
    arrival_to.name = "to[" + n + "]";
    transits[n].querySelector('.departure-date').name = "departureDate[" + n + "]";
    transits[n].querySelector('.arrival-date').name = "arrivalDate[" + n + "]";
    transits[n].querySelector('.price-adult').name = "price[" + n + "][adult]";
    transits[n].querySelector('.price-infant').name = "price[" + n + "][infant]";

    departure_from.addEventListener('change', function(evt){
        let fetch_condi = !(airline.value == 0 || departure_from.value == 0 || arrival_to.value == 0);
        flight.innerHTML = "<option value='0'>none</option>";
        if(fetch_condi){
            fetch('/database/flight/' +
            'airline=' + airline.value + 
            '&&class=' + transitclass.value + 
            '/from=' + departure_from.value + 
            '&&to=' + arrival_to.value, {
                method: 'GET'
            }).then(res => {
                res.json().then(result => {
                    result.forEach(function(list){
                        let newoption = document.createElement('OPTION');
                        let utc_fsym = '+';
                        let utc_tsym = '+';
                        newoption.value = list._id;
                        if(list.from.city.UTC < 0) utc_fsym = '-';
                        if(list.to.city.UTC < 0) utc_tsym = '-';
                        newoption.innerText =   list.airline.name + " " +
                                                list.name + " [" + 
                                                list.departuretime + "(UTC" + utc_fsym +
                                                list.from.city.UTC + ")>" +
                                                list.arrivaltime + "(UTC" + utc_tsym +
                                                list.from.city.UTC + ")]";
                        flight.appendChild(newoption);
                        nseat.value = list.aircraft.seats[transitclass.value].number
                    });
                });
            });
        }
    });

    arrival_to.addEventListener('change', function(evt){
        let fetch_condi = !(airline.value == 0 || departure_from.value == 0 || arrival_to.value == 0);
        flight.innerHTML = "<option value='0'>none</option>";
        if(fetch_condi){
            fetch('/database/flight/' +
            'airline=' + airline.value + 
            '&&class=' + transitclass.value + 
            '/from=' + departure_from.value + 
            '&&to=' + arrival_to.value, {
                method: 'GET'
            }).then(res => {
                res.json().then(result => {
                    result.forEach(function(list){
                        let newoption = document.createElement('OPTION');
                        let utc_fsym = '+';
                        let utc_tsym = '+';
                        newoption.value = list._id;
                        if(list.from.city.UTC < 0) utc_fsym = '-';
                        if(list.to.city.UTC < 0) utc_tsym = '-';
                        newoption.innerText =   list.airline.name + " " +
                                                list.name + " [" + 
                                                list.departuretime + "(UTC" + utc_fsym +
                                                list.from.city.UTC + ")>" +
                                                list.arrivaltime + "(UTC" + utc_tsym +
                                                list.to.city.UTC + ")]";
                        flight.appendChild(newoption);
                        nseat.value = list.aircraft.seats[transitclass.value].number
                    });
                });
            });
        }
    });
}

updatelast();
const trasit_detail = document.querySelector(".transit-detail").cloneNode(true);

document.querySelector("button#append-transit").addEventListener('click', function(evt){
    let transits = document.querySelectorAll(".transit-detail");
    let n = transits.length - 1;
    if(n >= 3) return;
    transits[n].parentElement.insertBefore(trasit_detail.cloneNode(true), this.parentElement);
    updatelast();
});

document.querySelector("button#deppend-transit").addEventListener('click', function(evt){
    let transits = document.querySelectorAll(".transit-detail");
    let n = transits.length - 1;
    if(n <= 0) return;
    transits[n].remove();
});