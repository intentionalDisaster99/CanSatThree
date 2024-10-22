
#include <Servo.h>

Servo myservo;  // create Servo object to control a servo
// twelve Servo objects can be created on most boards

int pos = 0;    // variable to store the servo position

void setupServo() {
  myservo.attach(9);  // attaches the servo on pin 9 to the Servo object

  // Moving the servo to the out position
  myservo.write(180);
}

void pullInServo() {
  myservo.write(360);
}
