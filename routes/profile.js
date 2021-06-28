var express     = require('express'),
    router      = express.Router(),
    multer  = require('multer'),
    path    = require('path');
    
const Client = require('../models/client'),
    clientimgStorage = multer.diskStorage({
        destination: function(req, file, callback){
            callback(null,'./publish/pic/client_image');
        },
        filename: function(req, file, callback){
            callback(null, file.fieldname + "_" + req.user._id + path.extname(file.originalname));
        }
    }),
    imageFilter = function (req, file, callback){
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/i)) {
        return callback(new Error('files type are not allowed.'), false);
    }
    callback(null, true);
    },
    clientimgUpload = multer({storage: clientimgStorage, fileFilter: imageFilter});

router.get('/', async (req, res) => {
    // console.log(req.query);
    if(!req.isAuthenticated()){
        res.redirect('/home');
    } else {
        foundUser = await Client.findOne({_id: req.user._id}).populate('booking').exec()
        res.render('profile.ejs', {select: req.query.select, booking: foundUser.booking});
    }
});

router.post('/edit/userimage', clientimgUpload.single('user_image'), (req, res) => {
    // console.log(req.body);
    Client.updateOne({_id: req.user._id}, {
        $set: {image: "/pic/client_image/" + req.file.filename}
    },(err, updatedClient) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            console.log(updatedClient);
            res.redirect('back');
        }
    });
});

router.post('/edit/contract_detail', (req, res) => {
    // console.log(req.body);
    Client.updateOne({_id: req.user._id}, {
        $set: {
            firstname: req.body.contract.firstname,
            lastname: req.body.contract.lastname,
            tel: req.body.contract.tel
        }
    },(err, updatedClient) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            console.log(updatedClient);
            res.redirect('back');
        }
    });
});    

module.exports = router;