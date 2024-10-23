

// CONSTANTS
var TEAM_ID = "CanSat Team 3";

// Global variables
var packetCount = 0;


// The function that sends the data to each graph
function displayData(data) {

    // FORMAT:
    // TEAM_ID,MISSION_TIME,PACKET_COUNT,SW_STATE,PL_STATE,ALTITUDE,TEMP,VOLTAGE,GPS_LATITUDE,GPS_LONGITUDE,GYRO_R,GYRO_P, GYRO_Y\n

    // Logging the packet for debugging 
    console.log(data);

    data = { value: data };

    // Showing the data on the website
    var showing = document.getElementById("packet-display");
    showing.textContent = "Most Recent Packet: " + data.value;

    // First things first, checking the teamID to make sure it matches
    var teamIDFound = getNextData(data);
    if (teamIDFound == TEAM_ID) {
        console.log("Correct Packet Received");
    } else {
        console.log("Incorrect Team ID Identified:");
        console.log(teamIDFound);
    }

    // Saving the time because we will be using it for basically all of the data
    var time = getNextData(data);
    console.log("Time: " + time);

    // Checking the packet count against the last one to make sure none have been skipped
    var incomingPacketNumber = getNextData(data);
    if (packetCount != incomingPacketNumber - 1) console.log("A packet has either been missed or come in the wrong order");
    packetCount = incomingPacketNumber;

    // Showing the user the state of the payload
    getNextData(data);

    // Telling the user that the payload has been released if it has
    var indicator = document.getElementById("pl-state-indicator");
    if (getNextData(data) == "R" && indicator.textContent != "PAYLOAD RELEASED") {
        indicator.textContent = "PAYLOAD RELEASED";
        indicator.style = "text-align: center; height: 100%; background-color: chartreuse; width:25ex; margin-left:15%; text-wrap:nowrap";
    }


    console.log("Data yet to process:\n" + data.value);



}

// A helper function to find the next data value from the packet
function getNextData(data) {

    // This will actually mutate the data though, so that will be interesting 
    var commaIndex = data.value.indexOf(",");

    // We want to get up to that index for the actual data we will return
    var output = data.value.substring(0, commaIndex);

    // We want to adjust the data to exclude that and one after it to account for the space
    data.value = data.value.substring(commaIndex + 2);

    // Returning the data we got
    return output;

}




// Testing the display data function 
var count = 0;
var state = "N";
setInterval((x => {

    count++;
    if (count > 5) state = "R";

    displayData("CanSat Team 3, MISSION_TIME, " + count + ", SW_STATE, " + state + ", ALTITUDE, TEMP, VOLTAGE, GPS_LATITUDE, GPS_LONGITUDE, GYRO_R, GYRO_P, GYRO_Y\n")

}), 1000);