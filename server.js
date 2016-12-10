var express = require('express')
  , path = require('path')
  , bodyParser = require("body-parser")
  , fs   = require('fs')
  , qs   = require('querystring')
  , sql = require('sqlite3')
  , port = process.env.PORT || 8080;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// initialize database
var db = new sql.Database('private/imadethisDB.sqlite');
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


//////////////////////////////////
//      helper functions
//////////////////////////////////
function createDatabaseTables(db){
  // defining the tables
  var createString = "CREATE TABLE ";
  
  var usersCreateString = createString + "users (";
  usersCreateString = usersCreateString + "username VARCHAR(35) PRIMARY KEY,";
  usersCreateString = usersCreateString + "password VARCHAR(100) NOT NULL,";
  usersCreateString = usersCreateString + "firstName VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "lastName VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "street VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "city VARCHAR(35) NOT NULL,";
  usersCreateString = usersCreateString + "state VARCHAR(20) NOT NULL,";
  usersCreateString = usersCreateString + "zip integer NOT NULL,";
  usersCreateString = usersCreateString + "phone integer" + ");";
  
  var itemsCreateString = createString + "items (";
  itemsCreateString = itemsCreateString + "itemID INTEGER PRIMARY KEY,";
  itemsCreateString = itemsCreateString + "username VARCHAR(35) NOT NULL REFERENCES users(username) ON DELETE CASCADE,";
  itemsCreateString = itemsCreateString + "name VARCHAR(35) NOT NULL,";
  itemsCreateString = itemsCreateString + "description VARCHAR(500),";
  itemsCreateString = itemsCreateString + "mainImage VARCHAR(35) NOT NULL" + ");";
  
  var itemImagesCreateString = createString + "itemImages (";
  itemImagesCreateString = itemImagesCreateString + "filepath VARCHAR(35) PRIMARY KEY,";
  itemImagesCreateString = itemImagesCreateString + "itemID INTEGER NOT NULL REFERENCES items(itemID) ON DELETE CASCADE" + ");";
  
  // creating the tables   
  db.serialize(function() {
    // making the table
    createIfNullDB("users", usersCreateString);
    createIfNullDB("items", itemsCreateString);
    createIfNullDB("itemImages", itemImagesCreateString);
  });  
}

function createIfNullDB(tableName, sqlCreateCmd){
    var exists = false;
    db.each("select * from "+tableName, function(err, row) { // runs exists = true on every entry in the DB
        exists = true;
    }, function() {
        if (!exists) db.run(sqlCreateCmd);
    }); 
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    if (contentType == 'text/html') {res.end(content, 'utf-8')}
    else {res.end(content, 'binary')}
  })
}