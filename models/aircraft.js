var database = require("mongoose");

var aircraftSchema = database.Schema({
    model: String,
    seats: {
        economy: {
            number: Number,
            seatlayout: String,
            seatpitch: Number
        },
        premium: {
            number: Number,
            seatlayout: String,
            seatpitch: Number
        },
        business: {
            number: Number,
            seatlayout: String,
            seatpitch: Number
        },
        first: {
            number: Number,
            seatlayout: String,
            seatpitch: Number
        }
    }
});

module.exports = database.model("Aircraft", aircraftSchema);