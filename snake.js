//Das Spiel Feld und Das Score Feld erwähnen
const scoreCanvas = document.getElementById("score");
const scoreCtx = scoreCanvas.getContext("2d");
const canvas = document.getElementById("spielfeld")
const ctx = canvas.getContext("2d")

//Für handy spielbar
function resizeCanvas() {
    canvas.height = 800;
    canvas.width = 800;
    scoreCanvas.width = 600;
    scoreCanvas.height = 60; // Score-Feld bleibt kleiner
    initSnake();
}

//Apfel Bild
const apfelIcon = new Image();
apfelIcon.src = "images/Apfel.png"; // Passe den Pfad ggf. an!
let apfelIconGeladen = false;
apfelIcon.onload = () => {
    apfelIconGeladen = true; };

//Bananen Bild
const bananeIcon = new Image();
bananeIcon.src = "images/Banane.png"; // Passe den Pfad ggf. an!
let bananeIconGeladen = false;
bananeIcon.onload = () => {
    bananeIconGeladen = true; };

//Melonen Bild
const meloneIcon = new Image();
meloneIcon.src = "images/Melone.png"; // Passe den Pfad ggf. an!
let meloneIconGeladen = false;
meloneIcon.onload = () => {
    meloneIconGeladen = true; };

//Kokosnuss Bild
const KokosnussIcon = new Image();
KokosnussIcon.src = "images/Kokosnuss.png"; // Passe den Pfad ggf. an!
let KokosnussIconGeladen = false;
KokosnussIcon.onload = () => {
    KokosnussIconGeladen = true;};

//Blaubeere Bild
const BlaubeereIcon = new Image();
BlaubeereIcon.src = "images/Blaubeere.png";
let BlaubeereIconGeladen = false;
BlaubeereIcon.onload = () => {
    BlaubeereIconGeladen = true; };

//Kirschen Bild
const KirschenIcon = new Image();
KirschenIcon.src = "images/Kirschen.png";
let KirschenIconGeladen = false;
KirschenIcon.onload = () => {
    KirschenIconGeladen = true; };

//Orange Bild
const OrangeIcon = new Image();
OrangeIcon.src = "images/Orange.png";
let OrangeIconGeladen = false;
OrangeIcon.onload = () => {
    OrangeIconGeladen = true; };

//Trauben Bild
const TraubenIcon = new Image();
TraubenIcon.src = "images/Trauben.png";
let TraubenIconGeladen = false;
TraubenIcon.onload = () => {
    TraubenIconGeladen = true; };

//Zitrone Bild
const ZitroneIcon = new Image();
ZitroneIcon.src = "images/Zitrone.png";
let ZitroneIconGeladen = false;
ZitroneIcon.onload = () => {
    ZitroneIconGeladen = true; };

//Donut Bild
const DonutIcon = new Image();
DonutIcon.src = "images/Donut.png";
let DonutIconGeladen = false;
DonutIcon.onload = () => {
    DonutIconGeladen = true; };

//Keks Bild
const KeksIcon = new Image();
KeksIcon.src = "images/Keks.png";
let KeksIconGeladen = false;
KeksIcon.onload = () => {
    KeksIconGeladen = true; };

//süßes Bild
const suessesIcon = new Image();
suessesIcon.src = "images/süßes.png";
let suessesIconGeladen = false;
suessesIcon.onload = () => {
    suessesIconGeladen = true; };

//Schlangen Bild
const snakeHeadImg = new Image();
snakeHeadImg.src = "images/Schlangen-Kopf.png";   // Passe den Pfad ggf. an!
let snakeHeadImgLoaded = false;
snakeHeadImg.onload = () => { snakeHeadImgLoaded = true; };

const snakeBodyImg = new Image();
snakeBodyImg.src = "images/Schlangen-Körper.png";   // Passe den Pfad ggf. an!
let snakeBodyImgLoaded = false;
snakeBodyImg.onload = () => { snakeBodyImgLoaded = true; };

//Gitter
const gridSize = 20;      // feste Feldgröße (Pixel)
const gridCount = 20;    // Anzahl Felder pro Reihe/Spalte

