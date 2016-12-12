var express = require('express')
  , path = require('path')
  , fs   = require('fs')
  , qs   = require('querystring')
  , sql = require('sqlite3')
  , port = process.env.PORT || 8080;

var app = express();

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

//////////////////////////////////////////////////////
//       server initialization functions
//////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////
//       database access functions
//////////////////////////////////////////////////////

function getUserItems(user, pw){
    var allItems = [];
    if (!validateUser(user, pw)) return allItems; // return empty
    var query = 'SELECT name, description, mainImage FROM items WHERE username="'+user+'"';
    db.each(query, function(err, row) { 
        item = {"name":row.name, "description":row.description, "mainImage":row.mainImage];
        allItems.push(item);        
    }, function() {
        console.log(allItems);
    }); 
}

function getItem(user, pw, itemID){
    var item = ["Invalid", "Invalid", "None"];
    if (!validateUser(user, pw)) return item;
    var query = 'SELECT name, description, mainImage FROM items WHERE username="'+user+'" AND itemID='+itemID;
    db.each(query, function(err, row) { 
        item = {"name":row.name, "description":row.description, "mainImage":row.mainImage];              
    }, function() {
        console.log(item);
    }); 
}

function getItemImagePaths(user, pw, itemID){
    var paths = [];
    if (!validateUser(user, pw)) return paths; // return empty list
    var query = 'SELECT filepath FROM itemImages WHERE itemID='+itemID;
    db.each(query, function(err, row) { 
        paths.push(row.filepath);
    }, function() {
        console.log(paths);
    }); 
}

function addItem(user, pw, name, desc, mainImg, otherImages){    
    if (validateUser(user, pw)) {        
        db.serialize(function() {
            // create new item entry
            db.run('INSERT INTO items VALUES ("'+user+'", "'+name+'", "'+desc+'", "'+mainImg+'")');
            // add corresponding image entries
            var query = 'SELECT itemID FROM items WHERE username="'+user+'" AND name="'+name+'"';
            query = query + ' AND description="'+desc+'" AND mainImage="'+mainImg;  
            db.each(query, function(err, row) {                 
                db.run('INSERT INTO itemImages VALUES ("'+row.itemID+'", "'+mainImg+'")');
                var index;
                for (index = 0; index < otherImages.length; ++index){
                    db.run('INSERT INTO itemImages VALUES ("'+row.itemID+'", "'+otherImages[index]+'")');
                }
            });             
        });
    }
}

function remItem(user, pw, itemID){ // itemImages must be deleted as well
    if (validateUser(user, pw)) {        
        db.serialize(function() {
            db.run('DELETE FROM items WHERE username="'+user+'" AND itemID='+itemID;)
            db.run('DELETE FROM itemImages WHERE itemID='+itemID;)
            db.run('DELETE FROM tradeItems WHERE itemID='+itemID;)
        });
    }
}

//////////////////////////////////////////////////////
//       trading functions
//////////////////////////////////////////////////////

function proposeTrade(userOffer, pw, userRecv, offeredItemIDs, desiredItemIDs){    
    if (validateUser(userOffer, pw)) {        
        db.serialize(function() {
            // create new trade entry
            db.run('INSERT INTO trades VALUES ("'+userOffer+'", "'+userRecv+'", 1)');
            // add corresponding image entries
            var query = 'SELECT tradeID FROM trades WHERE offer="'+userOffer+'" AND recv="'+userRecv+'"';
            db.each(query, function(err, row) {                 
                var index;
                for (index = 0; index < desiredItemIDs.length; ++index){
                    db.run('INSERT INTO tradeItems VALUES ("'+row.tradeID+'", "'+desiredItemIDs[index]+'")');
                }
                for (index = 0; index < offeredItemIDs.length; ++index){
                    db.run('INSERT INTO tradeItems VALUES ("'+row.tradeID+'", "'+offeredItemIDs[index]+'")');
                }
            });             
        }, function(){
            //sendTrade(); // TODO
        });
    }
}

function counterTrade(userOffer, pw, tradeID, offeredItemIDs, desiredItemIDs){    
    if (validateUser(userOffer, pw)) {        
        db.serialize(function() {
            // flip offering and receiving user in trade table
            var query = 'SELECT offer FROM trades WHERE recv="'+userOffer+'" AND tradeID='+tradeID;
            db.each(query, function(err, row) {    
                db.run('UPDATE tradeItems SET offer="'+userOffer+'", recv="'+row.offer+'" WHERE recv="'+userOffer+'" AND tradeID='+tradeID);
                
                // replace items in trade
                db.run('DELETE FROM tradeItems WHERE tradeID='+tradeID);
                var index;
                for (index = 0; index < desiredItemIDs.length; ++index){
                    db.run('INSERT INTO tradeItems VALUES ("'+row.tradeID+'", "'+desiredItemIDs[index]+'")');
                }
                for (index = 0; index < offeredItemIDs.length; ++index){
                    db.run('INSERT INTO tradeItems VALUES ("'+row.tradeID+'", "'+offeredItemIDs[index]+'")');
                }
            });             
        }, function(){
            //sendTrade(); // TODO
        });
    }
}

function acceptTrade(user, pw, tradeID){    
    if (validateUser(user, pw)) {        
        db.run('UPDATE tradeItems SET pending=0 WHERE recv="'+user+'" AND tradeID='+tradeID)    
        db.each("SELECT itemID FROM tradeItems WHERE tradeID="+tradeID, function(err, row) {   
            remItem(user, pw, row.itemID); // remove all trace of an item from database
        }        
    }
}

//////////////////////////////////////////////////////
//       authorization functions
//////////////////////////////////////////////////////

function validateUser(user, pw){
    return true; // TODO
}

//////////////////////////////////////////////////////
//       miscellaneous server functions
//////////////////////////////////////////////////////

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    if (contentType == 'text/html') {res.end(content, 'utf-8')}
    else {res.end(content, 'binary')}
  })
}