var database    = require("mongoose"),
    Country     = require("./models/country"),
    City        = require("./models/city"),
    Airport     = require("./models/airport");

var airportsData = [
    {
        name: "Suvarnabhumi Airport",
        shortname: "Suvarnabhumi",
        iata: "BKK",
        city: "Bangkok"
    },
    {
        name: "Don Mueang International Airport",
        shortname: "Don Mueang",
        iata: "DMK",
        city: "Bangkok"
    },
    {
        name: "Chiang Mai International Airport",
        shortname: "Chiang Mai",
        iata: "CNX",
        city: "Chiang Mai"
    },
    {
        name: "Hong Kong International Airport",
        shortname: "Hong Kong Intl",
        iata: "HKG",
        city: "Hong Kong"
    },
    {
        name: "Hong Kong H K Heliport Airport",
        shortname: "Hong Kong H K Heliport",
        iata: "HHP",
        city: "Hong Kong"
    },
    {
        name: "Shanghai Pudong International Airport",
        shortname: "Shanghai Pu Dong",
        iata: "PVG",
        city: "Shanghai"
    },
    {
        name: "Shanghai Hongqiao International Airport",
        shortname: "Shanghai Hongqiao",
        iata: "SHA",
        city: "Shanghai"
    },
    {
        name: "John F. Kennedy International Airport",
        shortname: "New York John F. Kennedy",
        iata: "JFK",
        city: "New York"
    },
    {
        name: "Newark Liberty International Airport",
        shortname: "New York Newark",
        iata: "EWR",
        city: "New York"
    },
    {
        name: "Dulles International Airport",
        shortname: "Dulles",
        iata: "IAD",
        city: "Washington DC"
    },
    {
        name: "Ronald Reagan Washington National Airport",
        shortname: "Ronald Reagan",
        iata: "DCA",
        city: "Washington DC"
    },
    {
        name: "Baltimore Washington International Thurgood Marshall Airport",
        shortname: "Baltimore Washington",
        iata: "BWI",
        city: "Washington DC"
    }
];

var citiesDate = [
    {
        name: "Bangkok",
        country: "Thailand"
    },
    {
        name: "Chiang Mai",
        country: "Thailand"
    },
    {
        name: "Hong Kong",
        country: "China"
    },
    {
        name: "Shanghai",
        country: "China"
    },
    {
        name: "New York",
        country: "United States"
    },
    {
        name: "Washington DC",
        country: "United States"
    }
];

var countriesData = [
    {
        name: "Thailand",
        initial: "TH",
    },
    {
        name: "China",
        initial: "CN"
    },
    {
        name: "United States",
        initial: "US"
    }
];

function seedDB() {
    Airport.remove({}, function(err){
        if(err) console.log(err);
        else{
            console.log("clear airport's data in database complete");
            airportsData.forEach(function(seed){
                Airport.create(seed, function(err, airport){
                    if(err) console.log(err);
                    else {
                        console.log("new airport has be added :" + airport.shortname);
                    }
                })
            });
        }
    });

    City.remove({}, function(err){
        if(err) console.log(err);
        else{
            console.log("clear city's data in database complete");
            citiesDate.forEach(function(seed){
                City.create(seed, function(err, city){
                    if(err) console.log(err);
                    else {
                        console.log("new city has be added :" + city.name);
                        Airport.find({city: city.name}, function(err, airports){
                            if(err) console.log(err);
                            else{
                                airports.forEach(function(airport){
                                    city.airports.push(airport);
                                });
                                city.save();
                            }
                        });
                    }
                });
            });
        }
    });

    Country.remove({}, function(err){
        if(err) console.log(err);
        else {
            console.log("clear country's data in database complete");
            countriesData.forEach(function(seed){
                Country.create(seed, function(err, country){
                    if(err) console.log(err);
                    else {
                        console.log("new country has be added :" + country.name);
                        City.find({country: country.name}, function(err, cities){
                            if(err) console.log(err);
                            else {
                                cities.forEach(function(city){
                                    country.cities.push(city);
                                });
                                country.save();
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;