// The function that changes the background of the website to light mode
function changeBackground() {

    // Getting elements
    var toChange = document.getElementById('main');
    var button = document.getElementById('modeChange');
    var navbar = document.getElementById('navbar');
    var cardLabels = document.getElementsByClassName('card-title');
    var coords = document.getElementsByClassName('coord');

    // Changing the right way
    if (button.textContent == "Light Mode") {

        // If I want to change it to an image
        // toChange.style.backgroundImage = "url('../img/BlackHoleBackground.png')";

        // Changing it to a solid white
        toChange.style.backgroundImage = "none";
        toChange.style.backgroundColor = "white";

        // Changing the navbar
        navbar.classList.remove('navbar-dark', 'bg-dark');
        navbar.classList.add('navbar-light');

        // Changing the class of the card titles
        for (let item of cardLabels) {

            item.classList.remove("card-title-darkMode");
            item.classList.add("card-title-lightMode");

        }

        // Changing the class of the coordinates
        for (let item of coords) {

            item.style.color = "black";

        }

        // Changing the button to allow them to change it back to dark mode
        button.textContent = "Dark Mode";

        // Changing the colors of the graph to black


    } else {

        // Changing it to the picture that we have
        toChange.style.backgroundImage = "url('../img/BlackHoleBackground.png')";
        toChange.style.backgroundColor = "transparent";

        // Changing the navbar
        navbar.classList.remove('navbar-light');
        navbar.classList.add('navbar-dark', 'bg-dark');

        // Changing the class of the card titles
        for (let item of cardLabels) {

            item.classList.remove("card-title-lightMode");
            item.classList.add("card-title-darkMode");

        }

        // Changing the class of the coordinates
        for (let item of coords) {

            item.style.color = "white";

        }

        // Changing the button to allow them to change it back to dark mode
        button.textContent = "Light Mode";

    }


}

changeBackground();