//Variablen festlegen
let lastTapTime = 0;
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;
let direction = "right" // start richtung von der schlange
let gameOver = false; //GameOver
let snake = [{ x: 0, y: 20 }];
let score = 0; // score

//Variablen festlegen ( Koordinaten )
let appleX, appleY;
let bananaX, bananaY;
let meloneX, meloneY;
let kokosnussX, kokosnussY;
let BlaubeereX, BlaubeereY;
let KirschenX, KirschenY;
let OrangeX, OrangeY;
let TraubenX, TraubenY;
let ZitroneX, ZitroneY;
let DonutX, DonutY;
let KeksX, KeksY;
let suessesX, suessesY;

// Score-Funktion (zeichnet den Score im blauen Kasten)
function updateScore() {
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    scoreCtx.font = "24px Arial";
    scoreCtx.fillStyle = "blue";
    scoreCtx.textAlign = "left";
    scoreCtx.fillText("Score: " + score, 10, 35);
}
// Am Anfang Score anzeigen
updateScore();

//Pfeil richtungen
document.addEventListener("keydown", function(event) {
    if (gameOver && event.key === "Enter") {
        gameOver = false;
        resetGame();
    }
    if (event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
})
//Touch funktionen
canvas.addEventListener('touchstart', function(event) {
    // Nur einen Finger beachten
    if(event.touches.length === 1){
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        event.preventDefault(); // Verhindert Scrollen beim Touchstart!
    }
});

canvas.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();

    // Double Tap
    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300 && gameOver) { // Nur wenn gameOver!
        gameOver = false;
        resetGame();
    }
    lastTapTime = currentTime;

    event.preventDefault(); // Verhindert Scrollen beim Touchend!
});

canvas.addEventListener('touchmove', function(event) {
    event.preventDefault(); // Verhindert Scrollen beim Bewegen des Fingers auf dem Canvas!
});

// Prüfe, ob Feld frei ist (weder Schlange noch andere Frucht)
function isFree(x, y, excludePositions = []) {
    // Prüfen, ob auf der Schlange
    for (let part of snake) {
        if (part.x === x && part.y === y) return false;
    }
    // Prüfen, ob Position ausgeschlossen (z.B. Apfel beim Bananen-Spawn)
    for (let pos of excludePositions) {
        if (pos.x === x && pos.y === y) return false;
    }
    return true;
}

function initSnake() {
    // Schlange startet oben links im Spielfeld (x=0, y=0)
    snake = [{ x: 0, y: 20 }];
}

 //Den apfel generieren
function generateApple() {
    let maxX = Math.floor(canvas.width / gridSize);
    let maxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxX) * gridSize;
        y = Math.floor(Math.random() * maxY) * gridSize;
    } while (!isFree(x, y, [
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    appleX = x;
    appleY = y;
}

// Die Banane generieren
function generateBanane() {
    let maxxX = Math.floor(canvas.width / gridSize);
    let maxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxX) * gridSize;
        y = Math.floor(Math.random() * maxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    bananaX = x;
    bananaY = y;
}

// Die Melone generieren
function generateMelone() {
    let maxxxX = Math.floor(canvas.width / gridSize);
    let maxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    meloneX = x;
    meloneY = y;
}

// Die Kokosnuss generieren
function generateKokosnuss() {
    let maxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    kokosnussX = x;
    kokosnussY = y;
}

// Die Blaubeere generieren
function generateBlaubeere() {
    let maxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    BlaubeereX = x;
    BlaubeereY = y;
}

// Die Kirschen generieren
function generateKirschen() {
    let maxxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    KirschenX = x;
    KirschenY = y;
}

// Die Orange generieren
function generateOrange() {
    let maxxxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: TraubenX, y: TraubenY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    OrangeX = x;
    OrangeY = y;
}

// Die Trauben generieren
function generateTrauben() {
    let maxxxxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: ZitroneX, y: ZitroneY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    TraubenX = x;
    TraubenY = y;
}

// Die Zitrone generieren
function generateZitrone() {
    let maxxxxxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    ZitroneX = x;
    ZitroneY = y;
}

// Der Donut generieren
function generateDonut() {
    let maxxxxxxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: KeksX, y: KeksY },
        { x: suessesX, y: suessesY }
    ]));
    DonutX = x;
    DonutY = y;
}

