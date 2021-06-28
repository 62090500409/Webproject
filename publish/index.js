import { flightautocomplete, uneditable, addDate, setSwapButton} from './module.js';
// import Cookies from 'js-cookie';

// var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

// console.log(Cookies.get());

const data = () => fetch('/database/city',{method: 'GET'}).then();
const res = await data();
const datalist = await res.json();

// console.log(datalist);

let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function getcurrdate(timezone){
    var currdate = new Date();
    var currday = currdate.toLocaleDateString('en-US', {day: '2-digit', timeZone: timezone});
    var currmonth = currdate.toLocaleDateString('en-US',{month: '2-digit', timeZone: timezone});
    var curryear = currdate.toLocaleDateString('en-US', {year: 'numeric', timeZone: timezone});
    return [curryear, currmonth, currday].join('-');
}

function onewayinit() {
    // console.log(Cookies.get());
    let start_from = document.querySelector("#start-from");
    let to_destination = document.querySelector("#to-destination");
    let swap_button = document.querySelector("#swap-from-to-button");
    let departure_date = document.querySelector("#departure-date");
    departure_date.min = getcurrdate(timezone);
    uneditable(departure_date);   
    flightautocomplete(start_from, datalist);
    flightautocomplete(to_destination, datalist);
    let start_from_id = document.querySelector('#start-from-id');
    let to_destination_id = document.querySelector('#to-destination-id');
    if(Cookies.get('startfromid')) start_from_id.value = Cookies.get('startfromid');
    else start_from_id.value = 0;
    if(Cookies.get('todestinationid')) to_destination_id.value = Cookies.get('todestinationid');
    else to_destination_id.value = 0;
    setSwapButton(swap_button, [start_from, start_from_id], [to_destination, to_destination_id]);
    swap_button.addEventListener("click", function() {
        Cookies.set("startfrom", start_from.value, {expires: 1});
        Cookies.set("startfromid", start_from_id.value, {expires: 1});
        Cookies.set("todestination", to_destination.value, {expires: 1});
        Cookies.set("todestinationid", to_destination_id.value, {expires: 1});
    });
    start_from.addEventListener("blur", function() {
        Cookies.set("startfrom", this.value, {expires: 1});
        Cookies.set("startfromid", start_from_id.value, {expires: 1});
    });
    to_destination.addEventListener("blur", function() {
        Cookies.set("todestination", this.value, {expires: 1});
        Cookies.set("todestinationid", to_destination_id.value, {expires: 1});
    });
    departure_date.addEventListener("change", function() {
        Cookies.set("departuredate", this.value, {expires: 1});
    });
}

function roundtripinit() {
    // console.log(Cookies.get());
    let start_from = document.querySelector("#start-from");
    let to_destination = document.querySelector("#to-destination");
    let swap_button = document.querySelector("#swap-from-to-button");
    let departure_date = document.querySelector("#departure-date");
    let return_date = document.querySelector("#return-date");
    departure_date.min = return_date.min = getcurrdate(timezone);
    uneditable(departure_date);  
    uneditable(return_date); 
    flightautocomplete(start_from, datalist);
    flightautocomplete(to_destination, datalist);
    let start_from_id = document.querySelector('#start-from-id');
    let to_destination_id = document.querySelector('#to-destination-id');
    if(Cookies.get('startfromid')) start_from_id.value = Cookies.get('startfromid');
    else start_from_id.value = 0;
    if(Cookies.get('todestinationid')) to_destination_id.value = Cookies.get('todestinationid');
    else to_destination_id.value = 0;
    setSwapButton(swap_button, [start_from, start_from_id], [to_destination, to_destination_id]);
    swap_button.addEventListener("click", function() {
        Cookies.set("startfrom", start_from.value, {expires: 1});
        Cookies.set("startfromid", start_from_id.value, {expires: 1});
        Cookies.set("todestination", to_destination.value, {expires: 1});
        Cookies.set("todestinationid", to_destination_id.value, {expires: 1});
    });
    start_from.addEventListener("blur", function() {
        Cookies.set("startfrom", this.value, {expires: 1});
        Cookies.set("startfromid", start_from_id.value, {expires: 1});
    });
    to_destination.addEventListener("blur", function() {
        Cookies.set("todestination", this.value, {expires: 1});
        Cookies.set("todestinationid", to_destination_id.value, {expires: 1});
    });
    departure_date.addEventListener("change", function() {
        Cookies.set("departuredate", this.value, {expires: 1});
    });
    return_date.addEventListener("change", function() {
        Cookies.set("returndate", this.value, {expires: 1});
    });
}

