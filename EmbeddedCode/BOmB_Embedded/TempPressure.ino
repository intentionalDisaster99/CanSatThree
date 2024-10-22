#include <Adafruit_BMP3XX.h>
#include <bmp3.h>
#include <bmp3_defs.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>

/*
  File:           TempPressure.ino
  Description:    This file is meant to read the data off of the temperature and pressure unit
*/

// The pins on the microcontroller
const int TMP_SCK = 2;  // This will be used for I2C SCL
const int TMP_SDO = 3;  // This will be used for I2C SDA

// TODO: Check the sea level pressure closer to here to get more accurate measurements
#define SEALEVELPRESSURE_HPA (1013.25)

// The object for our sensor
Adafruit_BMP3XX bmp;

void TempPressureSetup() {
  // Set up custom I2C pins
  // Wire1.setSDA(TMP_SDO);  // Set GPIO 3 (TMP_SDO) as SDA
  // Wire1.setSCL(TMP_SCK);  // Set GPIO 2 (TMP_SCK) as SCL
  // Wire1.begin();          // Initialize I2C with custom pins

  Serial.begin(115200);
  while (!Serial);        // Wait for Serial monitor to open
  Serial.println("Adafruit BMP388 / BMP390 test");

  // Initialize the sensor with Wire1
  if (!bmp.begin_I2C(0x77, &Wire)) {  // Specify Wire1 and I2C address (default 0x77 for BMP388)
    Serial.println("Could not find a valid BMP3 sensor, check wiring!");
    Serial.println("Continueing with the mission without temperature and pressure data.");
  }

  // Set up oversampling and filter initialization
  bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
  bmp.setPressureOversampling(BMP3_OVERSAMPLING_4X);
  bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  bmp.setOutputDataRate(BMP3_ODR_50_HZ);
}

// Method to read from the temperature and pressure sensor
String getTempPress() {
  // The output string
  String output = "";

  if (!bmp.performReading()) {
    Serial.println("Failed to perform reading :(");
    return "";
  }

  // Temperature (*C)
  output += "Temperature: " + String(bmp.temperature) + " °C, ";

  // Pressure (hPa)
  output += "Pressure: " + String((bmp.pressure / 100.0)) + " hPa, ";

  // Altitude (m)
  output += "Altitude: " + String(bmp.readAltitude(SEALEVELPRESSURE_HPA)) + " m";

  return output;
}
