// import Cookies from 'js-cookie';

Array.prototype.insert = function(indx, item){
    this.splice(indx, 0, item);
    return this;
};

let flightschedule = [];
let select_flight_elem = [];
let is_process = false;

function processbarfetch(cookiedata){
    fetch('/process-bar.ejs', {
        method: 'GET'
    }).then(res => {
        res.text().then(result => {
            let processbar = document.querySelector('#flight-process-bar');
            if(processbar){
                processbar.remove();
            }
            let xml = new DOMParser().parseFromString(result, 'text/html');
            const process_btn = xml.body.querySelectorAll('.process-btn');
            const progress_bar = xml.body.querySelector('.progress-bar');
            let n = process_btn.length;
            for(let i = 0; i < n - 1; i++){
                process_btn[i].addEventListener('click', (evt) => {
                    if(process_btn[i].classList.contains('btn-secondary')) return;
                    let width = parseInt(progress_bar.style.width);
                    if(width <= Math.round(i/(n - 1)*100) || is_process) return;
                    is_process = true;
                    let j = flightschedule.length;
                    process_btn[i].removeAttribute('data-bs-original-title');
                    let id = setInterval(() => {
                        if(width <= ((i/(n - 1))*100)){
                            clearInterval(id);
                            is_process = false;
                        } else {
                            if(width == Math.round(j/(n - 1)*100) && j > i){
                                process_btn[j].classList.remove('btn-primary');
                                process_btn[j].classList.add('btn-secondary');
                                process_btn[j].removeAttribute('data-bs-original-title');
                                j--;
                            }
                            width--;
                            progress_bar.style.width = width + '%';
                        }
                    }, 2);
                    flightschedule.splice(i);
                    select_flight_elem.splice(i);
                    flightfetch(cookiedata, i);
                });
            }
            const summary_prebooking = document.querySelector('#summary-prebooking');
            document.querySelector('#page-content-wrapper').insertBefore(xml.body.firstChild, summary_prebooking);
        });
    });
}

function flightfetch(cookiedata, number){
    let data, limit;
    let process_btn = document.querySelectorAll('.process-btn');
    if(cookiedata.type == 'One way'){
        data = oneway_data(cookiedata);
        limit = 1;
    }
    else if(cookiedata.type == 'Round Trip') {
        let isreturn = true;
        if(number == 0) isreturn = false
        data = roundtrip_data(cookiedata, isreturn);
        limit = 2;
    }
    else if(cookiedata.type == 'Multi Cities') {
        limit = process_btn.length - 1;
        if(number < limit) data = multicities_data(cookiedata, number);
    }
    // console.log(number + '?' + limit);
    const flight_search_result = document.querySelector('#flight-search-result');
    flight_search_result.innerHTML = '';
    const spinner_processing = document.querySelector("#spinner-processing");
    spinner_processing.removeAttribute('style');
    if(number >= limit){
        let total_price = 0;
        spinner_processing.style.display = 'none';
        for(let selected of select_flight_elem){
            let selected_btn = selected.querySelector('.select-flight-btn');
            if(selected_btn) selected_btn.remove();
            flight_search_result.appendChild(selected);
            total_price += parseFloat(selected.querySelector('input.total-price-input-hidden').value);
        }
        document.querySelector('#summary-prebooking').firstElementChild.removeAttribute('style');
        document.querySelector('#summary-prebooking-total').innerText = total_price.toFixed(2);
    } else {
        document.querySelector('#summary-prebooking').firstElementChild.style.display = 'none';
        fetch('/flight/search', {
            method: 'POST',
            body: data
        }).then(res => {
            res.text().then(result => {
                let xml = new DOMParser().parseFromString(result, 'text/html');
                spinner_processing.style.display = 'none';
                for(let elem of Array.from(xml.body.children)){
                    flight_search_result.appendChild(elem);
                    transitssetup(elem);
                    elem.querySelector('.select-flight-btn').addEventListener('click', (evt) => {
                        let i = flightschedule.length;
                        flightfetch(cookiedata, i);
                    });
                }
                
                if(lowpsort_radio.checked) {
                    lowpsort();
                } else if(hightpsort_radio.checked) {
                    highpsort();
                }
            });
        });
    }
}

