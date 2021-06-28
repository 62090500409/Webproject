var database = require("mongoose");

var flightSchema = database.Schema({
    name: String,
    airline: {
        type: database.Schema.Types.ObjectId,
        ref: "Airline"
    },
    from: {
        type: database.Schema.Types.ObjectId,
        ref: "Airport"
    },
    to: {
        type: database.Schema.Types.ObjectId,
        ref: "Airport"
    },
    departuretime: String,
    arrivaltime: String,
    aircraft: {
        type: database.Schema.Types.ObjectId,
        ref: "Aircraft"
    },
    class: {
        economy: {
            cabin_baggage: Number,
            facility: {
                baggage: {
                    number: Number,
                    weight: Number
                },
                extra_baggage: String,
                meal: String,
                entertainment: String,
                wifi: String,
                usbport: String
            }
        },
        premium: {
            cabin_baggage: Number,
            facility: {
                baggage: {
                    number: Number,
                    weight: Number
                },
                extra_baggage: String,
                meal: String,
                entertainment: String,
                wifi: String,
                usbport: String
            }
        },
        business: {
            cabin_baggage: Number,
            facility: {
                baggage: {
                    number: Number,
                    weight: Number
                },
                extra_baggage: String,
                meal: String,
                entertainment: String,
                wifi: String,
                usbport: String
            }
        },
        first: {
            cabin_baggage: Number,
            facility: {
                baggage: {
                    number: Number,
                    weight: Number
                },
                extra_baggage: String,
                meal: String,
                entertainment: String,
                wifi: String,
                usbport: String
            }
        }
    }
});

module.exports = database.model("Flight", flightSchema);