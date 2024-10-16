// This is just example code because it works with the laptop, not the CanSat

function updateBatteryStatus(battery) {

    // Finding and formatting the battery percentage
    let percentString = "" + battery.level * 100;

    document.getElementById('battery-level')
        .textContent = percentString.substring(0, 4) + "%";

    if (battery.level <= 100) {
        batteryInner.style.width = battery.level * 100 + '%';
    }

    // Printing out the value if it changes
    // console.log(battery.level);


}

// Updating the battery

// Updating the battery
setInterval(() => {
    navigator.getBattery().then(function (battery) {
        // Battery Information
        updateBatteryStatus(battery);
    });
}, 100);



navigator.getBattery().then(function (battery) {
    // Battery Information
    updateBatteryStatus(battery);

    // Event Listeners for the Battery API
    battery.addEventListener('chargingchange',
        function () {
            updateBatteryStatus(battery);
        });

    battery.addEventListener('chargingtimechange',
        function () {
            updateBatteryStatus(battery);
        });
});