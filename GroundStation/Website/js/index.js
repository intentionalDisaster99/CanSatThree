var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (req, res) {
    var filePath = path.join(__dirname, '..\\..\\..\\..\\CanSatThree\\GroundStation\\Website', req.url);
    if (filePath === path.join(__dirname, '..\\..\\..\\..\\CanSatThree\\GroundStation\\Website\\')) {
        filePath = path.join(__dirname, '..\\..\\..\\..\\CanSatThree\\GroundStation\\Website\\index.html');
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.stat(filePath, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile('..\\404.html', function (error, content) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with Sam, cause there be an error: ' + err.code + ' ..\n');
                res.end();
            }
        } else {
            if (stats.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end('Sorry, check with Sam, cause there be an error: ' + error.code + ' ..\n');
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        }
    });

}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
