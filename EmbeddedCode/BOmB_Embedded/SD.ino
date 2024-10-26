
#define OPENLOG_SERIAL Serial2 // Using Serial2 for OpenLog
void setupSD() {
    // Initialize Serial2 for communication with OpenLog
    OPENLOG_SERIAL.begin(9600);  // OpenLog typically uses 9600 baud rate

    // Allow some time for OpenLog to initialize
    delay(2000);

    // Sending the header file that shows the format of the data
    OPENLOG_SERIAL.println("TEAM_ID, MISSION_TIME, PACKET_COUNT, SW_STATE, PL_STATE, ALTITUDE, TEMP, VOLTAGE, GPS_LATITUDE, GPS_LONGITUDE, GYRO_R, GYRO_P, GYRO_Y");
    Serial.println("OpenLog initialized and header sent.");
}

void saveToSD(String message) {
    // Send data to OpenLog via Serial2
    OPENLOG_SERIAL.println(message);
    Serial.println("Message sent to OpenLog: " + message);
}


