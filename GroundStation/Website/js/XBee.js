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

    // Showing the data on the website
    var showing = document.getElementById("packet-display");
    showing.textContent = "Most Recent Packet: " + data.toString();;

    // First things first, checking the teamID to make sure it matches
    var teamIDFound = data[0];
    // if (teamIDFound == TEAM_ID) {
    // Only use this for debugging, otherwise it gets messy
    // console.log("Correct Packet Received");
    // } else {
    // console.log("Incorrect Team ID Identified:");
    // console.log(teamIDFound);
    // }

    // Saving the time because we will be using it for basically all of the data
    var temp = String(data[1]);

    // Now interpreting the time into seconds
    var time = 0;
    time = Number(temp.substring(0, 2)) * 3600 + Number(temp.substring(4, 6)) * 60 + Number(temp.substring(7, 9)) + Number(temp.substring(11, 13)) / 100;
    // console.log(temp.substring(7, 9));

    // Checking the packet count against the last one to make sure none have been skipped
    var incomingPacketNumber = data[2];
    // if (!(packetCount == incomingPacketNumber || packetCount - 1 == incomingPacketNumber)) { console.log("A packet has either been missed or come in the wrong order : " + incomingPacketNumber + " " + packetCount); }

    if (packetCount == incomingPacketNumber) return;
    packetCount = Number(incomingPacketNumber);


    // Showing the user the state of the payload
    var swState = data[3];
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
    if (data[4] == "R" && indicator.textContent != "PAYLOAD RELEASED") {
        indicator.textContent = "PAYLOAD RELEASED";
        indicator.style = "text-align: center; height: 100%; background-color: chartreuse; width:25ex; margin-left:15%; text-wrap:nowrap";
    }

    // Updating the altitude graph
    graphAltitude(time, Number(data[5]));

    // Updating the temperature graph
    graphTemperature(time, Number(data[6]));

    // Updating the voltage graph
    console.log("Passing in " + (data[7]) + " as voltage.");
    graphVoltage(time, Number(data[7]));

    // Updating the location
    changeCoordinates(Number(data[8]), Number(data[9]));

    // Updating the orientation data
    var roll = Number(data[10]);
    var pitch = Number(data[11]);
    var yaw = Number(data[12].substring(2));
    graphOrientation(time, roll, pitch, yaw);
    console.log("Done graphing");

}

const csvUrl = 'http://localhost:8081/telemetry.csv';

// Function to fetch and display data from the CSV file
function fetchAndDisplayData() {
    fetch(csvUrl)
        .then(response => response.text()) // Read CSV as text
        .then(csvText => {
            // Parse CSV text into rows
            const rows = csvText.split('\n').map(row => row.split(','));
            if (rows.length > 0 && rows[rows.length - 2] != undefined) {
                // Get the most recent row of data and display it
                displayData(rows[rows.length - 2]); // Display the last row
            }
        })
        .catch(error => console.error('Error fetching CSV:', error));
}

// Fetch and display data every second
setInterval(fetchAndDisplayData, 1000);

// Function to load and graph the CSV data on page load
function loadAndGraphCsvData() {
    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            // Parse CSV text into rows
            const rows = csvText.split('\n').map(row => row.split(','));

            // Check if there is data
            if (rows.length > 1) {
                // Start processing from the second line (skip headers)
                for (let i = 1; i < rows.length - 1; i++) {
                    displayData(rows[i]);
                }
            }
        })
        .catch(error => console.error('Error loading and graphing CSV data:', error));
}

// Call this function on page load
window.onload = loadAndGraphCsvData;
