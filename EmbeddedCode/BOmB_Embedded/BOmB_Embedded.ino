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
// We apparently get altitude from two sensors, the GPS and the Temperature and pressure sensor, which should we use? Should we average them?

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
double startingAltitude;
String state;

// CONSTANTS
const int buzzerPin = 18;
const int voltagePin = 26;


void setup() {
  
  // Setting up the Serial output
  Serial.begin(9600);

  // Setting up the temperature and pressure sensor
  setupTempPressAlt();

  // Setting up the GPS
  setupGPS();

  // Setting up the orientation sensor
  setupOrient();

  // Setting up the SD card
  setupSD();

  // Setting up the servo
  setupServo();

  // Setting up the XBee
  setupXBee();

  // Recording the starting time so that the updates can work
  lastUpdate = millis();

  // Initializing the packet count at 0
  packetCount = 0;

  // Intitializing the starting altitude so we can use it later
  startingAltitude = getAltitude();

  // Telling them that we are ready to launch
  state = "LAUNCH_READY";

  // Setting up the buzzer
  pinMode(buzzerPin, OUTPUT);

  // Making sure the buzzer DOES NOT GO OFF RIGHT AWAY
  digitalWrite(buzzerPin, LOW);

  // Setting up the voltage reading
  pinMode(voltagePin, INPUT);

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
    // String time = "";
    // String hours = String(int(round(millis()/10000000))) + "00";
    // String min = String(int(round(millis()/100000))) + "00";
    // String sec = String(int(round(millis()/1000))) + "00";
    // String hundredths = String(int(round(millis()/10))) + "00";
    

    // int min = round(millis()/100000);
    // int sec = round(millis()/1000);
    // int hundredths = round(millis()/10);


    // data += String(hours).substring(0, 2) + ":" + String(min).substring(0, 2) + ":" + String(sec).substring(0, 2) + "." + String(hundredths).substring(0, 2) + ", ";

    // Adding in the time, but with better formatting
    data += formatTime(millis());

    // Adding the packet count
    data += String(packetCount) + ", ";

    // Adding in the operating state of the payload
    data += state + ", ";

    // Adding in the payload state
    String PLstate = getPayloadState();
    data += PLstate;

    // Calling the stuff to get everything from the sensors

    // Getting the temperature and pressure data
    data += getTempPressAlt();

    // Getting the voltage
    data += String((analogRead(voltagePin)-369) * 6.6 / 369, 2);
    Serial.println("Voltage " + String((analogRead(voltagePin)-369) * 6.6 / 369, 2));

    // Getting positional data
    data += getPosition();

    // Getting the orientation data
    data += getOrientData();

    // Saving the data to the SD card
    saveToSD(data);

    // Printing out a success message
    Serial.println("Successfully saved to SD card:");
    Serial.println(data);

    // Sending it to the ground station
    sendToXBee(data);

    // Updating the state of the cansat
    // LAUNCH_READY, ASCENT, SEPARATE, DESCENT, LANDED
    double altitude = getAltitude();
    if (altitude < startingAltitude + 510 && altitude > startingAltitude + 10 && state != "DESCENT" && state != "LANDED") { // If the altitude is more than 10 but less than 510 it is ascending
      state = "ASCENT";
    } else if (altitude >= startingAltitude + 510) { // If it is more than 510 meters up, it should be separating
      // Making sure that the servo is in
      pullInServo();
      state = "SEPARATE";
    } else if (altitude < startingAltitude + 510 && (state == "SEPARATE" || state == "DESCENT")) {
      state = "DESCENT";
    } else if (altitude < startingAltitude + 10 && state != "LAUNCH_READY") {
      state = "LANDED";
      digitalWrite(buzzerPin, HIGH); // Turning on the buzzer
    }


    // Incrementing the packetCount
    packetCount++;

  }
    
}

// A function that formats the time to match what we want
String formatTime(long time) {

  // These should all evaluate to integers because of integer division
  int hours = (time / 3600 / 60);  
  int minutes = ((time - (hours * (3600*60))) / 3600);
  double secs = (double(time) - hours * 3600 * 60 - minutes * 3600) / 100;

  return String(hours) + ", " + String(minutes) + ", " + String(secs, 2) + ", ";
}





















