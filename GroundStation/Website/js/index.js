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


const { SerialPort } = require('serialport');
const xbee_api = require('xbee-api');

// Create a new instance of the XBee API in API mode 2
const xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 2
});

const C = xbee_api.constants;

// Specify the serial port path where the XBee is connected
const serialPortPath = "COM14";  // Change this to your correct port (COM13 or COM14)

// Create a SerialPort object
const port1 = new SerialPort({
    path: serialPortPath,
    baudRate: 9600,
    parser: xbeeAPI.rawParser()  // Use the xbeeAPI rawParser to handle XBee frames
});

// When the serial port is successfully opened
port1.on('open', function () {
    console.log('Serial port opened for XBee communication.');

    // Send a simple frame to the XBee
    var frame_obj = {
        type: C.FRAME_TYPE.TX_REQUEST_64,     // Frame type
        destination64: "0013A20041D88202",    // Replace with your XBee's destination address
        data: "CONNECTION ESTABLISHED\n"
    };

    // Write the frame to the XBee
    port1.write(xbeeAPI.buildFrame(frame_obj), function (err) {
        if (err) {
            return console.log('Error writing to XBee:', err.message);
        }
        console.log('Message sent to XBee:', frame_obj.data);
    });
});

// Listen for incoming data frames
xbeeAPI.on("frame_object", function (frame) {
    console.log("Received frame:", frame);
});

// Error handling for the serial port
port1.on('error', function (err) {
    console.log('Serial port error:', err.message);
});







