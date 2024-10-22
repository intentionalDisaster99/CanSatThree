#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>
  
Adafruit_BNO055 bno = Adafruit_BNO055(55);

// A bool to actually get it to print out whether ot not it is connecter
bool connected = true;

void setup() {

  Serial.begin(9600);
  Serial.println("Connected to pico");
  Serial.println("Orientation Sensor Test"); Serial.println("");
  
  /* Initialise the sensor */
  if(!bno.begin())
  {
    /* There was a problem detecting the BNO055 ... check your connections */
    connected = false;

  }

    
  // bno.setExtCrystalUse(true);
}

void loop() {

  /* Get a new sensor event */ 
  if (connected) {

    sensors_event_t event; 
    bno.getEvent(&event);
    
    // /* Display the floating point data */
    Serial.print("X: ");
    Serial.print(event.orientation.x, 4);
    Serial.print("\tY: ");
    Serial.print(event.orientation.y, 4);
    Serial.print("\tZ: ");
    Serial.print(event.orientation.z, 4);
    Serial.println("");
    
    delay(100);

  } else {

    Serial.println("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    Serial.println("Buffering");

  }

}