function multicitiesinit() {
    // console.log(Cookies.get());
    let start_from = document.querySelectorAll(".start-from");
    let to_destination = document.querySelectorAll(".to-destination");
    let swap_button = document.querySelectorAll(".swap-button");
    let departure_date = document.querySelectorAll(".departure-date");
    let remove_button = document.querySelectorAll(".remove-flight");
    let multicities_origin = document.querySelector('.multi-cities-travel-list').cloneNode(true);
    let add_multicity_button = document.querySelector('button#add-multicity-btn');
    let multicities;
    if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
        multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
    else multicities = Cookies.getJSON("multicities");
    // console.log(multicities);

    const remove_btn_click = (evt) => {
        if(document.querySelectorAll('.multi-cities-travel-list').length <= 2) return;
        
        add_multicity_button.classList.remove('hidden');
        let multicities;
        if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
        else multicities = Cookies.getJSON("multicities");
        let index = parseInt(evt.currentTarget.id.slice(-1));
        document.querySelectorAll('.multi-cities-travel-list')[index].remove();
        multicities.splice(index, 1);
        Cookies.set('multicities', multicities, {expires: 1});

        let start_from = document.querySelectorAll(".start-from");
        let to_destination = document.querySelectorAll(".to-destination");
        let departure_date = document.querySelectorAll(".departure-date");
        let remove_btn = document.querySelectorAll(".remove-flight");
        for(let i = 0; i < start_from.length; i++){
            let start_from_id = start_from[i].parentNode.querySelector('.autocomplete-hidden-input');
            let to_destination_id = to_destination[i].parentNode.querySelector('.autocomplete-hidden-input');
            start_from[i].setAttribute('name', 'multicities[' + i + '][from]');
            start_from[i].setAttribute('id', 'start-from-' + i);
            start_from_id.setAttribute('id', start_from[i].id + '-id');
            start_from_id.setAttribute('name', start_from[i].name + '[_id]');
            to_destination[i].setAttribute('name', 'multicities[' + i + '][to]');
            to_destination[i].setAttribute('id', 'to-destination-' + i);
            to_destination_id.setAttribute('id', to_destination[i].id + '-id');
            to_destination_id.setAttribute('name', to_destination[i].name + '[_id]');
            departure_date[i].setAttribute('name', 'multicities[' + i + '][departuredate]');
            departure_date[i].setAttribute('id', 'departure-date-' + i);
            remove_btn[i].setAttribute('id', 'remove-flight-btn-' + i);
            if(start_from.length < 3) remove_btn[i].disabled = true;
        }
    }

    for(let i = 0; i < departure_date.length; i++){
        departure_date[i].min = getcurrdate(timezone);
        uneditable(departure_date[i]);   
        flightautocomplete(start_from[i], datalist);
        flightautocomplete(to_destination[i], datalist);
        let start_from_id = document.querySelector('#start-from-' + i + '-id');
        let to_destination_id = document.querySelector('#to-destination-' + i + '-id');
        if(multicities[i].startfromid) 
            start_from_id.value = multicities[i].startfromid;
        else start_from_id.value = 0;
        if(multicities[i].todestinationid) 
            to_destination_id.value = multicities[i].todestinationid;
        else to_destination_id.value = 0;
        setSwapButton(swap_button[i], [start_from[i], start_from_id], [to_destination[i], to_destination_id]);
        swap_button[i].addEventListener("click", function() {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            multicities[i].startfrom = start_from[i].value;
            multicities[i].startfromid = start_from_id.value;
            multicities[i].todestination = to_destination[i].value;
            multicities[i].todestinationid = to_destination_id.value;
            Cookies.set('multicities', multicities, {expires: 1});
        });
        departure_date[i].addEventListener("change", function() {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            multicities[i].departuredate = this.value
            Cookies.set('multicities', multicities, {expires: 1});
        });
        start_from[i].addEventListener("blur", function() {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            multicities[i].startfrom = this.value;
            multicities[i].startfromid = start_from_id.value;
            Cookies.set('multicities', multicities, {expires: 1});
        });
        to_destination[i].addEventListener("blur", function() {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            multicities[i].todestination = this.value;
            multicities[i].todestinationid = to_destination_id.value
            Cookies.set('multicities', multicities, {expires: 1});
        });
        remove_button[i].addEventListener('click', remove_btn_click);
    }

    add_multicity_button.addEventListener('click', function(evt) {
        let n = document.querySelectorAll('.multi-cities-travel-list').length;
        if(n >= 7) return;

        let multicities;
        if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
        else multicities = Cookies.getJSON("multicities");
        let multicities_clone = multicities_origin.cloneNode(true);
        let multicities_last = document.querySelectorAll('.multi-cities-travel-list')[n - 1];
        let add_multicity = document.querySelector('#add-multicity');
        const new_start_from = multicities_clone.querySelector('.start-from');
        const new_to_destination = multicities_clone.querySelector('.to-destination');
        const new_to_swap_btn = multicities_clone.querySelector('.swap-button');
        const new_departuredate = multicities_clone.querySelector('.departure-date');
        const new_remove_btn = multicities_clone.querySelector('.remove-flight');
        
        multicities_last.parentNode.insertBefore(multicities_clone, add_multicity);
        new_start_from.setAttribute('name', 'multicities[' + n + '][from]');
        new_start_from.setAttribute('id', 'start-from-' + n);
        new_to_destination.setAttribute('name', 'multicities[' + n + '][to]');
        new_to_destination.setAttribute('id', 'to-destination-' + n);
        new_departuredate.setAttribute('name', 'multicities[' + n + '][departuredate]');
        new_departuredate.setAttribute('id', 'departure-date-' + n);
        new_remove_btn.setAttribute('id', 'remove-flight-btn-' + n);
        new_departuredate.value = addDate(multicities_last.querySelector('.departure-date').value, 7);
        flightautocomplete(new_start_from, datalist);
        flightautocomplete(new_to_destination, datalist);
        const new_start_from_id = document.querySelector('#start-from-' + n + '-id');
        const new_to_destination_id = document.querySelector('#to-destination-' + n + '-id');
        new_start_from.value = multicities_last.querySelector('.to-destination').value;
        new_start_from_id.value = multicities_last.querySelector('#to-destination-' + (n - 1) + '-id').value;
        new_to_destination.value = '';
        new_to_destination_id.value = 0;
        uneditable(new_departuredate);
        setSwapButton(new_to_swap_btn,[new_start_from, new_start_from_id], [new_to_destination, new_to_destination_id]);
        multicities.push({
            departuredate: new_departuredate.value,
            startfrom: new_start_from.value,
            startfromid: new_start_from_id.value,
            todestination: new_to_destination.value,
            todestinationid: new_to_destination_id.value
        });
        // console.log(multicities);
        Cookies.set('multicities', multicities, {expires: 1});
        new_to_swap_btn.addEventListener("click", function(evt) {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
                multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            let i = parseInt(evt.currentTarget.id.slice(-1));
            multicities[i].startfrom = new_start_from.value;
            multicities[i].startfromid = new_start_from_id.value;
            multicities[i].todestination = new_to_destination.value;
            multicities[i].todestinationid = new_to_destination_id.value;
            Cookies.set('multicities', multicities, {expires: 1});
        });
        new_departuredate.addEventListener("change", function(evt) {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            let i = parseInt(evt.currentTarget.id.slice(-1));
            multicities[i].departuredate = this.value
            Cookies.set('multicities', multicities, {expires: 1});
        });
        new_start_from.addEventListener("blur", function(evt) {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            console.log(multicities);
            let i = parseInt(evt.currentTarget.id.slice(-1));
            multicities[i].startfrom = this.value;
            multicities[i].startfromid = new_start_from_id.value;
            Cookies.set('multicities', multicities, {expires: 1});
        });
        new_to_destination.addEventListener("blur", function(evt) {
            let multicities;
            if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
            else multicities = Cookies.getJSON("multicities");
            let i = parseInt(evt.currentTarget.id.slice(-1));
            multicities[i].todestination = this.value;
            multicities[i].todestinationid = new_to_destination_id.value
            Cookies.set('multicities', multicities, {expires: 1});
        });

        new_remove_btn.addEventListener('click', remove_btn_click);

        if(n + 1 > 6) this.classList.add('hidden')
        document.querySelectorAll('.remove-flight').forEach((btn) => {
            let multicities_list = document.querySelectorAll('.multi-cities-travel-list');
            btn.disabled = false;
        });
    });
}

