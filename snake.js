//Das Spiel Feld und Das Score Feld erwähnen
// noinspection LanguageDetectionInspection

const scoreCanvas = document.getElementById("score");
const scoreCtx = scoreCanvas.getContext("2d");
const canvas = document.getElementById("spielfeld")
const ctx = canvas.getContext("2d")

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
let direction = "right" // start richtung von der schlange
let gameOver = false; //GameOver
let snake = [{ x: 20, y: 20 }];// Die Schlange wird als Array gespeichert, Kopf immer zuerst
let score = 0; // score
// zufählige koordinaten für das essen
generateApple();
generateBanane2()

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
//Variablen festlegen
let appleX, appleY;
let bananaX, bananaY;
 //Den apfel generieren
function generateApple() {
    let valid = false;
    let x, y;
    while (!valid) {
        x = Math.floor(Math.random() * gridCount) * gridSize;
        y = Math.floor(Math.random() * gridCount) * gridSize;
        valid = true;
        //Keine überschneidung mit der Schlange
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === x && snake[i].y === y) {
                valid = false;
                break;
            }
        }
    }
    appleX = x;
    appleY = y;
}
// Die Banane generieren
function generateBanane2() {
    let valid = false;
    let x, y;
    while (!valid) {
        x = Math.floor(Math.random() * gridCount) * gridSize;
        y = Math.floor(Math.random() * gridCount) * gridSize;
        valid = true;
        //Keine überschneidung mit dem Apfel
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === x && snake[i].y === y) {
                valid = false;
                break;
            }
        }
        if (x === appleX && y === appleY) valid = false;
    }
    bananaX = x;
    bananaY = y;
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
            generateBanane2(); // Banane neu generieren, aber nie auf dem apfel
        } else if (newHead.x === bananaX && newHead.y === bananaY) { // wenn die schlange die banane frisst
            score ++ //score soll eins höher gehen
            updateScore();
            generateBanane2();
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

// Beim neustart vom game das alles wieder reset
function resetGame() {
    snake = [{ x: 20, y: 20 }];
    direction = "right";
    score = 0;
    updateScore();
    generateApple();
    generateBanane2();
    gameOver = false;
    timer = setInterval(gameLoop, 200);
}

    function gameLoop() {
        moveSnake()

        // Gewinn-Fall: Alle Felder sind gefüllt
        if (snake.length === gridCount * gridCount) {
            clearInterval(timer);
            gameOver = true;
            scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
            scoreCtx.font = "20px Arial";
            scoreCtx.fillStyle = "blue";
            scoreCtx.fillText("Gewonnen! :)", 45, 30);
            scoreCtx.font = "13px Arial";
            scoreCtx.fillText("Drücke Enter um neu zu starten!", 5, 50);
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
            scoreCtx.font = "24px Arial";
            scoreCtx.fillStyle = "red";
            scoreCtx.font = "13px Arial";
            scoreCtx.fillText("Game Over!", 65, 20);
            scoreCtx.fillText("Drücke Enter um neu zu starten!", 5, 40);
            return; // Funktion abbrechen, damit nichts mehr gezeichnet wird

        }

        // Das spiel endet wenn die schlange sich selbst berührt
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                clearInterval(timer);
                gameOver = true;
                scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
                scoreCtx.font = "24px Arial";
                scoreCtx.fillStyle = "red";
                scoreCtx.font = "13px Arial";
                scoreCtx.fillText("Game Over!", 65, 20);
                scoreCtx.fillText("Drücke Enter um neu zu starten!", 5, 40);
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
        for (let i = 0; i < snake.length; i++) {
            if (i === 0 && snakeHeadImgLoaded) {
                drawRotatedImage(snakeHeadImg, snake[0].x, snake[0].y, gridSize, direction);
            } else if (i > 0 && snakeBodyImgLoaded) {
                // Richtung berechnen: vom vorherigen Segment zum aktuellen
                const segmentDirection = getSegmentDirection(snake[i], snake[i - 1]);
                drawRotatedImage(snakeBodyImg, snake[i].x, snake[i].y, gridSize, segmentDirection);
            }
            // Die Banane zeichnen
            if (bananeIconGeladen) {
                ctx.drawImage(bananeIcon, bananaX, bananaY, gridSize, gridSize);
            } else {
                ctx.fillStyle = "red";
                ctx.fillRect( bananaX, bananaY, gridSize, gridSize);
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
    }
let timer = setInterval(gameLoop, 200);