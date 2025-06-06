let numberOfDiceSelected = 0
let typeOfDiceSelected = ''
const numberSelectedEl = document.getElementById('selectedNumber')
const typeSelectedEl = document.getElementById('selectedType')

const stats = {
    d4: { timesRolled: 0, results: 0 },
    d6: { timesRolled: 0, results: 0 },
    d8: { timesRolled: 0, results: 0 },
    d10: { timesRolled: 0, results: 0 },
    d12: { timesRolled: 0, results: 0 },
    d20: { timesRolled: 0, results: 0 },
    d100: { timesRolled: 0, results: 0 }
}

const handleNumberSelect = function (event) {
    if (event.target.matches('li')) {
        numberOfDiceSelected = parseInt(event.target.textContent)
        numberSelectedEl.innerHTML = numberOfDiceSelected
    }

}

const handleTypeSelect = function (event) {
    if (event.target.matches('li')) {
        typeOfDiceSelected = event.target.textContent
        typeSelectedEl.innerHTML = typeOfDiceSelected
    }

}

const generateSides = function (diceNumber) {
    const possibleSides = []
    for (let i = 1; i <= diceNumber; i++) {
        possibleSides.push(i)
    }
    return possibleSides
}

const handleRoll = function () {
    let sides = 0

    switch (typeOfDiceSelected) {
        case "d4": {
            sides = generateSides(4);
            break;
        }
        case "d6": {
            sides = generateSides(6);
            break;
        }
        case "d8": {
            sides = generateSides(8);
            break;
        }
        case "d10": {
            sides = generateSides(10);
            break;
        }
        case "d12": {
            sides = generateSides(12);
            break;
        }
        case "d20": {
            sides = generateSides(20);
            break;
        }
        case "d100": {
            sides = generateSides(100);
            break;
        }

        default: return

    }

    rollDice(numberOfDiceSelected, sides, typeOfDiceSelected)
    renderSelections(typeOfDiceSelected)
}

const renderSelections = function (type) {
    document.getElementById(`${type}-number`).textContent = numberOfDiceSelected
    readLocalStorage(type)
}

const rollDice = function (number, sides, type) {

    let timesRolled = 0

    const currentResults = []

    const currentStats = JSON.parse(localStorage.getItem('stats')) || stats

    while (timesRolled < number) {
        let sideSelected = Math.floor(Math.random() * sides.length)
        currentStats[type].results += sideSelected
        currentResults.push(sideSelected)
        localStorage.setItem('currentResults', JSON.stringify(currentResults))

        timesRolled++

    }
    getCurrentResults()
    currentStats[type].timesRolled += timesRolled
    localStorage.setItem('stats', JSON.stringify(currentStats))

}

const readLocalStorage = function (type) {
    const currentStats = JSON.parse(localStorage.getItem('stats')) || stats
    document.getElementById(`${type}-rolls`).textContent = currentStats[type].timesRolled


}
const displayAverages = function (type) {
    const currentStats = JSON.parse(localStorage.getItem('stats')) || stats

    console.log(currentStats[type])
}
const getCurrentResults = function () {
    const results = JSON.parse(localStorage.getItem("currentResults")) || [];
    const currentResultsEl = document.getElementById('currentResults');
    currentResultsEl.innerHTML = ''; // Clear previous results

    results.forEach(function (result, idx) {
        const newResultEl = document.createElement('li');
        newResultEl.className = 'list-group-item';
        newResultEl.textContent = result;
        currentResultsEl.appendChild(newResultEl);

        // Add separator if not the last result
        if (idx < results.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'roll-separator';
            sep.textContent = '|';
            currentResultsEl.appendChild(sep);
        }
    });
}

const updateModalContent = function () {
    const currentStats = JSON.parse(localStorage.getItem('stats')) || stats;
    const totalRollsElement = document.getElementById('totalRolls');
    const averageResultsElement = document.getElementById('averageResults');

    let totalRolls = 0;
    let totalResults = 0;

    for (const type in currentStats) {
        if (Object.hasOwnProperty.call(currentStats, type)) {
            const element = currentStats[type];
            totalRolls += element.timesRolled;
            totalResults += element.results;
        }
    }

    const averageResults = totalRolls ? (totalResults / totalRolls).toFixed(2) : 0;

    totalRollsElement.textContent = `Total Rolls: ${totalRolls}`;
    averageResultsElement.textContent = `Average Results: ${averageResults}`;
}

const resetBtn = document.getElementById("resetButton");

function handleClick() {
    window.location.reload();
}

const displayAveragesInModal = function () {
    const currentStats = JSON.parse(localStorage.getItem('stats')) || stats
    let timesRolled = 0
    let results = 0
    const keysArray = Object.keys(currentStats);
    const count = keysArray.length;
    console.log(count)
    for (const key in currentStats) {
        if (Object.hasOwnProperty.call(currentStats, key)) {
            const element = currentStats[key];
            if (!isNaN(element.timesRolled) && !isNaN(element.results)) {
                timesRolled += element.timesRolled
                results += element.results
            }
        }
    }
    console.log(timesRolled)
    console.log(results)
    document.getElementById('totalRolls').textContent = '# of rolls: ' + timesRolled

    document.getElementById('averageResults').textContent = 'Avg # rolled: ' + (results / count).toFixed(0);
}

document.getElementById('rollTable').addEventListener('click', function (event) {
    if (event.target.matches('button')) {
        const diceRow = event.target.parentElement.parentElement
        const diceType = diceRow.getAttribute('id').split('-')[0]
        displayAverages(diceType)
        displayAveragesInModal()

    }

})

resetBtn.addEventListener('click', handleClick);

document.getElementById('numberOfDice').addEventListener('click', function (event) {
    if (event.target.classList.contains('dropdown-item')) {
        document.getElementById('numberOfDiceInfo').textContent = `Number of Dice: ${event.target.textContent}`;
    }
});

document.getElementById('typeOfDice').addEventListener('click', function (event) {
    if (event.target.classList.contains('dropdown-item')) {
        document.getElementById('typeOfDiceInfo').textContent = `Type of Dice: ${event.target.textContent}`;
    }
});
document.getElementById('exampleModal').addEventListener('show.bs.modal', updateModalContent);

document.querySelector('#numberOfDice').addEventListener('click', handleNumberSelect)

document.querySelector('#typeOfDice').addEventListener('click', handleTypeSelect)

document.querySelector('#rollButton').addEventListener('click', handleRoll)

const resetStats = function () {
    // Reset the stats object
    for (const type in stats) {
        if (Object.hasOwnProperty.call(stats, type)) {
            stats[type].timesRolled = 0;
            stats[type].results = 0;
        }
    }

    // Update local storage
    localStorage.setItem('stats', JSON.stringify(stats));

    // Update the modal content
    updateModalContent();
}

// Attach the reset function to the reset button's click event
document.getElementById('resetStatsButton').addEventListener('click', resetStats);

function renderCurrentResults(groups) {
    const currentResultsEl = document.getElementById('currentResults');
    currentResultsEl.innerHTML = '';

    groups.forEach((group, idx) => {
        // Create a list item for the group
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = group.join(', ');
        currentResultsEl.appendChild(li);

        // Add separator if not the last group
        if (idx < groups.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'roll-separator';
            sep.textContent = '|';
            currentResultsEl.appendChild(sep);
        }
    });
}

// Example usage:
// renderCurrentResults([[3, 15, 7], [12, 4], [20]]);