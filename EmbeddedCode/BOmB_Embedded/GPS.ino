

#include <Wire.h> //Needed for I2C to GNSS

#include <SparkFun_u-blox_GNSS_Arduino_Library.h>
SFE_UBLOX_GNSS myGNSS;

void setupGPS() {

  Wire.begin();


  // Serial for debugging
  Serial.begin(9600);

  if (myGNSS.begin() == false) //Connect to the u-blox module using Wire port
  {
    Serial.println("GPS Not detected. Continuing anyway.");
  }

  myGNSS.setI2COutput(COM_TYPE_UBX); //Set the I2C port to output UBX only (turn off NMEA noise)
  myGNSS.saveConfigSelective(VAL_CFG_SUBSEC_IOPORT); //Save (only) the communications port settings to flash and BBR
}

String getPosition() {

  // The output
  String output = "";
  
  // Latitude
  double latitude = myGNSS.getLatitude() / 100000000;
  // String formattedLat/itude = "";
  // sprintf(formattedLatitude, "%.4f, ", latitude);
  output += String(latitude, 4) + ", ";

  // Longitude
  double longitude = myGNSS.getLongitude() / 10000000;
  // String formattedLongitude = "";
  // sprintf(formattedLongitude, "%.4f, ", longitude);
  output += String(longitude, 4) + ", ";

  // Altitude? Again?
  // long altitude = myGNSS.getAltitude();

  // Honestly no idea what an SIV is, but here it is
  // byte SIV = myGNSS.getSIV();

  // Returning!!!
  return output;
    

}
