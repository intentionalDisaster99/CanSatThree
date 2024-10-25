function changeCoordinates(x, y) {
    // Getting the different document details
    var lat = document.getElementById("lat");
    var long = document.getElementById("long");

    // Changing the details of what the thing is saying
    lat.innerText = "Latitude: " + x; //event.clientY;
    long.innerText = "Longitude: " + y; //event.clientX;
}

// document.addEventListener("mousemove", changeCoordinates);
