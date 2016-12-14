var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring'),
    sql = require('sqlite3'),
    port = process.env.PORT || 8080;

var app = express();

// initialize database
var nextNewItemID = 1;
var nextNewTradeID = 1;
var db = new sql.Database('private/imadethisDB.sqlite');
createDatabaseTables(db);
getSerialIDs(); // no conflict running in parallel with createDatabaseTables

// serve all files in public directory
app.use(express.static('public', {
    "index": "main.html"
}));

// handle 404 error with simple page bringing them back to home page
// (ALWAYS Keep this as the last route to handle all unhandled cases)
app.get('*', function (req, res) {
    res.redirect('404.html');
});

app.post('/login', function (req, res) {
    if(req.headers.cookie);
    else {
        var d = '';
        req.on('data', (data) => {
            d += data;
        });
        req.on('end', () => {
            console.log(d);
            var q = qs.parse(d);

            var user = q.username;
            var pw = q.password;

            console.log(q, user, pw);

            db.get('SELECT * FROM users WHERE username="' + user + '" AND password="' + pw + '"', function (err, row) {
                if(err) console.log(err);
                else {
                    console.log(row);
                    if(!row) res.end('username-invalid');
                    else if(!(pw === q.password)) res.end('password-invalid');
                    else if(user = q.username && pw = q.password) res.end('login-success');
                    else;
                }
            });

        });
    }
});

// listen on port
app.listen(port, function () {
    console.log('listening on ' + port);
});

//////////////////////////////////////////////////////
//       server initialization functions
//////////////////////////////////////////////////////
function createDatabaseTables(db) {
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

    var tradeCreateString = createString + "trades (";
    tradeCreateString = tradeCreateString + "tradeID INTEGER PRIMARY KEY,";
    tradeCreateString = tradeCreateString + "vendor VARCHAR(35) NOT NULL REFERENCES users(username) ON DELETE CASCADE,";
    tradeCreateString = tradeCreateString + "client VARCHAR(35) NOT NULL REFERENCES users(username) ON DELETE CASCADE,";
    tradeCreateString = tradeCreateString + "pending INTEGER NOT NULL" + ");";

    var tradeItemsCreateString = createString + "tradeItems (";
    tradeItemsCreateString = tradeItemsCreateString + "tradeID INTEGER NOT NULL,";
    tradeItemsCreateString = tradeItemsCreateString + "itemID INTEGER NOT NULL,";
    tradeItemsCreateString = tradeItemsCreateString + "PRIMARY KEY (tradeID, itemID));";

    // creating the tables   
    createIfNullDB("users", usersCreateString);
    createIfNullDB("items", itemsCreateString);
    createIfNullDB("itemImages", itemImagesCreateString);
    createIfNullDB("trades", tradeCreateString);
    createIfNullDB("tradeItems", tradeItemsCreateString);
}

function createIfNullDB(tableName, sqlCreateCmd) {
    db.get("select * from " + tableName, function (err, row) {
        if(err) {
            db.run(sqlCreateCmd, function (err2) {
                if(err2) {
                    console.log(err2)
                }
            });
        }
    });
}

/* if tables need to be created, this one will simply not add to the current IDs,
thus there is no conflict with the function for creation of the DB. */
function getSerialIDs() {
    db.each("select itemID from items", function (err, row) {
        if(row.itemID >= nextNewItemID) nextNewItemID = row.itemID + 1;
    });
    db.each("select tradeID from trades", function (err, row) {
        if(row.tradeID >= nextNewTradeID) nextNewTradeID = row.tradeID + 1;
    });
}

//////////////////////////////////////////////////////
//       database access functions
//////////////////////////////////////////////////////

function getUserItems(user, pw) {
    validateUser(user, pw, function (valid) {
        if(valid) { // authentication succeeded
            var query = 'SELECT name, description, mainImage FROM items WHERE username="' + user + '"';
            db.all(query, function (err, rows) {
                if(err) console.log(err); // handle error
                else if(rows) {
                    console.log(rows); // use queried items
                }
                else {
                    console.log("no such item");
                }
            });
        }
        else { // no authentication            
            console.log("invalid authentication");
        }
    });
}

