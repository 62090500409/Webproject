const   express     = require('express'),
        router      = express.Router(),
        passport    = require('passport'),
        dateModule  = require('../modules/date_modules');

const   Country     = require('../models/country'),
        City        = require('../models/city'),
        Airport     = require('../models/airport'),
        Airline     = require('../models/airline'),
        Client      = require('../models/client'),
        Aircraft    = require('../models/aircraft'),
        Flight      = require('../models/flight'),
        Transit     = require('../models/transit'),
        Booking     = require('../models/booking');

function recookie(req, res){
    const newcookie = new Object();
    
    if(!req.cookies.traveltype) {
        newcookie.travelType = "One way";
        res.cookie("traveltype", newcookie.travelType, {maxAge: 60*60*24*1000});
    }
    else newcookie.travelType = req.cookies.traveltype;

    if(!req.cookies.flightclass) {
        newcookie.flightClass = "Economy";
        res.cookie("flightClass", newcookie.flightClass, {maxAge: 60*60*24*1000});
    }
    else newcookie.flightClass = req.cookies.flightclass;

    if(!req.cookies.traveler) {
        newcookie.traveler = {adult: 1, child: 0, infant: 0};
        res.cookie("traveler", newcookie.traveler, {maxAge: 60*60*24*1000});
    }
    else newcookie.traveler = req.cookies.traveler;
    
    if(!req.cookies.startfrom) {
        newcookie.startFrom = "";
        newcookie.startFromID = 0;
    }
    else {
        newcookie.startFrom = req.cookies.startfrom;
        newcookie.startFromID = req.cookies.startfromid;
    }

    if(!req.cookies.todestination) {
        newcookie.toDestination = "";
        newcookie.toDestinationID = 0;
    }
    else {
        newcookie.toDestination = req.cookies.todestination;
        newcookie.toDestinationID = req.cookies.todestinationid;
    }

    if(!req.cookies.departuredate) {
        newcookie.departureDate = getcurrdate(Intl.DateTimeFormat().resolvedOptions().timeZone);
        res.cookie("departuredate", newcookie.departureDate, {maxAge: 60*60*24*1000});
    }
    else newcookie.departureDate = req.cookies.departuredate;

    if(!req.cookies.returndate) {
        newcookie.returnDate = dateModule.addDate(newcookie.departureDate, 7);
        res.cookie("returndate", newcookie.returnDate, {maxAge: 60*60*24*1000});   
    }
    else newcookie.returnDate = req.cookies.returndate;

    if(!req.cookies.multicities) {
        newcookie.multiCities = [
            {
                startfrom: newcookie.startFrom,
                startfromid: newcookie.startFromID,
                todestination: newcookie.toDestination,
                todestinationid: newcookie.toDestinationID,
                departuredate: newcookie.departureDate
            },
            {
                startfrom: newcookie.toDestination,
                startfromid: newcookie.toDestinationID,
                todestination: newcookie.startFrom,
                todestinationid: newcookie.startFromID,
                departuredate: newcookie.returnDate
            }
        ];
        res.cookie("multicities", newcookie.multiCities, {maxAge: 60*60*24*1000});   
    }
    else {
        let multiCity;
        if(!Array.isArray(req.cookies.multicities) && req.cookies.multicities != undefined) 
            multiCity = JSON.parse(req.cookies.multicities);
        else multiCity = req.cookies.multicities;
        newcookie.multiCities = multiCity;
    };

    return newcookie;
}        

router.get('/', function(req, res){
    res.cookie("departuredate", dateModule.getcurrdate(Intl.DateTimeFormat().resolvedOptions().timeZone), {maxAge: 60*60*24*1000});
    res.cookie("traveltype", "One way", {maxAge: 60*60*24*1000});
    res.cookie("flightclass", "Economy", {maxAge: 60*60*24*1000});
    res.cookie("traveler", {adult: 1, child: 0, infant: 0}, {maxAge: 60*60*24*1000});
    res.clearCookie("startfrom");
    res.clearCookie("startfromid");
    res.clearCookie("todestination");
    res.clearCookie("todestinationid");
    res.clearCookie("returndate");
    res.clearCookie("multicities");
    res.redirect('/home');
});

router.get('/home', function(req, res){
    // console.log(req.cookies);
    res.render('index.ejs', recookie(req, res));
});

router.post('/register', function(req, res){
    var newClient = new Client({email: req.body.email});
    Client.register(newClient, req.body.password, function(err, client){
        if(err) {
            console.log(err);
            res.send({err: err});
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'sign up success');
            res.redirect('back');
        });
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, client, info) {
        if(err) {
            console.log(err);
            return res.send({err: err});
        }
        if(!client || client.role === 'blocked') return res.send({err: err, client: client});
        req.logIn(client, function(err){
            if(err){
                console.log(err);
                return res.send({err: err});
            }
            else console.log('log in success');
            req.flash('success', 'log in success');
            return res.redirect('back');
        })
    })(req, res, next);
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'log out success');
    res.redirect('/home');
});

