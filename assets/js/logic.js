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
    const results = JSON.parse(localStorage.getItem("currentResults")) || []
    results.forEach(function (result) {
        const newResultEl = document.createElement('p')
        newResultEl.textContent = result
        document.getElementById('currentResults').appendChild(newResultEl)

    });

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

resetBtn.addEventListener("click", handleClick);

document.querySelector('#numberOfDice').addEventListener('click', handleNumberSelect)

document.querySelector('#typeOfDice').addEventListener('click', handleTypeSelect)

document.querySelector('#rollButton').addEventListener('click', handleRoll)