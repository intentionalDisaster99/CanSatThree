

// Creating a date that represents mission start so that we can make a dateTime object for the graphs
const MISSION_START_TIME = Date.now();


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

    // Changing it to an object so that we can do pass by reference
    data = { value: data };

    // Showing the data on the website
    var showing = document.getElementById("packet-display");
    showing.textContent = "Most Recent Packet: " + data.value;

    // First things first, checking the teamID to make sure it matches
    var teamIDFound = getNextData(data);
    if (teamIDFound == TEAM_ID) {
        // Only use this for debugging, otherwise it gets messy
        // console.log("Correct Packet Received");
    } else {
        console.log("Incorrect Team ID Identified:");
        console.log(teamIDFound);
    }

    // Saving the time because we will be using it for basically all of the data
    var time = Number(getNextData(data));

    // console.log("Time: " + time);

    // Checking the packet count against the last one to make sure none have been skipped
    var incomingPacketNumber = getNextData(data);
    if (packetCount != incomingPacketNumber) console.log("A packet has either been missed or come in the wrong order");
    packetCount = Number(incomingPacketNumber) + 1;

    // Showing the user the state of the payload
    var swState = getNextData(data);
    var SWindicator = document.getElementById("sw-state-indicator");
    if (swState == "LAUNCH_READY") {
        SWindicator.textContent = "LAUNCH READY";
    } else if (swState == "ASCENT") {
        SWindicator.textContent = "ASCENDING";
    } else if (swState == "SEPARATE") {
        SWindicator.textContent = "SEPARATING";
    } else if (swState == "DESCENT") {
        SWindicator.textContent = "DESCENDING";
    } else if (swState == "LANDED") {
        SWindicator.textContent = "LANDED";
    }
    SWindicator.style = "text-align: center; height: 100%; background-color: chartreuse; width:25ex; margin-left:15%; text-wrap:nowrap";


    // Telling the user that the payload has been released if it has
    var indicator = document.getElementById("pl-state-indicator");
    if (getNextData(data) == "R" && indicator.textContent != "PAYLOAD RELEASED") {
        indicator.textContent = "PAYLOAD RELEASED";
        indicator.style = "text-align: center; height: 100%; background-color: chartreuse; width:25ex; margin-left:15%; text-wrap:nowrap";
    }


    // Updating the altitude graph
    graphAltitude(time, Number(getNextData(data)));

    // Updating the temperature graph
    graphTemperature(time, Number(getNextData(data)));

    // Updating the voltage graph
    graphVoltage(time, Number(getNextData(data)));

    // Updating the location
    changeCoordinates(getNextData(data), getNextData(data));

    /. Is this a comment? ./
    // Updating the orientation data
    var roll = getNextData(data);
    var pitch = getNextData(data);
    // console.log("");
    var yaw = getNextData(data);
    console.log("This is the yaw that we got " + yaw);
    graphOrientation(time, roll, pitch, yaw);


    console.log("Data yet to process:\n" + data.value);



}

// A helper function to find the next data value from the packet
function getNextData(data) {

    // This will actually mutate the data though, so that will be interesting 
    var commaIndex = data.value.indexOf(",");

    // Adding in something for the last data point
    if (commaIndex == -1) {
        var output = data.value.substring(0);
        console.log("Just got an index of -1, so it should be the last value: " + output + "\nAnd this is the value of the data " + data.value);
        data.value = "";
        return output;
    }

    // We want to get up to that index for the actual data we will return
    var output = data.value.substring(0, commaIndex);

    // We want to adjust the data to exclude that and one after it to account for the space
    data.value = data.value.substring(commaIndex + 2);

    // Returning the data we got
    return output;

}

// var testingCounter = -1;
// var state = "LAUNCH_READY";
// var PLState = "N";
// var startingAltitude = 0;


// function testing(event) {


//     // TEAM_ID,MISSION_TIME,PACKET_COUNT,SW_STATE,PL_STATE,ALTITUDE,TEMP,VOLTAGE,GPS_LATITUDE,GPS_LONGITUDE,GYRO_R,GYRO_P, GYRO_Y\n

//     var x = event.clientX / 2;
//     var y = 570 - event.clientY;

//     var altitude = y;

//     if (altitude < 510 && altitude > 10 && state != "DESCENT" && state != "LANDED" && state != "SEPARATE") { // If the altitude is more than 10 but less than 510 it is ascending
//         state = "ASCENT";
//     } else if (altitude >= startingAltitude + 510) { // If it is more than 510 meters up, it should be separating
//         // Making sure that the servo is in
//         // pullInServo();
//         PLState = "R";
//         state = "SEPARATE";
//     } else if (altitude < startingAltitude + 510 && altitude > startingAltitude + 10 && (state == "SEPARATE" || state == "DESCENT")) {
//         state = "DESCENT";
//     } else if (altitude < startingAltitude + 10 && state != "LAUNCH_READY") {
//         state = "LANDED";
//         // digitalWrite(buzzerPin, HIGH); // Turning on the buzzer
//     }

//     var roll = x / 1000 * 180;
//     var pitch = y * 18 / 100;
//     var yaw = x != 0 ? (y / x) * 180 : 0.0;

//     testingCounter++;
//     var testingData = "CanSat Team 3, " + testingCounter + ", " + testingCounter + ", " + state + ", " + PLState + ", " + y + ", " + x + ", " + ((3 * x + y) / 4) + ", " + x + ", " + y + ", " + roll + ", " + pitch + ", " + yaw;

//     displayData(testingData);

// }

// document.addEventListener("click", testing);