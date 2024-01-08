// script.js
$(document).ready(function () {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let currentPlayer = 1;
    let playerScores = { 1: 0, 2: 0 };
    let playerNames = { 1: '', 2: '' };
 let countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
    "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
    "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
    "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
    "North Korea", "South Korea", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives",
    "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
    "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
    "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];
    let countriesGuessed = [];

    function startGame() {
        // Get player names
        playerNames[1] = prompt("Enter Player 1's name:");
        playerNames[2] = prompt("Enter Player 2's name:");

        // Display player names, turn, and remaining countries counter
        $('#player1-name').text(playerNames[1]);
        $('#player2-name').text(playerNames[2]);
        updateTurnDisplay();
        updateRemainingCounter();
        clearResults();

        $('#start-button').prop('disabled', true);
        $('#country-input').prop('disabled', false);
        $('#hint-button').prop('disabled', false);
        $('#submit-button').prop('disabled', false);

        // Choose a random letter
        let randomIndex = Math.floor(Math.random() * letters.length);
        let randomLetter = letters.charAt(randomIndex);
        $('#letter').text('Letter: ' + randomLetter);

        $('#submit-button').on('click', function () {
            let country = $('#country-input').val();
            checkCountry(country);
        });

        $('#hint-button').on('click', function () {
            provideHint(randomLetter);
        });
    }

    function checkCountry(country) {
        // Validate the country against the chosen letter and the list of countries
        let currentLetter = $('#letter').text().charAt(8);
        let validCountry = countries.find(c => c.toUpperCase().startsWith(currentLetter) && c.toUpperCase() === country.toUpperCase());

        if (validCountry) {
            $('#result').text('Correct! ' + playerNames[currentPlayer] + ' scores.');
            playerScores[currentPlayer]++;
            countriesGuessed.push({ name: validCountry, player: currentPlayer });
            currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players
        } else {
            endGame();
        }

        // Update scores, turn display, remaining countries counter, guessed countries, and clear input field
        updateScores();
        updateTurnDisplay();
        updateRemainingCounter();
        updateGuessedCountries();
        $('#country-input').val('');
    }

    function provideHint(currentLetter) {
        // Find a country with the given letter that hasn't been guessed yet
        let hintCountry = countries.find(c => c.toUpperCase().startsWith(currentLetter) && !countriesGuessed.some(guessed => guessed.name === c));

        if (hintCountry) {
            alert('Hint: ' + hintCountry.substring(0, 2));
        } else {
            alert('No more hints available for this letter.');
        }
    }

    function updateScores() {
        $('#score1').text(playerScores[1]);
        $('#score2').text(playerScores[2]);
    }

    function updateTurnDisplay() {
        $('#turn-display').text('Turn: ' + playerNames[currentPlayer]);
    }

    function updateRemainingCounter() {
        let currentLetter = $('#letter').text().charAt(8);
        let remainingCountries = countries.filter(c => c.toUpperCase().startsWith(currentLetter) && !countriesGuessed.some(guessed => guessed.name === c)).length;
        let totalCountries = countries.filter(c => c.toUpperCase().startsWith(currentLetter)).length;

        $('#remaining-counter').text(`${remainingCountries}/${totalCountries} remaining`);
    }

    function updateGuessedCountries() {
        let listContainer = $('#guessed-countries');
        listContainer.empty();

        let currentLetter = $('#letter').text().charAt(8);

        // Get the unique set of countries guessed for the current letter
        let uniqueGuessedCountries = [...new Set(countriesGuessed.filter(guessed => guessed.name.toUpperCase().startsWith(currentLetter)).map(guessed => guessed.name))];

        for (let i = 0; i < uniqueGuessedCountries.length; i++) {
            let country = uniqueGuessedCountries[i];
            let isGuessedByPlayer1 = countriesGuessed.some(guessed => guessed.name === country && guessed.player === 1);
            let isGuessedByPlayer2 = countriesGuessed.some(guessed => guessed.name === country && guessed.player === 2);

            if (isGuessedByPlayer1 && isGuessedByPlayer2) {
                listContainer.append(`<span style="color: green">${country} (${playerNames[1]}, ${playerNames[2]})</span>`);
            } else if (isGuessedByPlayer1) {
                listContainer.append(`<span style="color: green">${country} (${playerNames[1]})</span>`);
            } else if (isGuessedByPlayer2) {
                listContainer.append(`<span style="color: green">${country} (${playerNames[2]})</span>`);
            } else {
                // Should not reach here, as we are filtering unique guessed countries for the current letter
            }

            if (i < uniqueGuessedCountries.length - 1) {
                listContainer.append(', ');
            }
        }
    }

    function clearResults() {
        $('#result').text('');
        $('#guessed-countries').empty();
    }

    function endGame() {
        $('#result').text(playerNames[currentPlayer] + ' cannot name a country. ' + playerNames[currentPlayer === 1 ? 2 : 1] + ' wins!');
        $('#country-input').prop('disabled', true);
        $('#hint-button').prop('disabled', true);
        $('#submit-button').prop('disabled', true);
        $('#start-button').prop('disabled', false);
        $('#submit-button').off('click');
        $('#hint-button').off('click');

        // Print the list of countries for the chosen letter
        printCountryList();
    }

    function printCountryList() {
        let listContainer = $('#country-list');
        listContainer.empty();

        let currentLetter = $('#letter').text().charAt(8);
        let validCountries = countries.filter(c => c.toUpperCase().startsWith(currentLetter));

        for (let i = 0; i < validCountries.length; i++) {
            let country = validCountries[i];
            let isGuessed = countriesGuessed.some(guessed => guessed.name === country);
            let color = isGuessed ? 'green' : 'red';

            if (isGuessed) {
                let player = countriesGuessed.find(guessed => guessed.name === country).player;
                listContainer.append(`<span style="color: ${color}">${country} (${playerNames[player]})</span>`);
            } else {
                listContainer.append(`<span style="color: ${color}">${country}</span>`);
            }

            if (i < validCountries.length - 1) {
                listContainer.append(', ');
            }
        }
    }

    $('#start-button').on('click', startGame);
});
