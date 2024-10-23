#include <XBee.h>

// Define the XBee serial communication using GPIO 0 and 1
#define XBEE_SERIAL Serial1 // Using Serial1 which maps to GPIO 0 and 1

XBee xbee = XBee();

void setupXBee() {
  XBEE_SERIAL.begin(9600);  // Initialize Serial1 for XBee at 9600 baud
  xbee.setSerial(XBEE_SERIAL); // Set XBee to use the defined Serial
  Serial.begin(9600); // Initialize Serial for the Serial Monitor
  Serial.println("XBee Communication Started");
}

void sendToXBee(String packet) {

  // Create an XBeeAddress64 object for the destination
  XBeeAddress64 addr64 = XBeeAddress64(0x0013A200, 0x41E01D8E);
  
  // Prepare a simple test message
  char msg[packet.length() + 1]; // +1 for the null terminator
  packet.toCharArray(msg, sizeof(msg));
  
  // Create a Tx64Request object and send the message
  Tx64Request txRequest = Tx64Request(addr64, (uint8_t*)msg, sizeof(msg));
  xbee.send(txRequest);

  Serial.println("Packet Sent to XBee");
    
}
