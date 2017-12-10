//how to TEST at the end of the code (Terminal+POSTMAN)

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/around_the_world_through_webcams', { useMongoClient: true });

//Here we use and test if the db is running
var Place = require('./model/place');
var FavouriteList = require('./model/favouritelist');

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type", "Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.post('/place', function(request, response) {
  var place = new Place();
  place.title = request.body.title;
  place.location = request.body.location;
  place.save(function(err, savedPlace) {
    if (err) {
      response.status(500).send({error:"Could not save place"});
    } else {
      //REST API design (sending back the database object that was returned)
      response.send(savedPlace);
      //response.json(savedPlace);
    }
  });
});

app.get('/place', function(request, response) {
  Place.find({}, function(err, places) {
    //responses are sent inside the callback
    if (err) {
      response.status(500).send({error: "Could not fetch places"});
    } else {
      response.send(places);
    }
  });
});

app.get('/favouritelist', function(request, response) {
  FavouriteList.find({}).populate({path:'places', model: 'Place'}).exec(function(err, favouriteLists) {
    if (err) {
      response.status(500).send({error:"Could not fetch favourites list"});
    } else {
      response.status(200).send(favouriteLists);
    }
  })
});

app.post('/favouritelist', function(request, response) {
  var favouriteList = new FavouriteList();
  favouriteList.title = request.body.title;
  
  favouriteList.save(function(err, newFavouriteList) {
    if (err) {
      response.status(500).send({error: "Could not create favourites list"});
    } else {
      response.send(newFavouriteList);
    }
  });
});

//updating the favouritelist
//adding a new place
app.put('/favouritelist/place/add', function(request, response) {
  //find the place in db
  Place.findOne({_id:request.body.productId}, function(err, product) {
    if (err) {
      response.status(500).send({error: "Could not add item to Favourites"});
    } else {
      //update the Favourites section
      FavouriteList.update({_id:request.body.favouriteListId}, {$addToSet:{places: place._id}}, function(err, favouriteList) {
        if (err) {
          response.status(500).send({error: "Could not add item to Favourite"});
        } else {
          response.send("Successfully added to Favourites");
        }
    });
    }
  })
});


app.listen(28017, function() {
  console.log("Aroung the World through webcams API running...");
});



//HOW TO TEST
//$ node server.js
//then, we open two Terminals
//[We need to have the mongo server up and running!] 
// by running the mongod script with cmd ( $ ./mongod ). 
// It should say "waiting for connections" -> running a local server using Node
// //In the second one(without closing the first one): ( $ mongo ) -> shell. 
// This sign should appear ( > ), meaning we can now work with the db

//------------------------------------------------------------------------------

//POSTMAN 

//GET(to see the db) API(fetch)
// We choose 'GET' and then write the URL link with /place then hit Send
// In the Terminal, we can go into $ mongo
// >show dbs
// >use around_the_world_through_webcams
// >db.places.find({}).pretty
// (collection)
// Even if we kill the server, they are persistent in the db permanently
// >exit

//------------------------------------------------------------------------------

//POST into the db
// First, we choose 'POST' and write the URL:
// https://around-the-world-through-webcams-2-ilincabera.c9users.io
// if we are not in c9 we should write (assuming the localhost is 3000):
// http://localhost:3000/place
// We see that it requires a title and location from the code
// We now go to the Body section and write as follows(a few examples to enter into the db):
// {
//   "title": "National Military Museum, Romania",
//   "location": "Strada Mircea Vulcanescu 125-127, Bucuresti 010819"
// }
// And click 'Send'. We can add as many as we want 
// by simply edit what we wrote before and sending the new inputs
// Some more:
// {
//   "title": "Museum of Art Collections",
//   "location": "Calea Victoriei 111, Bucuresti"
// }
// {
//   "title": "Palace of the Parliament",
//   "location": "Strada Izvor 2-4, Bucuresti"
// }
// {
//   "title": "Primaverii Palace",
//   "location": "Bulevardul Primaverii 50, Bucuresti 014192"
// }

//This should hit the API. The API (with mongoose) should hit the MongoDB,
// insert the new collection. 
// And that gets the record back from the db with the new objectid 
// and sends it back to the API and then to the client(here: POSTMAN)

//Hit Send. If we see '200 OK' it is successful. Otherwise, if we see 500,
// it is an error.

// We can go back to the Terminal:
// $ mongo
// >show dbs
// The first insertion creates the db and the collection 
// >use around_the_world_through_webcams
// >show collections
// places
// >db.places.find({}) //this shows all the places

//------------------------------------------------------------------------------

// POST(FavouriteList)
// TEST
// Terminal: node server.js to see if it's preperly running
// New Tab > Post Request > type the URL
// Body > raw, Text: JSON(app)

// We type in the body:
// {
//   "title": " Favourite place "
// }

// And then sent it and see if it's successful(200) or not(500).
































