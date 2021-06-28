var database = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var clientSchema = database.Schema({
    email: String,
    firstname: String,
    lastname: String,
    tel: String,
    password: String,
    image: String,
    role: {
        type: String,
        enum: ["user", "admin", "master", "blocked"],
        default: "user"
    },
    traveler: [{
        title: String,
        firstname: String,
        lastname: String,
        birthdate: String
    }],
    booking: [{
        type: database.Schema.Types.ObjectId,
        ref: 'Booking'
    }]
});

clientSchema.plugin(passportLocalMongoose, { usernameField : 'email' });
module.exports = database.model("Client", clientSchema);