// Der Keks generieren
function generateKeks() {
    let maxxxxxxxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxxxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxxxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxxxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: DonutX, y: DonutY },
        { x: suessesX, y: suessesY }
    ]));
    KeksX = x;
    KeksY = y;
}

// Das suesse generieren
function generatesuesses() {
    let maxxxxxxxxxxxxX = Math.floor(canvas.width / gridSize);
    let maxxxxxxxxxxxxY = Math.floor(canvas.height / gridSize);
    let x, y;
    do {
        x = Math.floor(Math.random() * maxxxxxxxxxxxxX) * gridSize;
        y = Math.floor(Math.random() * maxxxxxxxxxxxxY) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY },
        { x: kokosnussX, y: kokosnussY },
        { x: BlaubeereX, y: BlaubeereY },
        { x: KirschenX, y: KirschenY },
        { x: OrangeX, y: OrangeY },
        { x: TraubenX, y: TraubenY },
        { x: DonutX, y: DonutY },
        { x: KeksX, y: KeksY }
    ]));
    suessesX = x;
    suessesY = y;
}


//Die Schlange Generieren
    function moveSnake() {
        // neuen Kopf berechnen
        let newHead = { x: snake[0].x, y: snake[0].y };
        // Pfeil richtungen
        if (direction === "right") newHead.x += gridSize;
        if (direction === "left")  newHead.x -= gridSize;
        if (direction === "up")    newHead.y -= gridSize;
        if (direction === "down")  newHead.y += gridSize;
        snake.unshift(newHead);
        //Schlange soll wachsen
        if (newHead.x === appleX && newHead.y === appleY) { // wenn die schlange den apfel frisst
            score++ //score soll eins höher gehen
            updateScore();
            generateApple(); // Apfel neu generieren, aber nie auf Snake

        } else if (newHead.x === bananaX && newHead.y === bananaY) { // wenn die schlange die banane frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateBanane(); // Banane neu generieren, aber nie auf dem apfel

        } else if (newHead.x === meloneX && newHead.y === meloneY) { // wenn die schlange die Melone frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateMelone(); // Melone neu generieren

        } else if (newHead.x === kokosnussX && newHead.y === kokosnussY) { // wenn die schlange die Kokosnuss frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateKokosnuss(); // Kokosnuss neu generieren

        } else if (newHead.x === BlaubeereX && newHead.y === BlaubeereY) { // wenn die schlange die Blaubeere frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateBlaubeere(); // Blaubeere neu generieren

        } else if (newHead.x === KirschenX && newHead.y === KirschenY) { // wenn die schlange die Kirschen frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateKirschen(); // Kirschen neu generieren

        } else if (newHead.x === OrangeX && newHead.y === OrangeY) { // wenn die schlange die Orange frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateOrange(); // Orange neu generieren

        } else if (newHead.x === TraubenX && newHead.y === TraubenY) { // wenn die schlange die Trauben frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateTrauben(); // Trauben neu generieren

        } else if (newHead.x === ZitroneX && newHead.y === ZitroneY) { // wenn die schlange die Zitrone frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateZitrone(); // Zitrone neu generieren

        } else if (newHead.x === DonutX && newHead.y === DonutY) { // wenn die schlange den Donut frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateDonut(); // Donut neu generieren

        } else if (newHead.x === KeksX && newHead.y === KeksY) { // wenn die schlange den Keks frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateKeks(); // Keks neu generieren

        } else if (newHead.x === suessesX && newHead.y === suessesY) { // wenn die schlange das suesse frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generatesuesses(); // suesses neu generieren

        } else {
            // sonst: letztes Teil entfernen (Länge bleibt gleich)
            snake.pop();
        }
    }