try{
    if(Cookies.get("traveltype") == "One way") onewayinit();
    else if(Cookies.get("traveltype") == "Round Trip") roundtripinit();
    else if(Cookies.get("traveltype") == "Multi Cities") multicitiesinit();
    document.querySelector('form#flight-search-form').addEventListener('submit', (evt) => {
        const hidden_input = document.querySelectorAll('input.autocomplete-hidden-input');
        for(let i = 0; i < hidden_input.length; i++){
            if(hidden_input[i].value == 0) {
                evt.preventDefault();
                break;
            }
        }
    });
} catch(err){
    console.log(err);
    // window.location.reload();
}

document.querySelectorAll(".flight-type-item").forEach(function(item){
    item.addEventListener("click", function(){
        document.querySelectorAll(".flight-type-item").forEach(function(item){
            item.classList.remove('active');
        })
        this.classList.add('active');
        document.querySelector("#travel-type-dropdown").textContent = this.textContent;
        document.querySelector("#travel-type").value = this.textContent;
        Cookies.set("traveltype", this.textContent, {expires: 1});
    });
});

document.querySelectorAll(".flight-class-item").forEach(function(item){
    item.addEventListener("click", function(){
        document.querySelectorAll(".flight-class-item").forEach(function(item){
            item.classList.remove('active');
        })
        this.classList.add('active');
        document.querySelector("#flight-class-dropdown").textContent = this.textContent;
        document.querySelector("#flight-class").value = this.textContent;
        Cookies.set("flightclass", this.textContent, {expires: 1});
    });
});

