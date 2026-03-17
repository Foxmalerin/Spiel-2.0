//Das Spiel Feld und Das Score Feld erwähnen
// noinspection LanguageDetectionInspection

const scoreCanvas = document.getElementById("score");
const scoreCtx = scoreCanvas.getContext("2d");
const canvas = document.getElementById("spielfeld")
const ctx = canvas.getContext("2d")
//Für handy spielbar
function resizeCanvas() {
    // quadratisches Spielfeld, maximal 90% der kleineren Bildschirm-Seite
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
    scoreCanvas.width = size;
    scoreCanvas.height = 60; // Score-Feld bleibt kleiner
}

// Beim Laden und bei Größenänderungen anpassen
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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
const gridSize = 20;     // Größe eines Feldes (Pixel)
const gridCount = 20;    // Anzahl Felder pro Reihe/Spalte

//Variablen festlegen
let lastTapTime = 0;
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;
let direction = "right" // start richtung von der schlange
let gameOver = false; //GameOver
let snake = [{ x: 20, y: 20 }];// Die Schlange wird als Array gespeichert, Kopf immer zuerst
let score = 0; // score
// zufählige koordinaten für das essen
//Variablen festlegen
let appleX, appleY;
let bananaX, bananaY;
let meloneX, meloneY;
let kokosnussX, kokosnussY;

generateApple();
generateBanane();
generateMelone();
generateKokosnuss();

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
 //Den apfel generieren
function generateApple() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridCount) * gridSize;
        y = Math.floor(Math.random() * gridCount) * gridSize;
    } while (!isFree(x, y, [{ x: bananaX, y: bananaY }]));
    appleX = x;
    appleY = y;
}

// Die Banane generieren
function generateBanane() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridCount) * gridSize;
        y = Math.floor(Math.random() * gridCount) * gridSize;
    } while (!isFree(x, y, [{ x: appleX, y: appleY }]));
    bananaX = x;
    bananaY = y;
}

// Die Melone generieren
function generateMelone() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridCount) * gridSize;
        y = Math.floor(Math.random() * gridCount) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: kokosnussX, y: kokosnussY }
    ]));
    meloneX = x;
    meloneY = y;
}

// Die Kokosnuss generieren
function generateKokosnuss() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridCount) * gridSize;
        y = Math.floor(Math.random() * gridCount) * gridSize;
    } while (!isFree(x, y, [
        { x: appleX, y: appleY },
        { x: bananaX, y: bananaY },
        { x: meloneX, y: meloneY }
    ]));
    kokosnussX = x;
    kokosnussY = y;
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
        } else if (newHead.x === meloneX && newHead.y === meloneY) { // wenn die schlange die banane frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateMelone(); // Melone neu generieren, aber nie auf dem apfel
        } else if (newHead.x === kokosnussX && newHead.y === kokosnussY) { // wenn die schlange die banane frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateKokosnuss(); // Kokosnuss neu generieren, aber nie auf dem apfel
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
    snake = [{ x: 20, y: 20 }];
    direction = "right";
    score = 0;
    updateScore();
    generateApple();
    generateBanane();
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
            ctx.fillStyle = "red";
            ctx.fillRect( bananaX, bananaY, gridSize, gridSize);
        }
        if (meloneIconGeladen) {
            ctx.drawImage(meloneIcon, meloneX, meloneY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "pink";
            ctx.fillRect(meloneX, meloneY, gridSize, gridSize);
        }
        if (KokosnussIconGeladen) {
            ctx.drawImage(KokosnussIcon, kokosnussX, kokosnussY, gridSize, gridSize);
        } else {
            ctx.fillStyle = "brown";
            ctx.fillRect(kokosnussX, kokosnussY, gridSize, gridSize);
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

timer = setInterval(gameLoop, 200);