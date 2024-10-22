// #include <SparkFun_u-blox_GNSS_Arduino_Library.h>
// #include <u-blox_config_keys.h>
// #include <u-blox_structs.h>
// #include <Wire.h> //Needed for I2C to GNSS

// /*

//   File:           GPS.ino
//   Description:    This file is meant to read the data off of the GPS unit

// */


// // All of the pins that are used by the GPS
// const int GPS_DATA = 8;
// const int GPS_CLK = 9;  

// // The Global Navagation Sattelite System
// SFE_UBLOX_GNSS myGNSS;

// void setupGPS() {

//   // Telling the thing what to connect to
//   Wire.begin(GPS_DATA, GPS_CLK);

//   //myGNSS.enableDebugging(); // Uncomment this line to enable helpful debug messages on Serial

//   if (myGNSS.begin() == false) { //Connect to the u-blox module using Wire port 
//     Serial.println("There was a problem with the GPS module:");
//     Serial.println(F("u-blox GNSS not detected at default I2C address. Please check wiring. Freezing."));
//     while (1);
//   }

//   myGNSS.setI2COutput(COM_TYPE_UBX); //Set the I2C port to output UBX only (turn off NMEA noise)
//   myGNSS.saveConfigSelective(VAL_CFG_SUBSEC_IOPORT); //Save (only) the communications port settings to flash and BBR
// }

// String GPSloop() {

//   // The output
//   String output = "";
  
//   //Query module only every second. Doing it more often will just cause I2C traffic.
//   //The module only responds when a new position is available
//   if (millis() - lastTime > 1000) {

//     lastTime = millis(); //Update the timer
    
//     // Getting and saving the data
//     long latitude = myGNSS.getLatitude();
//     output += latitude;

//     // Adding in a comma for the formatting
//     output += ", ";

//     long longitude = myGNSS.getLongitude();
//     // Serial.print(F(" Long: "));
//     output += longitude;
//     // Serial.print(F(" (degrees * 10^-7)"));

//     // Adding in a comma for the formatting
//     output += ", ";

//     long altitude = myGNSS.getAltitude();
//     // Serial.print(F(" Alt: "));
//     output += (altitude);
//     // Serial.print(F(" (mm)"));

//     // Adding in a comma for the formatting
//     output += ", ";

//     byte SIV = myGNSS.getSIV();
//     // Serial.print(F(" SIV: "));
//     output += SIV;

//     // Adding in a comma for the formatting
//     output += ", ";

//     // Returning it to be saved to another file
//     return output;

//   }
// }



// // Working Code:
// /*
// // --------------------------------------
// // i2c_scanner
// //
// // Version 1
// //    This program (or code that looks like it)
// //    can be found in many places.
// //    For example on the Arduino.cc forum.
// //    The original author is not know.
// // Version 2, Juni 2012, Using Arduino 1.0.1
// //     Adapted to be as simple as possible by Arduino.cc user Krodal
// // Version 3, Feb 26  2013
// //    V3 by louarnold
// // Version 4, March 3, 2013, Using Arduino 1.0.3
// //    by Arduino.cc user Krodal.
// //    Changes by louarnold removed.
// //    Scanning addresses changed from 0...127 to 1...119,
// //    according to the i2c scanner by Nick Gammon
// //    https://www.gammon.com.au/forum/?id=10896
// // Version 5, March 28, 2013
// //    As version 4, but address scans now to 127.
// //    A sensor seems to use address 120.
// // Version 6, November 27, 2015.
// //    Added waiting for the Leonardo serial communication.
// //
// //
// // This sketch tests the standard 7-bit addresses
// // Devices with higher bit address might not be seen properly.
// //
 
// #include <Wire.h>
 
 
// void setup()
// {
//   Wire.begin();
 
//   Serial.begin(9600);
//   while (!Serial);             // Leonardo: wait for serial monitor
//   Serial.println("\nI2C Scanner");
// }
 
 
// void loop()
// {
//   byte error, address;
//   int nDevices;
 
//   Serial.println("Scanning...");
 
//   nDevices = 0;
//   for(address = 1; address < 127; address++ )
//   {
//     // The i2c_scanner uses the return value of
//     // the Write.endTransmisstion to see if
//     // a device did acknowledge to the address.
//     Wire.beginTransmission(address);
//     error = Wire.endTransmission();
 
//     if (error == 0)
//     {
//       Serial.print("I2C device found at address 0x");
//       if (address<16)
//         Serial.print("0");
//       Serial.print(address,HEX);
//       Serial.println("  !");
 
//       nDevices++;
//     }
//     else if (error==4)
//     {
//       Serial.print("Unknown error at address 0x");
//       if (address<16)
//         Serial.print("0");
//       Serial.println(address,HEX);
//     }    
//   }
//   if (nDevices == 0)
//     Serial.println("No I2C devices found\n");
//   else
//     Serial.println("done\n");
 
//   delay(1000);           // wait 5 seconds for next scan
// }

// */