var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    cookieParser  = require('cookie-parser'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    flash           = require('connect-flash'),
    methodOverride  = require('method-override');

const   indexRoute      = require('./routes/index'),
        flightRoute     = require('./routes/flight'),
        bookingRoute    = require('./routes/booking'),
        adminRoute      = require('./routes/admin'),
        profileRoute    = require('./routes/profile'),
        databaseRoute   = require('./routes/database');
    
const database  = require('mongoose'),
    Client      = require('./models/client');

database.connect("mongodb://localhost:27017/paperfly", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(express.static('publish'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: "Make It Happen",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(flash());

passport.use(new LocalStrategy({
    usernameField: 'email'
}, Client.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());
app.use(methodOverride('_method'));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoute);
app.use('/flight', flightRoute);
app.use('/booking', bookingRoute);
app.use('/admin', adminRoute);
app.use('/profile', profileRoute);
app.use('/database', databaseRoute);

app.listen('9600', function(req, res){
    console.log('server is running');
});

