var database = require("mongoose");

var airlineSchema = database.Schema({
    name: { 
        type: String,
        unique: true
    },
    logo_path: String,
    extrabaggage: [
        {
            weight: Number,
            price: Number
        }
    ],
    aircraft: [{
        type: database.Schema.Types.ObjectId,
        ref: "Aircraft"
    }]
});

module.exports = database.model("Airline", airlineSchema);