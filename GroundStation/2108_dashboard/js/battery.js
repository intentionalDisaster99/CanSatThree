// This is just example code because it works with the laptop, not the CanSat

function updateBatteryStatus(battery) {
    document.getElementById('battery-level')
        .textContent =
        `${battery.level * 100}%`;


    document.getElementById('charging-status')
        .textContent =
        `${battery.charging ? 'Yes' : 'No'}`;
}






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