var express     = require('express'),
    router      = express.Router(),
    dateModule  = require('../modules/date_modules');
    
const   Airport = require('../models/airport'),
        Transit = require('../models/transit');

router.get('/', function(req, res){
    var params = {
        travelType: req.cookies.traveltype,
        flightClass: req.cookies.flightclass,
        departureDate: req.cookies.departuredate,
        startFrom: req.cookies.startfrom,
        toDestination: req.cookies.todestination,
        traveler: req.cookies.traveler
    }
    if(params.travelType === "Round Trip") params.returnDate = req.cookies.returndate;
    if(params.travelType === "Multi Cities") {
        if(!Array.isArray(req.cookies.multicities) && req.cookies.multicities != undefined){
            params.multiCities = JSON.parse(req.cookies.multicities)
        }
        else params.multiCities = req.cookies.multicities;
    }
    // console.log(params.multiCities);

    res.render('flight.ejs', params);
});

router.post('/', function(req, res) {
    res.redirect('/flight');
});

router.post('/search', async function(req, res){
    if(req.body.from == 0 || req.body.to == 0){
        res.status(400).json({
            status: 'error',
            massage: 'undifined or invalid input field'
        });
        return;
    }
    let total = parseInt(req.body.adult) + parseInt(req.body.child) + parseInt(req.body.infant);
    const from = await Airport.find({ 
        $or: [{_id: req.body.from}, {city: req.body.from}] 
    }).select("_id").exec();
    const to = await Airport.find({ 
        $or: [{_id: req.body.to}, {city: req.body.to}] 
    }).select("_id").exec();
    const from_id = [], to_id = [];
    from.forEach((list) => { from_id.push(list._id) });
    to.forEach((list) => { to_id.push(list._id) });
    const foundtransits = await Transit.find({
        from: {$in: from_id},
        to: {$in: to_id},
        class: req.body.class,
        'transits.0.departuredate': req.body.departuredate,
        'transits.remain': { $gte: total}
    }).populate([{
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
    for(let i = 0; i < foundtransits.length; i++){
        let total_duration = 0;
        let total_price = {
            adult: 0,
            child: 0,
            infant: 0
        };
        for(let j = 0; j < foundtransits[i].transits.length; j++){
            let arravalat = dateModule.StringtoDatetime(foundtransits[i].transits[j].arrivaldate, foundtransits[i].transits[j].flight.arrivaltime + ":00.000", foundtransits[i].transits[j].flight.to.city.UTC);
            let departat = dateModule.StringtoDatetime(foundtransits[i].transits[j].departuredate, foundtransits[i].transits[j].flight.departuretime + ":00.000", foundtransits[i].transits[j].flight.from.city.UTC);
            let duration = arravalat.getTime() - departat.getTime();
            total_duration += duration;
            foundtransits[i].transits[j].duration = dateModule.formatTime(dateModule.parseDuration(duration), false);
            total_price.adult += foundtransits[i].transits[j].price.adult*parseInt(req.body.adult);
            total_price.child += foundtransits[i].transits[j].price.adult*parseInt(req.body.child);
            total_price.infant += foundtransits[i].transits[j].price.infant*parseInt(req.body.infant);
        }
        foundtransits[i].totalduration = dateModule.formatTime(dateModule.parseDuration(total_duration), false);
        foundtransits[i].price = {
            total: (total_price.adult + total_price.child + total_price.infant).toFixed(2),
            adult: total_price.adult.toFixed(2),
            child: total_price.child.toFixed(2),
            infant: total_price.infant.toFixed(2)
        }
    }
    res.render('partials/flight/transitions.ejs', {
        flights: foundtransits, params: req.body
    });
});

module.exports = router;