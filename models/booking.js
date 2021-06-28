var database = require("mongoose");

var bookingSchema = database.Schema({
    bid: {
        type: String,
        unique: true
    },
    class: String,
    flighttype: String,
    price: {
        adult: Number,
        child: Number,
        infant: Number
    },
    trip: [{
        type: database.Schema.Types.ObjectId,
        ref: 'Transits'
    }],
    status : {
        type: String,
        enum: ['WFP', 'UPC', 'CPL'],
        default: 'WFP'
    },
    contract: {
        firstname: String,
        lastname: String,
        tel: String,
        email: String
    },
    traveler: {
        adult: [{
            title: {
                type: String,
                enum: ['Mr.', 'Ms.', 'Mrs.']
            },
            firstname: String,
            lastname: String,
            dateofbirth: Date
        }],
        child: [{
            title: {
                type: String,
                enum: ['Mr.', 'Ms.']
            },
            firstname: String,
            lastname: String,
            dateofbirth: Date
        }],
        infant: [{
            title: {
                type: String,
                enum: ['Mr.', 'Ms.']
            },
            firstname: String,
            lastname: String,
            dateofbirth: Date
        }]
    }
},{ timestamps: true });

bookingSchema.index({'bid': 1});
module.exports = database.model("Booking", bookingSchema);