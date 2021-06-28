/**
 * @param {String} str1
 * @param {String} str2
 * @param {Array} arr
 * @param {Number} indx
 */

Array.prototype.insert = function(indx, item){
    this.splice(indx, 0, item);
    return this;
};

function LCS(str1, str2){
    // direction = [ '<' ,'^' ,'\\' ]
    let M = new Array(str1.length + 1);
    let D = new Array(str1.length + 1);
    for(let i = 0; i <= str1.length; i++){
        M[i] = new Array(str2.length + 1).fill(0);
        D[i] = new Array(str2.length + 1).fill('');
    }

    for(let i = 1; i <= str1.length; i++){
        for(let j = 1; j <= str2.length; j++){
            if(str1.charAt(i - 1) === str2.charAt(j - 1)){
                M[i][j] = M[i - 1][j - 1] + 1;
                D[i][j] = "\\";
            } else {
                if(M[i - 1][j] >= M[i][j - 1]){
                    M[i][j] = M[i - 1][j];
                    D[i][j] = '^';
                } else {
                    M[i][j] = M[i][j - 1];
                    D[i][j] = '<';
                }
            }
        }
    }
    return { lcs: LCSSolve(str1, str2, D), n: M[str1.length][str2.length]};
}

function LCSSolve(str1, str2, arr){
    let lcs_str = "";
    let i = str1.length;
    let j = str2.length;
    while(i > 0 && j > 0){
        if(arr[i][j] == '\\'){
            lcs_str = [str1.charAt(i - 1) ,lcs_str].join('');
            i--; j--;
        } 
        else if(arr[i][j] == '^') {
            i--;
        }
        else if(arr[i][j] == '<') {
            j--;
        }
    }

    return lcs_str;
}

