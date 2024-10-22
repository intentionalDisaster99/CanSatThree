// Define the UART port for Raspberry Pi Pico (UART0 in this case)
#define SERIAL_PORT Serial1  // Change this to Serial0 for UART0

// #include <string>



void setupSD() {
  // Initialize the Serial monitor for debugging
  Serial.begin(115200);
  while (!Serial) {
    ; // Wait for Serial monitor to open
  }

  // Initialize the UART0 for communication with OpenLog (using TX=GP16, RX=GP17)
  Serial1.setTX(16);  // Use GPIO16 for TX
  Serial1.setRX(17);  // Use GPIO17 for RX
  Serial1.begin(9600);  // OpenLog typically uses 9600 baud rate

  // Allow some time for OpenLog to initialize
  delay(2000);

  // Sending the header file that shows the format of the data
  Serial1.println("TEAM_ID, MISSION_TIME, PACKET_COUNT, SW_STATE, PL_STATE, ALTITUDE, TEMP, VOLTAGE, GPS_LATITUDE, GPS_LONGITUDE, GYRO_R, GYRO_P, GYRO_Y");

  Serial.println("SD Ready");

}

void saveToSD(String message) {
    // Send data to OpenLog via UART0
  Serial1.println(message);

  // Log data every second
} 

