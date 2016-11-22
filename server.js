var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080;

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)
    switch( uri.pathname ) {
    case '/':
        sendFile(res, 'public/index.html')
        break
    case '/index.html':
        sendFile(res, 'public/index.html')        
        break
    case '/pictures/browse.jpg':
        sendFile(res, 'public/pictures/browse.JPG', 'image/png')      
        break
    case '/pictures/outline.jpg':
        sendFile(res, 'public/pictures/outline.JPG', 'image/png')          
        break
    case '/css/style.css':
        sendFile(res, 'public/css/style.css', 'text/css')
        break
    case '/js/scripts.js':
        sendFile(res, 'public/js/scripts.js', 'text/javascript')
        break
    default:
        res.end('404 not found')
    }
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')
// subroutines

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    if (contentType == 'text/html') {res.end(content, 'utf-8')}
    else {res.end(content, 'binary')}
  })

}