function transitssetup(elem){
    elem.querySelector('.select-flight-btn').addEventListener('click', (evt) => {
        evt.stopPropagation();
        let collape =  elem.querySelector('.flight-collapse');
        var bsCollapse = new bootstrap.Collapse(collape, {
            hide: false
        });
        const progress_bar = document.querySelector('.progress-bar');
        const process_btn = document.querySelectorAll('.process-btn');
        let width = parseInt(progress_bar.style.width);
        let i = flightschedule.length + 1;
        let n = process_btn.length;
        if(is_process|| i >= n) return;
        flightschedule.push(evt.target.nextElementSibling.value);
        select_flight_elem.push(elem);
        // console.log(flightschedule);
        is_process = true;
        var tooltip = new bootstrap.Tooltip(process_btn[i-1], {
            trigger: 'hover'
        });
        process_btn[i - 1].setAttribute('data-bs-original-title', 
            elem.querySelector('.airline-detail span').innerText + '<br><strong>' + elem.querySelector('.total-price').innerText + '</strong><br>'
            + elem.querySelector('.departure-from-iata').innerText + '[' + elem.querySelector('.travel-detail .departure-time').innerText + ']'
            + '<i class="fas fa-plane mx-1"></i>' 
            + elem.querySelector('.arrival-to-iata').innerText + '[' + elem.querySelector('.travel-detail .arrival-time').innerText + ']'
            );
        let id = setInterval(() => {
            if(width >= Math.round((i/(n - 1))*100)){
                clearInterval(id);
                is_process = false;
                process_btn[i].classList.remove('btn-secondary');
                process_btn[i].classList.add('btn-primary');
            } else {
                width++;
                progress_bar.style.width = width + '%';
            }
        }, 2);
    });
}

function bookingconfirm(cookdata){
    let Schedule = new URLSearchParams();
    for(let schedule of flightschedule){
        Schedule.append('flights', schedule);
    }
    Schedule.append('type', cookdata.type);
    Schedule.append('adult', cookdata.traveler.adult);
    Schedule.append('child', cookdata.traveler.child);
    Schedule.append('infant', cookdata.traveler.infant);
    // console.log(Schedule.toString());
    fetch('/booking/details?' + Schedule.toString(), {
        method: 'GET'
    }).then(res => {
        window.location.href = res.url;
    });
}

function initialfetch(){
    const hidden_input = document.querySelectorAll('input.autocomplete-hidden-input');
    // console.log(hidden_input);
    for(let i = 0; i < hidden_input.length; i++){
        if(hidden_input[i].value == 0) {
            return;
        }
    };
    let data, cookiedata = {};
    cookiedata.type = Cookies.get('traveltype');
    cookiedata.from = Cookies.get("startfromid");
    cookiedata.to = Cookies.get("todestinationid");
    cookiedata.departuredate = Cookies.get("departuredate");
    cookiedata.class = Cookies.get("flightclass").toLowerCase();
    cookiedata.traveler = JSON.parse(Cookies.get("traveler").slice(2));
    if(cookiedata.type == 'One way') {
        data = oneway_data(cookiedata);
    }
    else if(cookiedata.type == 'Round Trip') {
        cookiedata.returndate = Cookies.get("returndate");
        data = roundtrip_data(cookiedata, false);
    }
    else if(cookiedata.type == 'Multi Cities') {
        if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
            cookiedata.multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
        else 
            cookiedata.multicities = Cookies.getJSON("multicities");
        data = multicities_data(cookiedata, 0);
    }
    else {
        return;
    }
    processbarfetch(cookiedata);
    const confirm_prebooking_btn = document.querySelector('#confirm-prebooking');
    const confirmClick = () => {bookingconfirm(cookiedata);}
    confirm_prebooking_btn.removeEventListener('click', confirmClick);
    confirm_prebooking_btn.addEventListener('click', confirmClick);
    const flight_search_result = document.querySelector('#flight-search-result');
    document.querySelector('#summary-prebooking').firstElementChild.style.display = 'none';
    flight_search_result.innerHTML = '';
    const spinner_processing = document.querySelector("#spinner-processing");
    spinner_processing.removeAttribute('style');
    fetch('/flight/search', {
        method: 'POST',
        body: data
    }).then(res => {
        res.text().then(result => {
            let xml = new DOMParser().parseFromString(result, 'text/html');
            spinner_processing.style.display = 'none';
            // console.log(xml);
            for(let elem of Array.from(xml.body.children)){
                flight_search_result.appendChild(elem);
                transitssetup(elem);
                elem.querySelector('.select-flight-btn').addEventListener('click', (evt) => {
                    let i = flightschedule.length;
                    flightfetch(cookiedata, i);
                });
            }
        });
    });
}

initialfetch();

function oneway_data(data){
    const formData = new FormData();
    formData.append("from", data.from);
    formData.append("to", data.to);
    formData.append("departuredate", data.departuredate);
    formData.append("class", data.class);
    formData.append("adult", data.traveler.adult);
    formData.append("child", data.traveler.child);
    formData.append("infant", data.traveler.infant);
    let d = new Date(data.departuredate);
    formData.append("limit", new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()).toISOString().slice(0, 10));
    return new URLSearchParams(formData);
    // const data = new URLSearchParams(formData);
}

