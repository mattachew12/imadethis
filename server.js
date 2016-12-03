var express = require('express')
  , path = require('path')
  , port = 5000;

var app = express();

// serve all files in public directory
app.use(express.static('public', {"index":"index.html"}));

// handle 404 error with simple page bringing them back to home page
// (ALWAYS Keep this as the last route to handle all unhandled cases)
app.get('*', function(req, res){
  res.redirect('404.html');
});

// listen on port
app.listen(port, function () {
    console.log('listening on '+port);
});