//-------------------< files .ejs >-------------------//

router.get('/one-way-sf.ejs', function(req, res){
    res.render('partials/index/one-way-sf.ejs',{
        startFrom: req.cookies.startfrom,
        toDestination: req.cookies.todestination,
        departureDate: req.cookies.departuredate
    });
});

router.post('/one-way-sf.ejs', function(req, res){
    if(!req.cookies.departuredate) res.cookie("departuredate", dateModule.getcurrdate(Intl.DateTimeFormat().resolvedOptions().timeZone), {maxAge: 60*60*24*1000});
    res.redirect('/one-way-sf.ejs');
});

router.get('/round-trip-sf.ejs', function(req, res){
    res.render('partials/index/round-trip-sf.ejs',{
        startFrom: req.cookies.startfrom,
        toDestination: req.cookies.todestination,
        departureDate: req.cookies.departuredate,
        returnDate: req.cookies.returndate
    });
});

router.post('/round-trip-sf.ejs', function(req, res){
    if(!req.cookies.departuredate){
        let now = dateModule.getcurrdate(Intl.DateTimeFormat().resolvedOptions().timeZone);
        res.cookie("departuredate", now, {maxAge: 60*60*24*1000});
        if(!req.cookies.returndate) 
            res.cookie("returndate", dateModule.addDate(now, 7), {maxAge: 60*60*24*1000});
        else if(new Date(req.cookies.returndate) < new Date(now))
            res.cookie("returndate", dateModule.addDate(now, 7), {maxAge: 60*60*24*1000});
    }else if(!req.cookies.returndate)
        res.cookie("returndate", dateModule.addDate(req.cookies.departuredate, 7), {maxAge: 60*60*24*1000});
    else if(new Date(req.cookies.returndate) < new Date(req.cookies.departuredate))
        res.cookie("returndate", dateModule.addDate(req.cookies.departuredate, 7), {maxAge: 60*60*24*1000});
    
    res.redirect('/round-trip-sf.ejs');
});

router.get('/multi-cities-sf.ejs', function(req, res){
    let multiCity;
    if(!Array.isArray(req.cookies.multicities) && req.cookies.multicities != undefined) 
        multiCity = JSON.parse(req.cookies.multicities);
    else multiCity = req.cookies.multicities;
    // console.log(multiCity);
    res.render('partials/index/multi-cities-sf.ejs',{
        multiCities: multiCity
    });
});

router.post('/multi-cities-sf.ejs', function(req, res){
    if(!req.cookies.multicities) {
        let multiCities = [
            {
                startfrom: req.cookies.startfrom,
                startfromid: req.cookies.startfromid,
                todestination: req.cookies.todestination,
                todestinationid: req.cookies.todestinationid,
                departuredate: req.cookies.departuredate
            },
            {
                startfrom: req.cookies.todestination,
                startfromid: req.cookies.todestinationid,
                todestination: req.cookies.startfrom,
                todestinationid: req.cookies.startfromid,
                departuredate: req.cookies.returndate
            }
        ];
        if(!req.cookies.departuredate) {
            let now = dateModule.getcurrdate(Intl.DateTimeFormat().resolvedOptions().timeZone)
            res.cookie("departuredate", now, {maxAge: 60*60*24*1000});
            multiCities[0].departuredate = now;
            if(!req.cookies.returndate) {
                res.cookie("returndate", dateModule.addDate(now, 7), {maxAge: 60*60*24*1000});
                multiCities[1].departuredate = dateModule.addDate(multiCities[0].departureDate, 7);
            } else if(new Date(req.cookies.returndate) < new Date(now)) {
                res.cookie("returndate", dateModule.addDate(now, 7), {maxAge: 60*60*24*1000});
                multiCities[1].departuredate = dateModule.addDate(multiCities[0].departureDate, 7);
            }
        }
        else if(!req.cookies.returndate) {
            res.cookie("returndate", dateModule.addDate(req.cookies.departuredate, 7), {maxAge: 60*60*24*1000});
            multiCities[1].departuredate = dateModule.addDate(req.cookies.departuredate, 7);
        }
        res.cookie("multicities", multiCities, {maxAge: 60*60*24*1000});
    }
    res.redirect('/multi-cities-sf.ejs');
});

router.get('/process-bar.ejs', function(req, res){
    var params = {
        travelType: req.cookies.traveltype
    }
    if(params.travelType === "Multi Cities") {
        if(!Array.isArray(req.cookies.multicities) && req.cookies.multicities != undefined){
            params.multiCities = JSON.parse(req.cookies.multicities)
        }
        else params.multiCities = req.cookies.multicities;
    }
    res.render('partials/flight/process-bar.ejs', params);
});