function getItem(user, pw, itemID) {
    validateUser(user, pw, function (valid) {
        if(valid) {
            var query = 'SELECT name, description, mainImage FROM items WHERE username="'
            query += user + '" AND itemID=' + itemID;
            db.get(query, function (err, row) {
                if(err) console.log(err); // handle error
                else if(row) {
                    console.log(row); // use queried items
                }
                else {
                    console.log("no such item"); // empty query
                }
            });
        }
        else { // no authentication         
            console.log("invalid authentication");
        }
    });
}

function getItemImagePaths(user, pw, itemID) {
    validateUser(user, pw, function (valid) {
        if(valid) {
            var query = 'SELECT filepath FROM itemImages WHERE itemID=' + itemID;
            db.all(query, function (err, rows) {
                if(err) console.log(err); // handle error
                else if(rows) {
                    console.log(rows); // use queried items
                }
                else {
                    console.log("no images"); // empty query
                }
            });
        }
        else { // no authentication         
            console.log("invalid authentication");
        }
    });
}

function addItem(user, pw, name, desc, mainImg, otherImages) {
    validateUser(user, pw, function (valid) {
        if(valid) {
            db.serialize(function () {
                // create new item entry
                db.run('INSERT INTO items VALUES (' + (nextNewItemID++) + ', "' + user + '", "' + name + '", "' + desc + '", "' + mainImg + '")');
                // find new entry's ID and link it to corresponding image filepaths
                // nextNewItemID can't be used further because of shared data issues
                var query = 'SELECT itemID FROM items WHERE username="' + user + '" AND name="' + name + '"';
                query += ' AND description="' + desc + '" AND mainImage="' + mainImg;
                db.each(query, function (err, row) {
                    db.run('INSERT INTO itemImages VALUES ("' + row.itemID + '", "' + mainImg + '")');
                    var index;
                    for(index = 0; index < otherImages.length; ++index) {
                        db.run('INSERT INTO itemImages VALUES ("' + row.itemID + '", "' + otherImages[index] + '")');
                    }
                });
            });
        }
        else { // no authentication         
            console.log("invalid authentication");
        }
    });
}

/* removes link between user and item, but preserves the item
itself in case it needs to be viewed in order history. An item
in the middle of a pending trade may not be deleted. 
*/
function remItemUser(user, pw, itemID) {
    validateUser(user, pw, function (valid) {
        if(valid) {
            // check if it exists in a pending trade
            var query = 'SELECT itemID FROM tradeItems NATURAL JOIN trades WHERE pending=1 AND itemID=' + itemID;
            db.get(query, function (err, row) {
                if(err) console.log(err); // handle error
                else if(row) { // exists in pending trade, cannot delete
                    console.log("item in pending trade");
                }
                else {
                    /* remove user-item link. Don't care if the statement fails due to an invalid user or 
                    an item that's already been updated before somehow. */
                    db.run('UPDATE items SET username="none" WHERE username="' + user + '" AND itemID=' + itemID);
                }
            });
        }
        else { // no authentication         
            console.log("invalid authentication");
        }
    });
}

//////////////////////////////////////////////////////
//       trading functions
//////////////////////////////////////////////////////

// assumes desired and offered items are all of the proper user
function proposeTrade(client, pw, vendor, offeredItemIDs, desiredItemIDs) {
    validateUser(client, pw, function (valid) {
        if(valid) {
            var query = 'SELECT tradeID FROM trades WHERE pending=1 AND ((vendor="' + vendor + '" AND client="' + client + '")';
            query += ' OR (vendor="' + client + '" AND client="' + vendor + '"))'
            db.get(query, function (err, row) {
                if(err) console.log(err); // handle error
                else if(row) { // trade already exists
                    console.log("pending trade already exists. No more than one may be made at a time");
                }
                else {
                    addTrade(client, vendor, offeredItemIDs, desiredItemIDs);
                }
            });
        }
        else {
            console.log("invalid authentication");
        }
    });
}

