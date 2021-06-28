var express     = require('express'),
    router      = express.Router(),
    middleware  = require('../modules/middleware'),
    multer  = require('multer');

const database  = require('mongoose'),
    Country     = require('../models/country'),
    City        = require('../models/city'),
    Airport     = require('../models/airport'),
    Airline     = require('../models/airline'),
    Client      = require('../models/client'),
    Aircraft    = require('../models/aircraft'),
    Flight      = require('../models/flight'),
    Transit     = require('../models/transit'),
    Booking     = require('../models/booking'),
    flagStorage = multer.diskStorage({
        destination: function(req, file, callback){
            callback(null,'./publish/pic/flag');
        },
        filename: function(req, file, callback){
            callback(null, file.fieldname + "_" + file.originalname);
        }
    }),
    airlogoStorage = multer.diskStorage({
        destination: function(req, file, callback){
            callback(null,'./publish/pic/airline_logo');
        },
        filename: function(req, file, callback){
            callback(null, file.fieldname + "_" + file.originalname);
        }
    }),
    imageFilter = function (req, file, callback){
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        return callback(new Error('files type are not allowed.'), false);
    }
    callback(null, true);
    },
    flagUpload  = multer({storage: flagStorage, fileFilter: imageFilter}),
    airlogoUpload = multer({storage: airlogoStorage, fileFilter: imageFilter});

router.get('/booking', middleware.isAdmin, async (req, res) => {
    const wfp_booking = await Booking.find({status: 'WFP'}).exec();
    const upc_booking = await Booking.find({status: 'UPC'}).exec();
    const cpl_booking = await Booking.find({status: 'CPL'}).exec();
    res.render('admin/index.ejs', {
        select: 'booking', 
        booking: {
            WFP: wfp_booking,
            UPC: upc_booking,
            CPL: cpl_booking
    }});
});

router.get('/airport', middleware.isAdmin, async (req, res) => {
    const cities = await City.find({}).exec();
    const airports = await Airport.find({}).populate({
        path: 'city',
        select: '-airports -_id',
        populate: {
            path: 'country',
            select: '-cities -_id'
        }
    }).sort('iata').exec();
    // console.log(airports[0]);
    res.render('admin/index.ejs', {
        select: 'airport',
        cities: cities,
        airports: airports
    })
});

router.put('/edit/airport=:id', (req, res) => {
    Airport.updateOne({_id: req.params.id},{
        $set: req.body.airport
    }, (err, updatedAirport) => {
        if(err){
            console.log(err);
        }
        console.log(updatedAirport);
        res.redirect('/admin/airport');
    })
});

router.post('/new/airport', function(req, res){
    Airport.create({
        name: req.body.name,
        shortname: req.body.shortname,
        iata: req.body.iata,
        city: req.body.city
    }, function(err, newairport){
        if(err) console.log(err);
        else {
            City.findOne({_id: newairport.city}, function(err, city){
                if(err) console.log(err);
                else {
                    city.airports.push(newairport);
                    city.save();
                    console.log(newairport.name + " has be added to database");
                }
            });
        }
    });
    res.redirect('/admin/airport');
});

router.get('/city', middleware.isAdmin, async (req, res) => {
    const countries = await Country.find({}).exec();
    const cities = await City.find({}).populate('country').exec();
    res.render('admin/index.ejs', {
        select: 'city',
        countries: countries,
        cities: cities
    });
});

router.post('/new/country', flagUpload.single('flag'), function(req, res){
    // console.log(req.file);
    Country.create({
        name: req.body.name,
        initial: req.body.initial,
        flag: "/pic/flag/" + req.file.filename
    }, function(err, newcountry){
        if(err) console.log(err);
        else console.log(newcountry.name + " has be added to database");
    });
    res.redirect('/admin/city');
});

router.put('/edit/country=:id', flagUpload.single('flag'), (req, res) => {
    let updatedData = {
        name: req.body.name,
        initial: req.body.initial
    }
    if(req.file){
        updatedData.flag = "/pic/flag/" + req.file.filename;
    }
    Country.updateOne({_id: req.params.id}, updatedData, (err, updatedCountry) => {
        if(err){
            console.log(err);
        }
        console.log(updatedCountry);
        res.redirect('/admin/city');
    });
});

router.post('/new/city', function(req, res){
    City.create({
        name: req.body.name,
        country: req.body.country,
        UTC: req.body.utc
    }, function(err, newcity){
        if(err) console.log(err);
        else {
            Country.findOne({_id: newcity.country}, function(err, country){
                if(err) console.log(err);
                else {
                    country.cities.push(newcity);
                    country.save();
                    console.log(newcity.name + " has be added to database");
                }
            });
        }
    });
    res.redirect('/admin/city');
});

