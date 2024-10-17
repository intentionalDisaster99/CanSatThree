function changeCoordinates(event) {
    // Getting the different document details
    var lat = document.getElementById("lat");
    var long = document.getElementById("long");

    // Changing the details of what the thing is saying
    lat.innerText = "Latitude: " + event.clientY;
    long.innerText = "Longitude: " + event.clientX;
}

document.addEventListener("mousemove", changeCoordinates);
