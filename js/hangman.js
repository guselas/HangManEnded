//======================================================================
// VARIABLES
//======================================================================

const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user');
const level = urlParams.get('level');
//to force user to set Name & level
if (user == "" || level == undefined) {
    location.href = "/UserLogin.html";
    alert("Has de poner tu alias de Jugador y escoger un nivel de dificultad para poder empezar a jugar titu!")
}

const sayingList = [
    ["A buenas horas mangas verdes", "Llegas tarde colega ", 0],
    ["A falta de pan buenas son tortas", "Si no hay pan, caeran tortas", 0],
    ["A la tercera va la vencida", "Ni una, ni dos, sino tres", 0],
    ["A rey muerto rey puesto", "Se nos murio Luis XIV", 0],
    ["El que mucho abarca poco aprieta", "¿Abarcas o apriestas?", 0],
    ["El que no corre vuela", "Que velocidad cogia Mr. Gump", 0],
    ["No hay mal que por bien no venga", "Dicen que todo pasa por algo", 1],
    ["Quien duerme mucho poco aprende", "Hay que descansar para aprender bien no?", 1],
    ["No hay peor ciego que el que no quiere ver", "Obcecarse te limita la perspectiva", 1],
    ["A donde las dan las toman", "Si me la das te la devuelvo", 1],
    ["Contra el feo vicio de pedir existe la noble virtud de no dar", "Cada dia mas catalan", 2],
    ["De tal palo tal astilla", "Si rompo un palo le salen hijos", 1],
    ["En casa de herrero cuchara de palo", "Cucharas de metal o de madera", 2],
    ["Al que no quiere caldo se le dan dos tazas", "No digas de este agua no beberé, ni de este caldo no tomaré", 2],
    ["A todo marrano le llega su San Martin", "De cerdos en fiesta va este", 2],
    ["No hay mal que dure cien años ni cuerpo que lo resista", "El ser humano puede con el mundo en sus hombros", 2],
    ["Cuanto mas vieja más pelleja", "Al viejo por el pellejo", 2],
    ["Del dicho al hecho hay un buen trecho", "Dicho y no hecho", 2]
];

// subir el ahorcado a https://dashboard.heroku.com/apps en formato php.
const colClue = 1;
const colSaying = 0;
let sayingToGuess = [];
let sayingToShow = [];
let historicLetterUser = [];
let clue = "";
let numberOfTries = 3;
let letterNode = document.querySelector('#letter');
let buttonNode = document.querySelector('#button_check');
let resultNode = document.querySelector('#result');
let nodeTries = document.querySelector('#tries');
let historicNode = document.querySelector('#historic');
let clueNode = document.querySelector('#clue');
let userNode = document.querySelector('#userId');
let dificultyNode = document.querySelector('#dificultyId');

//======================================================================
// FUNCTIONS
//======================================================================

function filterLevel(element) {
    return element[2] <= level;
}

function startGame() {
    sayingToGuess = [];
    sayingToShow = [];
    historicLetterUser = [];
    clue = "";
    numberOfTries = 3;
    let sayingsLevel = sayingList.filter(filterLevel);
    //https://underscorejs.org/#random

    let sayingListRandomPos = _.random(sayingsLevel.length - 1);
    let randomSaying = sayingsLevel[sayingListRandomPos][colSaying];
    clue = sayingsLevel[sayingListRandomPos][colClue];
    randomSaying = randomSaying.toLowerCase();
    sayingToGuess = randomSaying.split('');
    var counter = 0;
    for (let letter of sayingToGuess) {
        if (randomSaying.charCodeAt(counter) == 32) {
            sayingToShow.push(' ');
        }
        else {
            sayingToShow.push('_');
        }
        counter++;
    }
    drawGame();
}

function sayingToHtml(value) {
    let result = "";
    for (let letter of value) {
        if (letter == " ") {
            result += "&nbsp;" + "&nbsp";
        } else {
            result += letter;
        }
    }
    return result;
}

function strLevel(level) {
    switch (level) {
        case "0":
            return "facil";
        case "1":
            return "intermedio";
        case "2":
            return "dificultad abuelesca";
        default:
            return "No has escogido nivel de dificultad";
    }
}

function drawGame() {
    userNode.textContent = user;
    dificultyNode.textContent = strLevel(level);
    clueNode.textContent = clue;
    resultNode.innerHTML = sayingToHtml(sayingToShow);
    nodeTries.textContent = numberOfTries;
    historicNode.textContent = historicLetterUser.join(', ');
    showHangImg(numberOfTries);

    var divCurrentGame = document.getElementById('currentGameId');
    var divNewGame = document.getElementById('newGameId');
    if (numberOfTries == 0) {
        divNewGame.style.display = "block";
        divCurrentGame.style.display = "none";
    }
    else {
        divNewGame.style.display = "none";
        divCurrentGame.style.display = "block";
    }
}

function isLetter(ch) {
    return "abcdefghijklmnñopqrstuvwxyz".indexOf(ch.toLowerCase()) >= 0;
}

function checkUserLetter() {
    let userLetter = letterNode.value;
    // Refreshh input for user write a new letter
    letterNode.value = '';
    letterNode.focus();
    if (isLetter(userLetter)) {
        for (const [position, letterToGuess] of sayingToGuess.entries()) {

            if (userLetter == letterToGuess) {
                sayingToShow[position] = letterToGuess;
            }
        }
        if (!sayingToGuess.includes(userLetter)) {
            numberOfTries -= 1;
            historicLetterUser.push(userLetter);
        }
        //is the game Over?
        endGame();
        drawGame();
    }
}

function checkEnter(event) {
    if (event.code == 'Enter') {
        checkUserLetter();
    }
}

function endGame() {

    if (!sayingToShow.includes('_')) {
       
        alert('¡Has adivinado el refran, sabes de refraneo tanto como tu abuel@!' + "\n"+ sayingToGuess.join(''));
        drawGame();
        startGame();
    }
    if (numberOfTries == 0) {
        alert('Has Perdido!El refran era: ' + sayingToGuess.join(''));
        drawGame();
    }
}

function srcHangImg(tries) {
    switch (tries) {
        case 3:
            return "assets/hang_hang_toy.jpg";
        case 2:
            return "assets/head_hang_toy.jpg";
        case 1:
            return "assets/head_Chess_hang_toy.jpg";
        case 0:
            return "assets/chukNorrisGotYou.jpg";
    }
}

function showHangImg(tries) {
    var img = document.getElementById("hangManImg");
    img.src = srcHangImg(tries);
}

//======================================================================
// EVENTS
//======================================================================
buttonNode.addEventListener('click', checkUserLetter);
letterNode.addEventListener('keyup', checkEnter);
//======================================================================
// START
//======================================================================
startGame();