/* HELPER assumes user is authenticated and desired and offered items are of 
the proper user. Item lists may be empty. */
function addTrade(client, vendor, offeredItemIDs, desiredItemIDs) {
    var query = 'SELECT tradeID FROM trades WHERE pending=1 AND vendor="' + vendor + '" AND client="' + client + '"';
    db.serialize(function () {
        db.run('INSERT INTO trades VALUES (' + (nextNewTradeID++) + ', "' + vendor + '", "' + client + '", 1)');
        // find new entry's ID and link it to contained items
        // nextNewItemID can't be used further because of shared data issues
        db.each(query, function (err, row) {
            var index;
            for(index = 0; index < desiredItemIDs.length; ++index) {
                db.run('INSERT INTO tradeItems VALUES ("' + row.tradeID + '", "' + desiredItemIDs[index] + '")');
            }
            for(index = 0; index < offeredItemIDs.length; ++index) {
                db.run('INSERT INTO tradeItems VALUES ("' + row.tradeID + '", "' + offeredItemIDs[index] + '")');
            }
        }, function () { // trade finished being proposed
            console.log("trade proposed");
        });
    });
}

function counterTrade(client, pw, tradeID, offeredItemIDs, desiredItemIDs) {
    validateUser(client, pw, function (valid) {
        if(valid) {
            // flip offering and receiving user in trade table
            var query = 'SELECT client FROM trades WHERE vendor="' + client + '" AND pending=1 AND tradeID=' + tradeID;
            db.get(query, function (err, row) {
                if(err) console.log(err); // handle error
                else if(row) {
                    updateTrade(tradeID, client, row.client, offeredItemIDs, desiredItemIDs);
                }
                else { // no such trade exists
                    console.log("no trade to counter-offer.");
                }
            });
        }
        else {
            console.log("invalid authentication");
        }
    });
}

/* HELPER assumes user is authenticated and desired and offered items are of 
the proper user. Pre-existing tradeID is proven by previous query too */
function updateTrade(tradeID, client, vendor, offeredItemIDs, desiredItemIDs) {
    db.serialize(function () { // must be serial to not delete newly inserted values 
        db.run('UPDATE trades SET client="' + client + '", vendor="' + vendor + '" WHERE tradeID=' + tradeID);
        db.run('DELETE FROM tradeItems WHERE tradeID=' + tradeID); // clear previous items
        var index;
        // perhaps parallelize these but keep sequentially after the delete?
        for(index = 0; index < desiredItemIDs.length; ++index) {
            db.run('INSERT INTO tradeItems VALUES ("' + tradeID + '", "' + desiredItemIDs[index] + '")');
        }
        for(index = 0; index < offeredItemIDs.length; ++index) {
            db.run('INSERT INTO tradeItems VALUES ("' + tradeID + '", "' + offeredItemIDs[index] + '")');
        }
    });
    console.log("counter-trade being proposed");
}

function acceptTrade(user, pw, tradeID) {
    validateUser(user, pw, function (valid) {
        if(valid) {
            var query = 'SELECT client FROM trades WHERE vendor="' + user + '" AND pending=1 AND tradeID=' + tradeID;
            db.get(query, function (err, row) {
                if(err) console.log(err); // handle error
                else if(row) {
                    db.run('UPDATE trades SET pending=0 WHERE tradeID=' + tradeID); // trade complete
                    // swap owner of all items within the trade
                    db.each("SELECT itemID, username FROM tradeItems NATURAL JOIN items WHERE tradeID=" + tradeID, function (err, row2) {
                        if(row2.username == user) {
                            db.run('UPDATE items SET username="' + row.client + '" WHERE itemID=' + row2.itemID);
                        }
                        else if(row2.username == row.client) {
                            db.run('UPDATE items SET username="' + user + '" WHERE itemID=' + row2.itemID);
                        }
                        else {
                            console.log("3rd party's item bartered!")
                        }
                    }, function () {
                        console.log("trade accepted");
                    });
                }
                else { // Does not exist
                    console.log("no such trade to accept");
                }
            });
        }
        else {
            console.log("invalid authentication");
        }
    });
}

//////////////////////////////////////////////////////
//       authorization functions
//////////////////////////////////////////////////////

function validateUser(user, pw, callback) {
    db.get('SELECT * FROM users WHERE username="' + user + '" AND password="' + pw + '"', function (err, row) {
        var authentic = (row != null);
        callback(authentic);
    });
}

//////////////////////////////////////////////////////
//       miscellaneous server functions
//////////////////////////////////////////////////////

function sendFile(res, filename, contentType) {
    contentType = contentType || 'text/html';

    fs.readFile(filename, function (error, content) {
        res.writeHead(200, {
            'Content-type': contentType
        })
        if(contentType == 'text/html') {
            res.end(content, 'utf-8')
        }
        else {
            res.end(content, 'binary')
        }
    })
}