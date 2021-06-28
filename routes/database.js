var express     = require('express'),
    router      = express.Router();
    
const   City        = require('../models/city'),
        Airline     = require('../models/airline'),
        Aircraft    = require('../models/aircraft'),
        Flight      = require('../models/flight');

router.get('/city', function(req, res){
    City.find().populate([{
        path: 'airports',
        select: '-city'
    },{
        path: 'country',
        select: '-cities -_id -flag -initial'
    }]).sort("airports.iata").exec().then(result => {
        // console.log(result);
        res.json(result);
    });
});

router.get('/airline/:id/aircraft', function(req, res){
    Airline.findOne({_id: req.params.id}, async function(err, airline){
        if(err){
            console.log(err);
            res.send({err: err});
        } else {
            const aircrafts = [];
            for(let i = 0; i < airline.aircraft.length ; i++) {
                const query = () => Aircraft.findOne({_id: airline.aircraft[i]});
                aircrafts.push(await query());
            }
            res.send(aircrafts);
        }
    });
});


router.get('/airline/:id/aircraft/nin', async (req, res) => {
    const foundAirline = await Airline.findOne({_id: req.params.id}).exec();
    const aircrafts = await Aircraft.find({_id: {$nin: foundAirline.aircraft}});
    res.json(aircrafts);
});

router.get('/aircraft/:id', function(req, res){
    Aircraft.findOne({_id: req.params.id}, function(err, aircraft){
        if(err){
            console.log(err);
            res.send({err: err});
        } else {
            res.render('partials/admin/facility.ejs', {
                aircraft: aircraft
            });
        }
    });
});

router.get('/flight/airline=:airline&&class=:class/from=:from&&to=:to', function(req, res){ 
    if(req.params.class == "economy") classQ = 'class.economy';
    if(req.params.class == "premium") classQ = 'class.premium';
    if(req.params.class == "business") classQ = 'class.business';
    if(req.params.class == "first") classQ = 'class.first';
    Flight.find({
        airline: req.params.airline,
        from: req.params.from,
        to: req.params.to,
        [classQ]: {$exists: true}
    }).populate({
        path: 'airline',
        select: 'name -_id'
    }).populate({
        path: 'from',
        select: 'name shortname iata -_id',
        populate: {
            path: 'city',
            select: 'UTC -_id'
        }
    }).populate({
        path: 'to',
        select: 'name shortname iata -_id',
        populate: {
            path: 'city',
            select: 'UTC -_id'
        }
    }).populate({
        path: 'aircraft',
        select: 'model seats -_id'
    }).exec().then(result => {
        res.json(result);
    });
});    

module.exports = router;