export function flightautocomplete (elem, list){
    var currFocus;
    let elemname = elem.name;
    const elem_input = document.createElement('input');
    elem_input.setAttribute('type', 'hidden');
    elem_input.setAttribute('name', elemname + '[_id]');
    elem_input.setAttribute('id', elem.id + '-id')
    elem_input.setAttribute('class', 'autocomplete-hidden-input');
    if(!elem.nextSibling) elem.parentNode.appendChild(elem_input);
    else elem.parentNode.insertBefore(elem_input, elem.nextSibling);
    elem.setAttribute('name', elemname + '[text]');

    elem.addEventListener('input', function(){
        var acdiv, acitem, val = this.value;
        closeAllList();
        if(!val) {
            elem_input.value = 0;
            return false;
        }
        currFocus = -1;
        acdiv = document.createElement('div');
        acdiv.setAttribute('id', this.id + '-auto-complete-list');
        acdiv.setAttribute('class', 'autocomplete-items');

        this.parentNode.appendChild(acdiv);
        let sort_list = new Array();
        let rest_list = new Array();
        for(let i = 0 ; i < list.length; i++){
            let inner_str = '';
            let subsq = LCS(val.toLowerCase(), list[i].name.slice(0, val.length + 1).toLowerCase());
            if(subsq.n >= Math.ceil(val.length/2)){
                let acitem = document.createElement('div');
                acitem.classList.add('suggest-item');
                let j = 0, k = 0;
                while(j < subsq.lcs.length && k < list[i].name.length){
                    if(subsq.lcs.charAt(j) === list[i].name.toLowerCase().charAt(k)){
                        inner_str += '<strong>' + list[i].name.charAt(k) + '</strong>'; j++; k++;
                    } else {
                        inner_str += list[i].name.charAt(k); k++;
                    }
                }
                inner_str += list[i].name.substr(k);
                acitem.innerHTML = "<span><i class='fas fa-building me-2'></i>" + inner_str + " <strong>(any)</strong></span>";
                acitem.innerHTML += "<input type='hidden' value='" + list[i]._id + "'>";
                acitem.addEventListener('click', function(){
                    elem.value = this.getElementsByTagName('span')[0].innerText;
                    elem_input.value = this.getElementsByTagName('input')[0].value;
                    closeAllList();
                });
                // acdiv.appendChild(acitem);
                let s = 0;
                while(s < sort_list.length){
                    if(subsq.n > sort_list[s].lcs) break; 
                    s++;
                }
                sort_list.insert(s, {
                    lcs: subsq.n,
                    elem: acitem,
                    obj: list[i]
                });
            } else {
                list[i].airports.forEach((airport) => {
                    rest_list.push({
                        airports: airport,
                        city: list[i].name
                    });
                });
            }
        }

        for(let i = 0; i < rest_list.length; i++){
            let inner_str = '';
            let iata_str = '';
            let subsq = LCS(val.toLowerCase(), rest_list[i].airports.shortname.slice(0, val.length*2).toLowerCase());
            let subsq_iata = LCS(val.toLowerCase(), rest_list[i].airports.iata.toLowerCase());
            if(subsq.n >= Math.ceil(val.length/2) || subsq_iata.n >= Math.ceil(val.length/2)){
                let acitem = document.createElement('div');
                acitem.classList.add('suggest-item');
                let j = 0, k = 0;
                while(j < subsq.lcs.length && k < rest_list[i].airports.shortname.length){
                    if(subsq.lcs.charAt(j) === rest_list[i].airports.shortname.toLowerCase().charAt(k)){
                        inner_str += '<strong>' + rest_list[i].airports.shortname.charAt(k) + '</strong>'; j++; k++;
                    } else {
                        inner_str += rest_list[i].airports.shortname.charAt(k); k++;
                    }
                }
                inner_str += rest_list[i].airports.shortname.substr(k);
                j = 0, k = 0;
                while(j < subsq_iata.lcs.length && k < rest_list[i].airports.iata.length){
                    if(subsq_iata.lcs.charAt(j) === rest_list[i].airports.iata.toLowerCase().charAt(k)){
                        iata_str += '<strong>' + rest_list[i].airports.iata.charAt(k) + '</strong>'; j++; k++;
                    } else {
                        iata_str += rest_list[i].airports.iata.charAt(k); k++;
                    }
                }
                iata_str += rest_list[i].airports.iata.substr(k);
                acitem.innerHTML = "<span><i class='fas fa-plane-departure me-2'></i>" + 
                                    inner_str + " <strong>(</strong>" + iata_str + "<strong>)</strong></span>";
                acitem.innerHTML += "<span class='text-muted ms-1'>" + rest_list[i].city + "</span>";
                acitem.innerHTML += "<input type='hidden' value='" + rest_list[i].airports._id + "'>";
                acitem.addEventListener('click', function(){
                    elem.value = this.getElementsByTagName('span')[0].innerText;
                    elem_input.value = this.getElementsByTagName('input')[0].value;
                    closeAllList();
                });
                // acdiv.appendChild(acitem);
                let s = 0;
                while(s < sort_list.length){
                    if(subsq.n > sort_list[s].lcs || subsq_iata > sort_list[s].lcs) break; 
                    s++;
                }
                sort_list.insert(s, {
                    lcs: subsq.n,
                    elem: acitem,
                    obj: rest_list[i].airports
                });
            }
        }

        sort_list.forEach((list) => {
            acdiv.appendChild(list.elem);
            if(list.obj.airports){
                list.obj.airports.forEach((airport => {
                    let acitem = document.createElement('div');
                    acitem.classList.add('suggest-item');
                    acitem.innerHTML = "<span><i class='fas fa-plane-departure ms-3 me-2'></i><strong>" + 
                                        airport.shortname + " (" + airport.iata + ")</strong></span>";
                    acitem.innerHTML += "<span class='text-muted ms-1'>" + list.obj.name + "</span>";
                    acitem.innerHTML += "<input type='hidden' value='" + airport._id + "'>";
                    acitem.addEventListener('click', function(){
                        elem.value = this.getElementsByTagName('span')[0].innerText;
                        elem_input.value = this.getElementsByTagName('input')[0].value;
                        closeAllList();
                    });
                    acdiv.appendChild(acitem);
                }));
            }
        });
    });

    elem.addEventListener('keydown', function(evt){
        var aclist = document.getElementById(this.id + '-auto-complete-list');
        if(aclist) aclist = aclist.getElementsByTagName('div');
        if(evt.keyCode == 40){
            currFocus++;
            addActive(aclist);
        } else if(evt.keyCode == 38){
            currFocus--;
            addActive(aclist);
        } else if(evt.keyCode == 13){
            evt.preventDefault();
            if(currFocus > -1){
                if(aclist) aclist[currFocus].click();
            } else {
                if(aclist) aclist[0].click();
            }
        }
    });

    function addActive(aclist){
        if(!aclist) return false;
        removeActive(aclist);
        if(currFocus >= aclist.length) currFocus = 0;
        if(currFocus < 0) currFocus = (aclist.length - 1);
        aclist[currFocus].classList.add('autocomplete-active');
    }
    function removeActive(aclist){
        for(let i = 0; i < aclist.length; i++){
            aclist[i].classList.remove('autocomplete-active');
        }
    }
    function closeAllList(elmnt){
        var aclist = document.getElementsByClassName('autocomplete-items');
        for(let i = 0; i < aclist.length; i++){
            if(elmnt != aclist[i] && elmnt != elem) {
                aclist[i].parentNode.removeChild(aclist[i]);
            }
        }
    }

    document.addEventListener('click', function(evt){
        closeAllList(evt.target);
    });

    elem.addEventListener('blur',function(){
        var aclist = document.getElementById(this.id + '-auto-complete-list');
        if(aclist) {
            let selected;
            if(currFocus < 0) selected = 0;
            else selected = currFocus;
            aclist = aclist.getElementsByTagName('div');
            if(aclist[selected]) {
                this.value = aclist[selected].getElementsByTagName('span')[0].innerText;
                elem_input.value = aclist[selected].getElementsByTagName('input')[0].value;
            } else {
                elem_input.value = '0';
            }
        }
    });
}

export function uneditable(item){
    item.addEventListener('keydown', function(evt){
        evt.preventDefault();
    })
    item.addEventListener('cut', function(evt){
        evt.preventDefault();
    })
    item.addEventListener('past', function(evt){
        evt.preventDefault();
    })
}

export function addDate(date, offset){
    let newdate = new Date(date);
    newdate.setDate(newdate.getDate() + offset);
    return newdate.toISOString().slice(0,10);
}

export function setSwapButton(swap_button, input_field, another_field){
    if(input_field.length != another_field.length) return false;
    swap_button.addEventListener("click",function(){
        for(let i = 0; i < input_field.length; i++){
            var temp = another_field[i].value;
            another_field[i].value = input_field[i].value;
            if(temp != "") input_field[i].value = temp;
        }
    });
}