const traveler_form = document.querySelector('#traveler-form');

traveler_form.addEventListener("click", function(evt){
    let done_btn = document.querySelector('#traveler-done-btn');
    if(evt.target !== done_btn) evt.stopPropagation();
});

const total_traveler = document.querySelector('label#total-traveler');
const inc_btn = document.querySelectorAll('button.traveler-inc-btn');
const traveler_no = document.querySelectorAll('input.traveler-no');
const dec_btn = document.querySelectorAll('button.traveler-dec-btn');

for(let i = 0; i < traveler_no.length; i++){
    inc_btn[i].addEventListener('click', (evt) => {
        let traveler = JSON.parse(Cookies.getJSON('traveler').slice(2));
        let n = total_traveler.innerText;
        let condi = n < 9;
        if(i == 2) condi = n < 9 && traveler_no[i].value < traveler_no[0].value && traveler_no[i].value < 4;
        if(condi){
            traveler_no[i].value++;
            n++; total_traveler.innerText = n;
        };
        if(i === 0) {
            document.querySelector('#traveler-adult').value = traveler_no[i].value;
            traveler.adult = traveler_no[i].value;
            Cookies.set('traveler', 'j:' + JSON.stringify(traveler));
        }
        if(i === 1) {
            document.querySelector('#traveler-child').value = traveler_no[i].value;
            traveler.child = traveler_no[i].value;
            Cookies.set('traveler', 'j:' + JSON.stringify(traveler));
        }
        if(i === 2) {
            document.querySelector('#traveler-infant').value = traveler_no[i].value;
            traveler.infant = traveler_no[i].value;
            Cookies.set('traveler', 'j:' + JSON.stringify(traveler));
        }
    });

    dec_btn[i].addEventListener('click', (evt) => {
        let traveler = JSON.parse(Cookies.getJSON('traveler').slice(2));
        let n = total_traveler.innerText;
        let condi = n > 1 && traveler_no[i].value > 0;
        if(i == 0) condi = n > 1 && traveler_no[i].value > 1;
        if(condi){
            traveler_no[i].value--;
            n--; total_traveler.innerText = n;
        };
        if(i === 0) {
            document.querySelector('#traveler-adult').value = traveler_no[i].value;
            traveler.adult = traveler_no[i].value;
            Cookies.set('traveler', 'j:' + JSON.stringify(traveler));
        }
        if(i === 1) {
            document.querySelector('#traveler-child').value = traveler_no[i].value;
            traveler.child = traveler_no[i].value;
            Cookies.set('traveler', 'j:' + JSON.stringify(traveler));
        }
        if(i === 2) {
            document.querySelector('#traveler-infant').value = traveler_no[i].value;
            traveler.infant = traveler_no[i].value;
            Cookies.set('traveler', 'j:' + JSON.stringify(traveler));
        }
    });
}