router.get('/booking-modal-content.ejs/:id', async (req, res) => {
    // console.log(req.params);
    const foundbooking = await Booking.findOne({bid: req.params.id}).exec();
    let foundtransits = [];
    for(let flight of foundbooking.trip){
        let found = await Transit.findOne({_id : flight})
        .populate([{
            path: 'from',
            select: '-_id',
            populate: {
                path: 'city',
                select: '-_id -airports'
            }
        }, {
            path: 'to',
            select: '-_id',
            populate: {
                path: 'city',
                select: '-_id -airports'
            }
        },{
            path: 'transits.flight',
            populate: [{
                path: 'airline',
                select: '-_id -airports'
            },{
                path: 'from',
                select: '-_id',
                populate: {
                    path: 'city',
                    select: '-_id -airports'
                }
            },{
                path: 'to',
                select: '-_id',
                populate: {
                    path: 'city',
                    select: '-_id -airports'
                }
            },{
                path: 'aircraft'
            }]
        }]).exec();
        foundtransits.push(found);
    }
    for(let i = 0; i < foundtransits.length; i++){
        let total_duration = 0;
        for(let j = 0; j < foundtransits[i].transits.length; j++){
            let arravalat = dateModule.StringtoDatetime(foundtransits[i].transits[j].arrivaldate, foundtransits[i].transits[j].flight.arrivaltime + ":00.000", foundtransits[i].transits[j].flight.to.city.UTC);
            let departat = dateModule.StringtoDatetime(foundtransits[i].transits[j].departuredate, foundtransits[i].transits[j].flight.departuretime + ":00.000", foundtransits[i].transits[j].flight.from.city.UTC);
            let duration = arravalat.getTime() - departat.getTime();
            total_duration += duration;
            foundtransits[i].transits[j].duration = dateModule.formatTime(dateModule.parseDuration(duration), false);
        }
        foundtransits[i].totalduration = dateModule.formatTime(dateModule.parseDuration(total_duration), false);
    }
    // console.log(foundbooking);
    // console.log(foundtransits[0]);
    res.render('partials/booking/booking-modal-content.ejs', { flights: foundtransits, booking: foundbooking });
});

router.get('/airport-edit.ejs/:id', async (req, res) => {
    const foundairport = await Airport.findOne({_id: req.params.id}).populate('city').exec();
    const cities = await City.find({_id: {$ne: foundairport.city._id}}).exec();
    res.render('partials/admin/modals/airport-edit.ejs', {
        airport: foundairport,
        cities: cities
    });
});

router.get('/country-edit.ejs/:id', async (req, res) => {
    const foundCountry = await Country.findOne({_id: req.params.id}).exec();
    res.render('partials/admin/modals/country-edit.ejs', {
        country: foundCountry
    })
});

router.get('/city-edit.ejs/:id', async (req, res) => {
    const foundCity = await City.findOne({_id: req.params.id}).populate('country').exec();
    const countries = await Country.find({_id: { $ne: foundCity.country._id }}).exec();
    res.render('partials/admin/modals/city-edit.ejs', {
        city: foundCity,
        countries: countries
    })
});

router.get('/airline-edit.ejs/:id', async (req, res) => {
    const foundAirline = await Airline.findOne({_id: req.params.id}).exec();
    res.render('partials/admin/modals/airline-edit.ejs', {
        airline: foundAirline
    });
});

router.get('/aircraft-edit.ejs/:id', async (req, res) => {
    const foundAircraft = await Aircraft.findOne({_id: req.params.id}).exec();
    res.render('partials/admin/modals/aircraft-edit.ejs', {
        aircraft: foundAircraft
    });
});

router.get('/flight-edit.ejs/:id', async (req, res) => {
    const foundFlight = await Flight.findOne({_id: req.params.id}).populate([{
        path: 'airline',
        populate: { path: 'aircraft' }
    }, { path: 'from' }, { path: 'to' }, { path: 'aircraft' }]).exec();
    const anotherAirline = await Airline.find({_id: {$ne: foundFlight.airline._id}}).exec();
    const anotherfrom = await Airport.find({_id: {$ne: foundFlight.from._id}}).exec();
    const anotherto = await Airport.find({_id: {$ne: foundFlight.to._id}}).exec();
    res.render('partials/admin/modals/flight-edit.ejs', {
        flight: foundFlight,
        airlines: anotherAirline,
        from: anotherfrom,
        to: anotherto
    })
});

router.get('/transit-edit.ejs/:id', async (req, res) => {
    const airports = await Airport.find({}).exec();
    const airlines = await Airline.find({}).exec();
    const foundTransit = await Transit.findOne({_id: req.params.id}).populate([{
            path: 'transits.flight',
            populate: [{path:'airline'}, 
            {
                path: 'from',
                populate: {path: 'city'}
            }, 
            {
                path: 'to',
                populate: {path: 'city'}
            }, 
            {path: 'aircraft'}]
    }]).sort('class').exec();
    res.render('partials/admin/modals/transit-edit.ejs',{
        airports: airports,
        airlines: airlines,
        transit: foundTransit
    });
});

router.get('/user-details.ejs/:id', async (req, res) => {
    const foundUser = await Client.findOne({_id: req.params.id}).exec();
    res.render('partials/admin/modals/user-details.ejs', {
        user: foundUser
    });
});

module.exports = router;