function roundtrip_data(data, isreturn){
    const formData = new FormData();
    formData.append("class", data.class);
    formData.append("adult", data.traveler.adult);
    formData.append("child", data.traveler.child);
    formData.append("infant", data.traveler.infant);
    if(isreturn){
        formData.append("from", data.to);
        formData.append("to", data.from);
        formData.append("departuredate", data.returndate);
        let d = new Date(data.returndate);
        formData.append("limit", new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()).toISOString().slice(0, 10));
    } else {
        formData.append("from", data.from);
        formData.append("to", data.to);
        formData.append("departuredate", data.departuredate);
        formData.append("limit", data.returndate);
    }
    return new URLSearchParams(formData);
}

function multicities_data(cookiedata, n){
    const formData = new FormData();
    // let multicities;
    // if(!Array.isArray(Cookies.getJSON("multicities")) && Cookies.getJSON("multicities") != undefined) 
    //     multicities = JSON.parse(Cookies.getJSON("multicities").slice(2));
    // else 
    //     multicities = Cookies.getJSON("multicities");
    formData.append("from", cookiedata.multicities[n].startfromid);
    formData.append("to", cookiedata.multicities[n].todestinationid);
    formData.append("class", cookiedata.class);
    formData.append("departuredate", cookiedata.multicities[n].departuredate);
    formData.append("adult", cookiedata.traveler.adult);
    formData.append("child", cookiedata.traveler.child);
    formData.append("infant", cookiedata.traveler.infant);
    if(n < cookiedata.multicities.length - 1)
        formData.append("limit", cookiedata.multicities[n + 1].departuredate);
    else {
        let d = new Date(cookiedata.multicities[n].departuredate);
        formData.append("limit", new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()).toISOString().slice(0, 10));
    }
    return new URLSearchParams(formData);
}

document.querySelector("form#flight-search-form").addEventListener('submit', function(evt){
    evt.preventDefault();
    flightschedule = [];
    select_flight_elem = [];
    initialfetch();
});

const filter_toggle = document.createElement('button');
filter_toggle.className = "btn btn-outline-secondary btn-sm rounded-circle"
filter_toggle.id = "filter-toggle";
filter_toggle.innerHTML = "<i class='fas fa-filter'></i>";

document.querySelector("#search-options").prepend(filter_toggle);

document.querySelector("#filter-toggle").addEventListener("click",function(evt){
    evt.preventDefault();
    document.querySelector("#wrapper").classList.toggle("toggled");
});

document.querySelector("#filter-close").addEventListener("click",function(evt){
    evt.preventDefault();
    document.querySelector("#wrapper").classList.remove("toggled");
});

const lowpsort_radio = document.querySelector('#lowest-price-radio');
const hightpsort_radio = document.querySelector('#highest-price-radio');

function sortby(queryselector) {
    const flights = document.querySelectorAll(".each-flight-search-result");
    if(flights.length < 2) return;
    const sortedlist = [];
    const parent = flights[0].parentElement;
    sortedlist.push(flights[0]);
    parent.innerHTML = '';
    const spinner_processing = document.querySelector("#spinner-processing");
    spinner_processing.removeAttribute('style');
    for(let i = 1; i < flights.length; i++){
        for(let j = 0; j < sortedlist.length; j++){
            if(parseFloat(sortedlist[j].querySelector(queryselector).value) >= parseFloat(flights[i].querySelector(queryselector).value)){
                console.log(j + ':' + flights[i].querySelector(queryselector).value);
                sortedlist.insert(j, flights[i]);
                break;
            } else if(j == sortedlist.length - 1){
                console.log(j + '::' + flights[i].querySelector(queryselector).value);
                sortedlist.push(flights[i]);
                break;
            }
        }
    }
    return sortedlist;
}

// .total-price-input-hidden

function lowpsort() {
    const sortedlist = sortby('.total-price-input-hidden');
    // console.log(sortedlist);
    if(sortedlist.length < 2) return; 
    const flight_search_result = document.querySelector('#flight-search-result');
    const spinner_processing = document.querySelector("#spinner-processing");
    spinner_processing.style.display = 'none';
    for(let i = 0; i < sortedlist.length ; i++){
        flight_search_result.append(sortedlist[i]);
    }
}

function highpsort() {
    const sortedlist = sortby('.total-price-input-hidden');
    if(sortedlist.length < 2) return; 
    const flight_search_result = document.querySelector('#flight-search-result');
    const spinner_processing = document.querySelector("#spinner-processing");
    spinner_processing.style.display = 'none';
    for(let i = sortedlist.length - 1; i >= 0 ; i--){
        flight_search_result.append(sortedlist[i]);
    }
}

lowpsort_radio.addEventListener("change", (evt) => {
    lowpsort();
});

hightpsort_radio.addEventListener("change", (evt) => {
    highpsort();
});