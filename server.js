var express = require('express')
  , path = require('path')
  , sql = require('sqlite3')
  , port = 5000;

var app = express();

// initialize database
var db = new sqlite3.Database('imadethisDB.sqlite');
createDatabaseTables(db);

// serve all files in public directory
app.use(express.static('public', {"index":"dashboard.html"}));

// handle 404 error with simple page bringing them back to home page
// (ALWAYS Keep this as the last route to handle all unhandled cases)
app.get('*', function(req, res){
  res.redirect('404.html');
});

// listen on port
app.listen(port, function () {
    console.log('listening on '+port);
});

function createDatabaseTables(db){
  // defining the tables
  var createString = "CREATE TABLE IF NOT EXISTS ";
  
  var usersCreateString = createString + "Users (";
  usersCreateString = usersCreateString + "username VARCHAR(35) PRIMARY KEY,";
  usersCreateString = usersCreateString + "password VARCHAR(100) NOT NULL,";
  usersCreateString = usersCreateString + "firstName VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "lastName VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "street VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "city VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "state VARCHAR(20) NOT NULL,";
  usersCreateString = usersCreateString + "zip integer NOT NULL,";
  usersCreateString = usersCreateString + "phone integer" + ");";
  
  var itemsCreateString = createString + "Items (";
  itemsCreateString = itemsCreateString + "itemID INTEGER PRIMARY KEY,";
  itemsCreateString = itemsCreateString + "username VARCHAR(35) NOT NULL REFERENCES Users(username) ON DELETE CASCADE,";
  itemsCreateString = itemsCreateString + "name VARCHAR(35) NOT NULL,";
  itemsCreateString = itemsCreateString + "description VARCHAR(2000),";
  itemsCreateString = itemsCreateString + "mainImage VARCHAR(35) NOT NULL" + ");";
  
  var itemImagesCreateString = createString + "ItemImages (";
  itemImagesCreateString = itemImagesCreateString + "filepath VARCHAR(35) PRIMARY KEY,";
  itemImagesCreateString = itemImagesCreateString + "itemID INTEGER NOT NULL REFERENCES Items(itemID) ON DELETE CASCADE" + ");";
  
  // creating the tables
  db.run(usersCreateString);
  db.run(itemsCreateString);
  db.run(itemImagesCreateString);
}