// The SD library
#include <SparkFun_Qwiic_OpenLog_Arduino_Library.h>

// The Orientation library
#include <Adafruit_BNO055.h>

// The temperature and pressure libraries
#include <Adafruit_BMP3XX.h>
#include <bmp3.h>
#include <bmp3_defs.h>

// The GPS libraries
#include <SparkFun_u-blox_GNSS_Arduino_Library.h>
#include <u-blox_config_keys.h>
#include <u-blox_structs.h>

///////////////////////////////////////////////////////////////////////////////////THINGS TO DO /////////////////////////////////////
// Ask about the format of the team_id, right now I just guessed/
// Ask about the time, and whether or not we are going to be just updating it from the starting time of the thing
// Ask whether it is okay if we just use the log file that I know we can access at this point. It would still be in CSV syntax 

/*

  This is the main running file, so it calls functions in the other files to get it to read each function.

  FILES:
  BOmB_Embedded.ino
    This file; the main running file
  GPS.ino
    The file that reads the GPS
  TempPressure.ino  
    The file that reads the temperature and pressure sensor
  SD.ino
    The file that controls the SD card reader
  Orient.ino
    The file that reads the orientation sensor

  
*/

// Global variables
long lastUpdate;
int packetCount;


void setup() {
  
  // Setting up the Serial output
  Serial.begin(9600);

  // Setting up the temperature and pressure sensor
  TempPressureSetup();

  // Setting up the GPS
  // setupGPS();

  // Setting up the orientation sensor
  setupOrient();

  // Setting up the SD card
  setupSD();

  // Setting up the servo
  setupServo();

  // Recording the starting time so that the updates can work
  lastUpdate = millis();

  // Initializing the packet count at 0
  packetCount = 0;

}

void loop() {

  // Timer - updating every second
  if (millis() - lastUpdate > 1000) {

    lastUpdate = millis(); //Update the timer

    // TEAM_ID, MISSION_TIME, PACKET_COUNT, SW_STATE, PL_STATE, ALTITUDE, TEMP, VOLTAGE, GPS_LATITUDE, GPS_LONGITUDE, GYRO_R, GYRO_P, GYRO_Y

    // Setting up the telemetry that we want to send
    String data = "CanSat Team 3, ";

    // Getting the time, which is weird, I think that we will have to either send the startting time up from the ground station?
    // Formatting the time into hh:mm:ss.ss
    ////////////////////////////////////////////////////////////////////////////////////////////////////UPDATE TIMER FORMATTING STUFFS
    String time = "";
    String hours = String(int(round(millis()/10000000))) + "00";
    String min = String(int(round(millis()/100000))) + "00";
    String sec = String(int(round(millis()/1000))) + "00";
    String hundredths = String(int(round(millis()/10))) + "00";
    

    // int min = round(millis()/100000);
    // int sec = round(millis()/1000);
    // int hundredths = round(millis()/10);


    data += String(hours).substring(0, 2) + ":" + String(min).substring(0, 2) + ":" + String(sec).substring(0, 2) + "." + String(hundredths).substring(0, 2) + ", ";

    // Adding the packet count
    data += String(packetCount) + ", ";

    // Calling the stuff to get everything from the sensors

    // Getting the orientation data
    data += getOrientData();

    // Getting the temperature and pressure data
    data += getTempPress();

    


    

    

    // Saving the data to the SD card
    saveToSD(data);

    // Printing out a success message
    Serial.println("Successfully saved to SD card:");
    Serial.println(data);

    if (packetCount == 5) {
      pullInServo();
      Serial.println("EXTENDED SERVO");

    }

    // Incrementing the packetCount
    packetCount++;

  }
    

}