router.put('/edit/city=:id', (req, res) => {
    City.updateOne({_id: req.params.id},{
         name: req.body.name,
         country: req.body.country,
         UTC: req.body.utc
    }, (err, updatedCity) => {
     if(err){
         console.log(err);
     }
     console.log(updatedCity);
     res.redirect('/admin/city');
    })
});

router.get('/airline', middleware.isAdmin, async (req, res) => {
    const airlines = await Airline.find({}).exec();
    const aircrafts = await Aircraft.find({}).exec();
    res.render('admin/index.ejs', {
        select: 'airline',
        airlines: airlines,
        aircrafts: aircrafts
    });
});

router.post('/new/airline', airlogoUpload.single('logo'), function(req, res){
    const newairline = {
        name: req.body.name,
        logo_path: '/pic/airline_logo/' + req.file.filename
    }
    if(!(req.body.extrabaggage == undefined)) newairline.extrabaggage = JSON.parse(JSON.stringify(req.body.extrabaggage));
    Airline.create(newairline, function(err, newairline){
        if(err) console.log(err);
        else console.log(newairline.name + " has be added to database");
    });
    res.redirect('/admin/airline');
});

router.put('/edit/airline=:id', airlogoUpload.single('logo'), (req, res) => {
    const updateData = {
        name: req.body.name,
        extrabaggage: []
    }
    if(req.file){
        updateData.logo_path = "/pic/airline_logo/" + req.file.filename;
    }
    if(req.body.extrabaggage){ 
        updateData.extrabaggage = JSON.parse(JSON.stringify(req.body.extrabaggage));
    }
    Airline.updateOne({_id: req.params.id}, updateData, (err, updatedAirline) => {
        if(err){
            console.log(err);
        }
        console.log(updatedAirline);
        res.redirect('/admin/airline');
    });
});

router.post('/new/aircraft', function(req, res){
    const newaircraft = {
        model: req.body.model,
        seats: {}
    }
    if(req.body.economy != undefined) newaircraft.seats.economy = req.body.economy;
    if(req.body.premium != undefined) newaircraft.seats.premium = req.body.premium;
    if(req.body.bussiness != undefined) newaircraft.seats.business = req.body.bussiness;
    if(req.body.first != undefined) newaircraft.seats.first = req.body.first;
    Aircraft.create(newaircraft, function(err, newaircraft){
        if(err) console.log(err);
        else {
            Airline.findOne({name: req.body.airline}, function(err, airline){
                if(err) console.log(err);
                else {
                    airline.aircraft.push(newaircraft);
                    airline.save();
                    console.log(airline.name + ' ' + newaircraft.model + " has been added to database");
                }
            });
        }
    });
    res.redirect('/admin/airline');
});

router.put('/add/aircraft', (req, res) => {
    // console.log(req.body);
    Airline.updateOne({_id: req.body.airline}, {
        $push: {aircraft: req.body.aircraft}
    }, (err, updatedAirline) => {
        if(err) console.log(err);
        console.log(updatedAirline);
        res.redirect('/admin/airline');
    });
});

router.put('/edit/aircraft=:id', (req, res) => {
    const updateData = {
        model: req.body.model,
        seats: {}
    }
    if(req.body.economy != undefined) updateData.seats.economy = req.body.economy;
    if(req.body.premium != undefined) updateData.seats.premium = req.body.premium;
    if(req.body.business != undefined) updateData.seats.business = req.body.business;
    if(req.body.first != undefined) updateData.seats.first = req.body.first;
    Aircraft.updateOne({_id: req.params.id}, updateData, (err, updateAircraft) => {
        if(err){
            console.log(err);
        }
        console.log(updateAircraft);
        res.redirect('/admin/airline');
    });
});

router.get('/flight', middleware.isAdmin, async (req, res) => {
    const airports = await Airport.find({}).exec();
    const airlines = await Airline.find({}).exec();
    const flights = await Flight.find({}).populate('airline from to aircraft').exec();
    res.render('admin/index.ejs', {
        select: 'flight',
        airports: airports,
        airlines: airlines,
        flights: flights
    });
});

router.post('/new/flight', function(req, res){
    const newflight = {
        name: req.body.name,
        airline: req.body.airline,
        from: req.body.departureFrom,
        to: req.body.toDestination,
        aircraft: req.body.aircraft,
        departuretime: req.body.departureTime,
        arrivaltime: req.body.arrivalTime,
        class: {}
    };
    if(req.body.economy != undefined) newflight.class.economy = req.body.economy;
    if(req.body.premium != undefined) newflight.class.premium = req.body.premium;
    if(req.body.business != undefined) newflight.class.business = req.body.business;
    if(req.body.first != undefined) newflight.class.first = req.body.first;

    Flight.create(newflight, function(err, newflight){
        if(err){
            console.log(err);
        } else {
            console.log(newflight.name + " has been added to database");
        }
    });

    res.redirect('/admin/flight');
});

