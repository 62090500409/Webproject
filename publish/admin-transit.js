const transit_filter = document.querySelector('input#transit-filter');
const transit_table = document.querySelector('#transit-table');

transit_filter.addEventListener('input', (evt) => {
    const row = transit_table.querySelectorAll('tbody tr');
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


const new_transit_form = document.querySelector('#new-transit-form');
const transit_setup = (parent) => {
    const airline = parent.querySelector('#transit-airline');
    const transitclass = parent.querySelector('#transit-class');

    airline.addEventListener('change', function(evt){
        let transits = parent.querySelectorAll(".transit-detail");
    
        transits.forEach(function(transit){
            let departure_from = transit.querySelector('.transit-departure-from');
            let arrival_to = transit.querySelector('.transit-arrival-to');
            let flight = transit.querySelector('.flight-list');
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
                        });
                    });
                });
            }
        });
    });
    parent.querySelector('#transit-class').addEventListener('change', function(evt){
        let transits = parent.querySelectorAll(".transit-detail");
    
        transits.forEach(function(transit){
            let departure_from = transit.querySelector('.transit-departure-from');
            let arrival_to = transit.querySelector('.transit-arrival-to');
            let flight = transit.querySelector('.flight-list');
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
                        });
                    });
                });
            }
        });
    });
}

transit_setup(new_transit_form);

function updatelast(parent){
    const airline = parent.querySelector('#transit-airline');
    const transitclass = parent.querySelector('#transit-class');
    let transits = parent.querySelectorAll(".transit-detail");
    let n = transits.length - 1;
    const departure_from = transits[n].querySelector('.transit-departure-from');
    const arrival_to = transits[n].querySelector('.transit-arrival-to');
    const flight = transits[n].querySelector('.flight-list');

    flight.name = "flight[" + n + "]";
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
                        let utc_fsym = '';
                        let utc_tsym = '';
                        newoption.value = list._id;
                        if(list.from.city.UTC >= 0) utc_fsym = '+';
                        if(list.to.city.UTC >= 0) utc_tsym = '+';
                        newoption.innerHTML =   list.airline.name + " " +
                                                list.name + " [" + 
                                                list.departuretime + "(UTC" + utc_fsym +
                                                list.from.city.UTC + ")>" +
                                                list.arrivaltime + "(UTC" + utc_tsym +
                                                list.from.city.UTC + ")]";
                        flight.appendChild(newoption);
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
                        let utc_fsym = '';
                        let utc_tsym = '';
                        newoption.value = list._id;
                        if(list.from.city.UTC >= 0) utc_fsym = '+';
                        if(list.to.city.UTC >= 0) utc_tsym = '+';
                        newoption.innerHTML =   list.airline.name + " " +
                                                list.name + " [" + 
                                                list.departuretime + "(UTC" + utc_fsym +
                                                list.from.city.UTC + ")>" +
                                                list.arrivaltime + "(UTC" + utc_tsym +
                                                list.to.city.UTC + ")]";
                        flight.appendChild(newoption);
                    });
                });
            });
        }
    });
}

updatelast(new_transit_form);

const trasit_detail = new_transit_form.querySelector(".transit-detail").cloneNode(true);

new_transit_form.querySelector("button#append-transit").addEventListener('click', function(evt){
    let transits = new_transit_form.querySelectorAll(".transit-detail");
    let n = transits.length - 1;
    if(n >= 3) return;
    transits[n].parentElement.insertBefore(trasit_detail.cloneNode(true), this.parentElement);
    updatelast(new_transit_form);
});

new_transit_form.querySelector("button#deppend-transit").addEventListener('click', function(evt){
    let transits = new_transit_form.querySelectorAll(".transit-detail");
    let n = transits.length - 1;
    if(n <= 0) return;
    transits[n].remove();
});

const transit_edit_modal_content = document.querySelector('#transit-edit-modal .modal-content');

document.querySelectorAll('.transit-edit-modal-btn').forEach((btn) => {
    const transit_id = btn.nextElementSibling.value;
    btn.addEventListener('click', (evt) => {
        fetch('/transit-edit.ejs/' + transit_id, {
            method: 'GET'
        }).then(res => {
            res.text().then(result => {
                const xml = new DOMParser().parseFromString(result, 'text/html');
                // console.log(xml);
                transit_edit_modal_content.innerHTML = xml.body.innerHTML;
                transit_setup(transit_edit_modal_content);
                updatelast(transit_edit_modal_content);
                transit_edit_modal_content.querySelector("button#append-transit").addEventListener('click', function(evt){
                    let transits = transit_edit_modal_content.querySelectorAll(".transit-detail");
                    let n = transits.length - 1;
                    if(n >= 3) return;
                    transits[n].parentElement.insertBefore(trasit_detail.cloneNode(true), this.parentElement);
                    updatelast(transit_edit_modal_content);
                });
                
                transit_edit_modal_content.querySelector("button#deppend-transit").addEventListener('click', function(evt){
                    let transits = transit_edit_modal_content.querySelectorAll(".transit-detail");
                    let n = transits.length - 1;
                    if(n <= 0) return;
                    transits[n].remove();
                });
            });
        })
    })
});