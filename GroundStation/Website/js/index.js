var http = require('http');
var fs = require('fs');
var path = require('path');

// A simple function that will only run if debugging is set to true 
var debugging = false;

// The data that is received from the XBee
var data = "";

function debug(inputtedString) {

    // This literally prints out whatever it is if the script is set to debugging 
    if (debugging) {
        console.log(inputtedString);
    }

}

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

// Handle incoming data frames
port1.on('data', function (data) {
    xbeeAPI.parseRaw(data);
});

// When the serial port is successfully opened
port1.on('open', function () {

    debug('Serial port opened for XBee communication.');

    // Sending a frame to the XBee
    var frame_obj = {
        type: C.FRAME_TYPE.TX_REQUEST_64,     // Frame type
        destination64: "0013A20041D88202",
        data: "CONNECTION ESTABLISHED\n"
    };

    // Write the frame to the XBee
    port1.write(xbeeAPI.buildFrame(frame_obj), function (err) {
        if (err) {
            return console.log('Error writing to XBee:', err.message);
        }
        debug('Message sent to XBee:', frame_obj.data);
    });
});

// Listen for incoming data frames
xbeeAPI.on("frame_object", function (frame) {

    debug("Received frame:", frame);
    // Process the incoming frame here
    if (frame.type === C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET) {
        data += frame.data.toString('utf8');
        if (data.substring(data.length - 2) == "\\n") {
            console.log("Saved:\n" + data);
            fs.writeFileSync('telemetry.csv', data);
            data = "";
        }
        debug(data);
    }
});

// Error handling for the serial port
port1.on('error', function (err) {
    console.log('Serial port error:', err.message);
});


// Sends a message to the XBee in a simple format
function send(message) {


    // Sending a frame to the XBee
    var frame_obj = {
        type: C.FRAME_TYPE.TX_REQUEST_64,     // Frame type
        destination64: "0013A20041D88202",
        data: message
    };

    // Write the frame to the XBee
    port1.write(xbeeAPI.buildFrame(frame_obj), function (err) {
        if (err) {
            return console.log('Error writing to XBee:', err.message);
        }
        debug('Message sent to XBee:', frame_obj.data);
    });

}

// Saving the data
function checkToSave() {

    // console.log(data.substring(data.length - 2));

    // Adding in the data if the last input was '\n'
    if (data.substring(data.length - 2, 0) === "\\n") {
        console.log("Saved:\n" + data);
        fs.writeFileSync('telemetry.csv', data);
        data = "";
    }

}
setInterval(checkToSave, 0);



// TODO check to see if we should stop transmitting telemetry when we turn it off or if we should stop when it hits the ground

/*

    Okay, so now we get to the data understanding phase
    We will be using a return character to mean the end of a line and then an escape character to tell when each value is done.
    The escape character will be a comma, ","
    The return character will be the newline string, "\n", so what we will be receiving will look like this:

    TEAM_ID,MISSION_TIME,PACKET_COUNT,SW_STATE,PL_STATE,ALTITUDE,TEMP,VOLTAGE,GPS_LATITUDE,GPS_LONGITUDE,GYRO_R,GYRO_P, GYRO_Y\n

    This will make it simpler to convert it to the CSV format

    At the end of the mission, we will receive the "END" signal, when we stop adding it to the CSV file.

*/


// // Writing to the csv file
// const dataTemp = [
//     ['Name', 'Age', 'City'],
//     ['John', 25, 'New York'],
//     ['Jane', 30, 'London']
// ];


// csvData = dataTemp.map(row => row.join(',')).join('\n');

// fs.writeFileSync('telemetry.csv', data);