router.put('/edit/flight=:id', (req, res) => {
    const updateData = {
        name: req.body.name,
        airline: req.body.airline,
        from: req.body.departureFrom,
        to: req.body.toDestination,
        aircraft: req.body.aircraft,
        departuretime: req.body.departureTime,
        arrivaltime: req.body.arrivalTime,
        class: {}
    };
    if(req.body.economy != undefined) updateData.class.economy = req.body.economy;
    if(req.body.premium != undefined) updateData.class.premium = req.body.premium;
    if(req.body.business != undefined) updateData.class.business = req.body.business;
    if(req.body.first != undefined) updateData.class.first = req.body.first;
    Flight.updateOne({_id: req.params.id}, updateData, (err, updatedFlight) => {
        if(err) console.log(err);
        console.log(updatedFlight);
        res.redirect('/admin/flight');
    });
});

router.get('/transit', middleware.isAdmin, async (req, res) => {
    const airports = await Airport.find({}).exec();
    const airlines = await Airline.find({}).exec();
    const transits = await Transit.find({}).populate([
        {path: 'from'}, {path: 'to'}, {
            path: 'transits.flight',
            populate: {path:'airline'}
        }
    ]).sort('class').exec();
    // console.log(transits[0].transits[0]);
    res.render('admin/index.ejs', {
        select: 'transit',
        transits: transits,
        airports: airports,
        airlines: airlines
    });
});

router.post('/new/transit', async function(req, res){
    // console.log(req.body);
    const transition = {
        from: req.body.from[0],
        to: req.body.to[req.body.to.length - 1],
        class: req.body.class,
        transits: []
    }
    for(let i = 0; i < req.body.flight.length; i++){
        let foundflight = await Flight.findOne({_id: req.body.flight[i]}).populate('aircraft').exec();
        let newtransit = {
            flight: req.body.flight[i],
            remain: foundflight.aircraft.seats[req.body.class].number,
            price: req.body.price[i],
            departuredate: req.body.departureDate[i],
            arrivaldate: req.body.arrivalDate[i]
        };
        transition.transits.push(newtransit);
    }

    Transit.create(transition, function(err, newtransits){
        if(err){
            console.log(err);
        } else {
            console.log("new transition has been added to database");
        }
    });
    res.redirect('/admin/transit');
});


router.put('/edit/transit=:id', async (req, res) => {
    const updateData = {
        from: req.body.from[0],
        to: req.body.to[req.body.to.length - 1],
        class: req.body.class,
        transits: []
    }
    for(let i = 0; i < req.body.flight.length; i++){
        let foundflight = await Flight.findOne({_id: req.body.flight[i]}).populate('aircraft').exec();
        let newtransit = {
            flight: req.body.flight[i],
            remain: foundflight.aircraft.seats[req.body.class].number,
            price: req.body.price[i],
            departuredate: req.body.departureDate[i],
            arrivaldate: req.body.arrivalDate[i]
        };
        updateData.transits.push(newtransit);
    }
    // console.log(updateData);
    // console.log(updateData.transits);
    Transit.updateOne({_id: req.params.id}, updateData, (err, updateTransit) => {
        if(err) console.log(err);
        console.log(updateTransit);
    })
    res.redirect('/admin/transit');
});

router.get('/user', middleware.isAdmin, async (req, res) => {
    const user = {};
    user.client = await Client.find({role: 'user'}).exec();
    user.admin = await Client.find({role: 'admin'}).exec();
    user.master = await Client.find({role: 'master'}).exec();
    user.blocked = await Client.find({role: 'blocked'}).exec();
    res.render('admin/index.ejs', {
        select: 'user',
        user: user
    });
});

router.put('/block/user=:id', (req, res) => {
   Client.updateOne({_id: req.params.id}, {
       role: 'blocked'
   }, (err, updatedUser) => {
       if(err) console.log(err);
       console.log(updatedUser);
       res.redirect('/admin/user');
   })
});

router.put('/unblock/user=:id', (req, res) => {
    Client.updateOne({_id: req.params.id}, {
        role: 'user'
    }, (err, updatedUser) => {
        if(err) console.log(err);
        console.log(updatedUser);
        res.redirect('/admin/user');
    })
 });

 router.put('/upgrade/user=:id', (req, res) => {
    Client.updateOne({_id: req.params.id}, {
        role: 'admin'
    }, (err, updatedUser) => {
        if(err) console.log(err);
        console.log(updatedUser);
        res.redirect('/admin/user');
    })
 });

router.put('/downgrade/user=:id', (req, res) => {
    Client.updateOne({_id: req.params.id}, {
        role: 'user'
    }, (err, updatedUser) => {
        if(err) console.log(err);
        console.log(updatedUser);
        res.redirect('/admin/user');
    })
});

module.exports = router;