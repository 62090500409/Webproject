var database = require("mongoose");

var trasitSchema = database.Schema({
    from: {
        type: database.Schema.Types.ObjectId,
        ref: "Airport"
    },
    to: {
        type: database.Schema.Types.ObjectId,
        ref: "Airport"
    },
    class: String,
    transits: [{
        flight: {
            type: database.Schema.Types.ObjectId,
            ref: "Flight"
        },
        remain: Number,
        price: {
            adult: Number,
            infant: Number
        },
        departuredate: String,
        arrivaldate: String
    }]
});

module.exports = database.model("Transits", trasitSchema);