function drawRotatedImage(image, x, y, size, direction) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    let angle = 0;
    switch (direction) {
        case "right": angle = 0; break;
        case "down":  angle = Math.PI / 2; break;
        case "left":  angle = Math.PI; break;
        case "up":    angle = -Math.PI / 2; break;
    }
    ctx.rotate(angle);
    ctx.drawImage(image, -size / 2, -size / 2, size, size);
    ctx.restore();
}
function getSegmentDirection(prev, curr) {
    if (curr.x > prev.x) return "right";
    if (curr.x < prev.x) return "left";
    if (curr.y > prev.y) return "down";
    if (curr.y < prev.y) return "up";
    return "right";
}
//Touch Richtung erkennen
function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Schwellenwert, damit kleine Wischbewegungen ignoriert werden:
    const threshold = 30; // Pixel

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontaler Swipe
        if (dx > threshold && direction !== "left") direction = "right";
        else if (dx < -threshold && direction !== "right") direction = "left";
    } else {
        // Vertikaler Swipe
        if (dy > threshold && direction !== "up") direction = "down";
        else if (dy < -threshold && direction !== "down") direction = "up";
    }
}
timer = null;

// Beim neustart vom game das alles wieder reset
function resetGame() {
    initSnake();
    direction = "right";
    score = 0;
    updateScore();
    generateApple();
    generateBanane();
    generateMelone();
    generateKokosnuss();
    generateBlaubeere();
    generateKirschen();
    generateOrange();
    generateTrauben();
    generateZitrone();
    generateDonut();
    generateKeks();
    generatesuesses();
    gameOver = false;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    timer = setInterval(gameLoop, 200);
}

    function gameLoop() {
        moveSnake()

        // Gewinn-Fall: Alle Felder sind gefüllt
        if (snake.length === gridCount * gridCount) {
            clearInterval(timer);
            gameOver = true;
            scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

            let centerX = scoreCanvas.width / 2;
            let centerY = scoreCanvas.height / 2;

            scoreCtx.textAlign = "center";
            scoreCtx.textBaseline = "middle";

            scoreCtx.font = "20px Arial";
            scoreCtx.fillStyle = "blue";
            scoreCtx.fillText("Gewonnen! :)", centerX, centerY - 10);

            scoreCtx.font = "15px Arial";
            scoreCtx.fillText("Drücke Enter oder tippe zweimal auf den Bildschirm, um neu zu starten!", centerX, centerY + 18);
            return;
        }

        // Prüfe, ob die Schlange aus dem Spielfeld raus ist
        let head = snake[0];
        if (
            head.x < 0 || head.x >= canvas.width ||
            head.y < 0 || head.y >= canvas.height
        ) {
            clearInterval(timer); // Spiel stoppen
            gameOver = true;
            // Optional: Game Over im Score-Canvas anzeigen
            scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

            let centerX = scoreCanvas.width / 2;
            let centerY = scoreCanvas.height / 2;

            scoreCtx.textAlign = "center";
            scoreCtx.textBaseline = "middle";

            scoreCtx.font = "24px Arial";
            scoreCtx.fillStyle = "red";
            scoreCtx.font = "15px Arial";
            scoreCtx.fillText("Game Over!", centerX, centerY - 10);
            scoreCtx.fillText("Drücke Enter oder tippe zweimal auf den Bildschirm, um neu zu starten!", centerX, centerY + 18);
            return; // Funktion abbrechen, damit nichts mehr gezeichnet wird

        }

        // Das spiel endet wenn, die schlange sich selbst berührt
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                clearInterval(timer);
                gameOver = true;
                scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);

                let centerX = scoreCanvas.width / 2;
                let centerY = scoreCanvas.height / 2;

                scoreCtx.textAlign = "center";
                scoreCtx.textBaseline = "middle";

                scoreCtx.font = "24px Arial";
                scoreCtx.fillStyle = "red";
                scoreCtx.font = "15px Arial";
                scoreCtx.fillText("Game Over!", centerX, centerY - 10);
                scoreCtx.fillText("Drücke Enter oder tippe zweimal auf den Bildschirm, um neu zu starten!", centerX, centerY + 18);
                return;
            }
        }
        //Spielfelt
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Den Apfel zeichnen
        if (apfelIconGeladen) {
            ctx.drawImage(apfelIcon, appleX, appleY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(appleX, appleY, gridSize, gridSize);
        }
        // Die Banane zeichnen
        if (bananeIconGeladen) {
            ctx.drawImage(bananeIcon, bananaX, bananaY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "yellow";
            ctx.fillRect( bananaX, bananaY, gridSize, gridSize);
        }
        //Die Melone Zeichnen
        if (meloneIconGeladen) {
            ctx.drawImage(meloneIcon, meloneX, meloneY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "pink";
            ctx.fillRect(meloneX, meloneY, gridSize, gridSize);
        }
        //Die Kokosnuss Zeichnen
        if (KokosnussIconGeladen) {
            ctx.drawImage(KokosnussIcon, kokosnussX, kokosnussY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "brown";
            ctx.fillRect(kokosnussX, kokosnussY, gridSize, gridSize);
        }

        //Die Blaubeere Zeichnen
        if (BlaubeereIconGeladen) {
            ctx.drawImage(BlaubeereIcon, BlaubeereX, BlaubeereY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "Blue";
            ctx.fillRect(BlaubeereX, BlaubeereY, gridSize, gridSize);
        }

        //Die Kirschen Zeichnen
        if (KirschenIconGeladen) {
            ctx.drawImage(KirschenIcon, KirschenX, KirschenY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "Red";
            ctx.fillRect(KirschenX, KirschenY, gridSize, gridSize);
        }

        //Die Orange Zeichnen
        if (OrangeIconGeladen) {
            ctx.drawImage(OrangeIcon, OrangeX, OrangeY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "Orange";
            ctx.fillRect(OrangeX, OrangeY, gridSize, gridSize);
        }

        //Die Trauben Zeichnen
        if (TraubenIconGeladen) {
            ctx.drawImage(TraubenIcon, TraubenX, TraubenY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "Blue";
            ctx.fillRect(TraubenX, TraubenY, gridSize, gridSize);
        }

        //Die Zitrone Zeichnen
        if (ZitroneIconGeladen) {
            ctx.drawImage(ZitroneIcon, ZitroneX, ZitroneY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "yellow";
            ctx.fillRect(ZitroneX, ZitroneY, gridSize, gridSize);
        }

        //Den Donut Zeichnen
        if (DonutIconGeladen) {
            ctx.drawImage(DonutIcon, DonutX, DonutY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "pink";
            ctx.fillRect(DonutX, DonutY, gridSize, gridSize);
        }

        //Den Keks Zeichnen
        if (KeksIconGeladen) {
            ctx.drawImage(KeksIcon, KeksX, KeksY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "brown";
            ctx.fillRect(KeksX, KeksY, gridSize, gridSize);
        }

        //Das suesse Zeichnen
        if (suessesIconGeladen) {
            ctx.drawImage(suessesIcon, suessesX, suessesY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "pink";
            ctx.fillRect(suessesX, suessesY, gridSize, gridSize);
        }

        for (let i = 0; i < snake.length; i++) {
            if (i === 0 && snakeHeadImgLoaded) {
                drawRotatedImage(snakeHeadImg, snake[0].x, snake[0].y, gridSize, direction);
            } else if (i > 0 && snakeBodyImgLoaded) {
                // Richtung berechnen: vom vorherigen Segment zum aktuellen
                const segmentDirection = getSegmentDirection(snake[i], snake[i - 1]);
                drawRotatedImage(snakeBodyImg, snake[i].x, snake[i].y, gridSize, segmentDirection);
            }
        }
}

// Ganz am Ende deines Skripts (nach ALLEN Funktionen):
resizeCanvas();   // gridSize und snake werden gesetzt
generateApple();
generateBanane();
generateMelone();
generateKokosnuss();
generateBlaubeere();
generateKirschen();
generateOrange();
generateTrauben();
generateZitrone();
generateDonut();
generateKeks();
generatesuesses();
updateScore();
timer = setInterval(gameLoop, 200);