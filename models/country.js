var database = require("mongoose");

var countrySchema = database.Schema({
    name: { 
        type: String,
        unique: true
    },
    initial: { 
        type: String,
        unique: true
    },
    flag: String,
    cities: [{
        type: database.Schema.Types.ObjectId,
        ref: "City"
    }]
});

module.exports = database.model("Country", countrySchema);