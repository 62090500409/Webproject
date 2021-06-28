var express     = require('express'),
    router      = express.Router(),
    dateModule = require('../modules/date_modules');

const   Client      = require('../models/client'),
        Transit     = require('../models/transit'),
        Booking     = require('../models/booking');

function idGenerate(len, opt = {}){
    const char = '0123456789abcdef';
    let randstr = [ ...Array(len) ].map(() => char[Math.trunc(Math.random() * char.length)]).join('');
    const now = Number(Date.now());
    let output = now.toString(16) + randstr;
    if (opt.prefix) output = opt.prefix + output;
    return output;
}

router.get('/', async (req, res) => {
    // console.log(req.query);
    if(req.isAuthenticated()){
        res.redirect('/profile?select=my+booking');
        return;
    }
    const foundBooking = await Booking.find({
        bid: req.query.bid,
        'contract.tel': req.query.tel
    }).exec();
    // console.log(foundBooking);
    res.render('booking.ejs', {booking: foundBooking});
});

router.get('/details', async function(req, res){
    if(!Array.isArray(req.query.flights)){
        let tmp = [req.query.flights];
        req.query.flights = tmp;
    }
    let foundtransits = [];
    for(let flight of req.query.flights){
        // console.log(req.query.flights);
        // console.log(flight);
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
    // console.log(foundtransits);
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
            total_price.adult += foundtransits[i].transits[j].price.adult*parseInt(req.query.adult);
            total_price.child += foundtransits[i].transits[j].price.adult*parseInt(req.query.child);
            total_price.infant += foundtransits[i].transits[j].price.infant*parseInt(req.query.infant);
        }
        foundtransits[i].totalduration = dateModule.formatTime(dateModule.parseDuration(total_duration), false);
        foundtransits[i].price = {
            total: (total_price.adult + total_price.child + total_price.infant).toFixed(2),
            adult: total_price.adult.toFixed(2),
            child: total_price.child.toFixed(2),
            infant: total_price.infant.toFixed(2)
        }
    }
    res.render('booking-details.ejs', { flights: foundtransits, params: req.query});
});

router.post('/payment', function(req, res){
    if(!Array.isArray(req.query.flights)){
        let tmp = [req.query.flights];
        req.query.flights = tmp;
    }
    // console.log(req.body.traveler);
    Transit.find({_id: { $in: req.query.flights }}, (err, foundtransits) => {
        if(err){
            console.log(err);
            res.redirect('/flight');
        } else {
            let price = {
                adult: 0,
                child: 0,
                infant: 0
            };
            let flightclass = foundtransits[0].class;
            for(let i = 0; i < foundtransits.length; i++){
                for(let j = 0; j < foundtransits[i].transits.length; j++){
                    // console.log(foundtransits[i].transits[j]);
                    price.adult += foundtransits[i].transits[j].price.adult;
                    price.child += foundtransits[i].transits[j].price.adult;
                    price.infant += foundtransits[i].transits[j].price.infant;
                }
            }
            price.adult *= req.query.adult;
            price.child *= req.query.child;
            price.infant *= req.query.infant;
            const newbooking = new Booking({
                bid: idGenerate(5, { prefix: req.query.type.slice(0,1) + flightclass.slice(0,1) }).toUpperCase(),
                trip: req.query.flights,
                class: flightclass,
                flighttype: req.query.type,
                price: price,
                contract: req.body.contract,
                traveler: req.body.traveler
            });
            console.log(newbooking);
            Booking.create(newbooking, (err, createdbooking) => {
                if(err) {
                    console.log(err);
                    res.redirect('/flight');
                } else {
                    if(req.isAuthenticated()){
                        Client.updateOne(
                            {_id: req.user._id},
                            {$push: {booking: createdbooking}},
                            (err, updatedUser) => {
                                if(err){
                                    console.log(err);
                                    res.redirect('/flight');
                                }
                            }
                        );
                    }
                    res.redirect('/booking/' + createdbooking._id + '/payment');
                }
            });
            // let params = new URLSearchParams(req._parsedOriginalUrl.search);
        }
    });
});

router.get('/:id/payment', async function(req, res){
    const foundbooking = await Booking.findOne({_id: req.params.id}).exec();
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
    // console.log(foundtransits[0].price);
    res.render('payment.ejs', { flights: foundtransits, booking: foundbooking });
});

router.delete('/:id/payment',(req, res) => {
    Booking.findOneAndDelete({_id: req.params.id}, (err, deletedBooking) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/flight');
        }
    });
});

router.post('/:id/payment/comfirm', (req, res) => {
    Booking.findOneAndUpdate({_id: req.params.id}, {$set: {status: 'UPC'}}, (err, updatedBooking) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/booking/' + req.params.id + '/payment');
        }
    });
});

router.put('/:id/payment/verify', (req, res) => {
    Booking.findOneAndUpdate({_id: req.params.id}, {$set: {status: 'CPL'}}).populate('trip')
    .exec((err, updatedBooking) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            // console.log(updatedBooking);
            let ntraveler = updatedBooking.traveler.adult.length + updatedBooking.traveler.child.length + updatedBooking.traveler.infant.length;
            updatedBooking.trip.forEach(trip => {
                for(let i = 0; i < trip.transits.length; i++){
                    Transit.updateMany({},
                        {
                            $inc: { 'transits.$[transit].remain': - ntraveler}   
                        },{
                            arrayFilters: [{
                                'transit.flight': trip.transits[i].flight,
                                'transit.departuredate': trip.transits[i].departuredate
                            }]
                        }
                    ).exec();
                }
            });
            res.redirect('back');
        } 
    });
});

router.put('/:id/payment/unverify', (req, res) => {
    Booking.findOneAndUpdate({_id: req.params.id}, {$set: {status: 'UPC'}}).populate('trip')
    .exec((err, updatedBooking) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            // console.log(updatedBooking);
            let ntraveler = updatedBooking.traveler.adult.length + updatedBooking.traveler.child.length + updatedBooking.traveler.infant.length;
            updatedBooking.trip.forEach(trip => {
                for(let i = 0; i < trip.transits.length; i++){
                    Transit.updateMany({},
                        {
                            $inc: { 'transits.$[transit].remain': ntraveler}   
                        },{
                            arrayFilters: [{
                                'transit.flight': trip.transits[i].flight,
                                'transit.departuredate': trip.transits[i].departuredate
                            }]
                        }
                    ).exec();
                }
            });
            res.redirect('back');
        } 
    });
});

module.exports = router;