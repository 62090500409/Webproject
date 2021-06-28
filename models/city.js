var database = require("mongoose");

var citySchema = database.Schema({
    name: { 
        type: String,
        unique: true
    },
    country: {
        type: database.Schema.Types.ObjectId,
        ref: "Country"
    },
    UTC: Number,
    airports: [{
        type: database.Schema.Types.ObjectId,
        ref: "Airport"
    }]
});

citySchema.index({name: 'text'});
module.exports = database.model("City", citySchema);