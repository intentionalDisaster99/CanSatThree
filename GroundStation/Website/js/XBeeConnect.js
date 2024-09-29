


// Testing getting the xbee to blink
const five = require('johnny-five');
const board = new five.Board();

console.log("Started");

board.on('ready', () => {
    const led = new five.Led(13);

    led.blink();
});

console.log("Finished telling it");



// var xbee_api = require('xbee-api');
// var C = xbee_api.constants;
// var xbeeAPI = new xbee_api.XBeeAPI();

// // Something we might want to send to an XBee...
// var frame_obj = {
//     type: C.FRAME_TYPE.AT_COMMAND,
//     command: "NI",
//     commandParameter: [],
// };
// console.log(xbeeAPI.buildFrame(frame_obj));
// // <Buffer 7e 00 04 08 01 4e 49 5f>


// // Something we might receive from an XBee...
// var raw_frame = new Buffer([
//     0x7E, 0x00, 0x13, 0x97, 0x55, 0x00, 0x13, 0xA2, 0x00, 0x40, 0x52, 0x2B,
//     0xAA, 0x7D, 0x84, 0x53, 0x4C, 0x00, 0x40, 0x52, 0x2B, 0xAA, 0xF0
// ]);

// console.log(xbeeAPI.parseFrame(raw_frame));