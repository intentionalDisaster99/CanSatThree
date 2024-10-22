#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

/*
  File:           Orient.ino
  Description:    This file is meant to measure the data from the orientation sensor
*/

/* Set the delay between fresh samples */
#define BNO055_SAMPLERATE_DELAY_MS (100)

// Declaring the wire1 that we are going to use
// Wire Wire1;

// Check I2C device address and correct line below (by default address is 0x28 or 0x29)
//                                   id, address
Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x28, &Wire1);

void setupOrient() {
  
  // Setting up the custom pins
  // Wire.end();
  Wire1.setSDA(6);  // Set GPIO 6 as SDA
  Wire1.setSCL(7);  // Set GPIO 7 as SCL
  Wire1.begin();    // Start I2C with these pins

  Serial.begin(115200);
  while (!Serial) {
    ; // Wait for Serial monitor to open
  }
  Serial.println("Orientation Sensor Setting up..."); Serial.println("");

  /* Initialise the sensor */
  if(!bno.begin())
  {
    /* There was a problem detecting the BNO055 ... check your connections */
    Serial.println("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    Serial.println("Continuing the mission without orientation data.");
  }

  delay(1000);

  /* Use external crystal for better accuracy */
  bno.setExtCrystalUse(true);
}

String getOrientData() {

  /* Get a new sensor event */
  sensors_event_t event;
  bno.getEvent(&event);

  // The string that we are going to return
  String output = "";

  /* The processing sketch expects data as roll, pitch, heading */
  output += String(event.orientation.x) + ", ";  // Heading
  output += String(event.orientation.y) + ", ";  // Roll
  output += String(event.orientation.z);         // Pitch

  // Returning the output
  return output;
}
