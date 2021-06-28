var database = require("mongoose");

var airportSchema = database.Schema({
    name: { 
        type: String,
        unique: true
    },
    shortname: { 
        type: String,
        unique: true
    },
    iata: { 
        type: String,
        unique: true
    },
    city: {
        type: database.Schema.Types.ObjectId,
        ref: 'City'
    }
});

module.exports = database.model("Airport", airportSchema);