document.querySelector("#one-way").addEventListener("click", function(){
    let req = new XMLHttpRequest();
    req.open("POST", "/one-way-sf.ejs", true);
    req.onreadystatechange = function() {
        if(this.readyState == 4 && req.status == 200){
            let search_flight_from = document.querySelector("#search-flight-from");
            search_flight_from.innerHTML = "";
            search_flight_from.innerHTML = req.response;
            onewayinit();
        } 
        else if(this.readyState == 4) {
            search_flight_from.innerHTML = "<div class='col-auto mx-auto my-4 fw-bold'> Error : " + req.status +"</div>";
        }
    }
    req.send();
});

document.querySelector("#round-trip").addEventListener("click", function(){
    let req = new XMLHttpRequest();
    req.open("POST", "/round-trip-sf.ejs", true);
    req.onreadystatechange = function() {
        if(this.readyState == 4 && req.status == 200){
            let search_flight_from = document.querySelector("#search-flight-from");
            search_flight_from.innerHTML = "";
            search_flight_from.innerHTML = req.responseText;
            roundtripinit();
        } 
        else if(this.readyState == 4) {
            search_flight_from.innerHTML = "<div class='col-auto mx-auto my-4 fw-bold'> Error : " + req.status +"</div>";
        }
    }
    req.send();
});

document.querySelector("#multi-cities").addEventListener("click", function(){
    let req = new XMLHttpRequest();
    req.open("POST", "/multi-cities-sf.ejs", true);
    req.onreadystatechange = function() {
        if(this.readyState == 4 && req.status == 200){
            let search_flight_from = document.querySelector("#search-flight-from");
            search_flight_from.innerHTML = "";
            search_flight_from.innerHTML = req.responseText;
            multicitiesinit();
        } 
        else if(this.readyState == 4) {
            search_flight_from.innerHTML = "<div class='col-auto mx-auto my-4 fw-bold'> Error : " + req.status +"</div>";
        }
    }
    req.send();
});