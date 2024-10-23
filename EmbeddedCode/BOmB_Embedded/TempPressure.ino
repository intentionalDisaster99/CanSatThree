/***************************************************************************
  This is a library for the BMP3XX temperature & pressure sensor

  Designed specifically to work with the Adafruit BMP388 Breakout
  ----> http://www.adafruit.com/products/3966

  These sensors use I2C or SPI to communicate, 2 or 4 pins are required
  to interface.

  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing products
  from Adafruit!

  Written by Limor Fried & Kevin Townsend for Adafruit Industries.
  BSD license, all text above must be included in any redistribution
 ***************************************************************************/

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BMP3XX.h"

#define BMP_SCK 13
#define BMP_MISO 12
#define BMP_MOSI 11
#define BMP_CS 10

#define SEALEVELPRESSURE_HPA (1013.25)
//////////////////./////////////////////////////////////Debugging
double testingAlt = 0;

Adafruit_BMP3XX bmp;

void setupTempPressAlt() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println("Adafruit BMP388 / BMP390 test");

  // MIGHT NEED TO SET UP WIRE1

  // if (!bmp.begin_I2C()) {   // hardware I2C mode, can pass in address & alt Wire
  //if (! bmp.begin_SPI(BMP_CS)) {  // hardware SPI mode  
  if (! bmp.begin_SPI(BMP_CS, BMP_SCK, BMP_MISO, BMP_MOSI)) {  // software SPI mode
    Serial.println("Could not find a valid BMP3 sensor, check wiring!");
  }

  // Set up oversampling and filter initialization
  bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
  bmp.setPressureOversampling(BMP3_OVERSAMPLING_4X);
  bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  bmp.setOutputDataRate(BMP3_ODR_50_HZ);
}

String getTempPressAlt() {

  // The formatted string
  String output = "";

  // Altitude (m)
  output += String(bmp.readAltitude(SEALEVELPRESSURE_HPA)) + ", ";

  // Temperature (*C)
  output += String(bmp.temperature) + ", ";

  // Pressure (hPA) - Interestingly we don't seem to need the pressure
  // Serial.print(bmp.pressure / 100.0);

  return output;

}

// A function to just get the altitude so that we can check how high off the ground it is
double getAltitude() {
  // return bmp.readAltitude(SEALEVELPRESSURE_HPA);
  if (testingAlt < 10) {
    testingAlt += 1;
  } else if (testingAlt )
  return testingAlt;
}



