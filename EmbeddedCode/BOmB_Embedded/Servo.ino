
#include <Servo.h>

Servo myservo;  // create Servo object to control a servo
// twelve Servo objects can be created on most boards

int pos = 145;    // variable to store the servo position

// The state of the payload 
String openLogState;

void setupServo() {
  myservo.attach(9);  // attaches the servo on pin 9 to the Servo object

  // Moving the servo to the out position (a bunch of times to be sure)
  for (int i = 0; i < 100; i++) {
    myservo.write(145);
  }

  // Saving the state as the out state
  openLogState = "N, ";

  // Telling them that the servo has been set up and retracted
  Serial.begin(9600);
  Serial.println("Servo ready.");

}

void pullInServo() {

  // Telling them that the servo has been retracted
  Serial.println("Servo retracted.");


  // Telling it to pull in (a bunch of times to be sure) 
  for (int i = 0; i < 100; i++) {
    myservo.write(0);
  }

  // Saving the state as in 
  openLogState = "R, ";

}


String getPayloadState() {
  return openLogState;
}







