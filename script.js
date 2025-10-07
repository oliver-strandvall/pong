import Input, { Keys, MouseButtons } from './input.js';
import Button from './button.js';
const canvas = document.getElementById("canvas");
const input = new Input(canvas);
const restartButton = new Button(input, {x: canvas.width / 2 - 100, y: canvas.height / 1.5, text: "Restart", fillColor: "rgba(75, 145, 250, 1)", hoverFillColor: "rgba(45, 145, 250, 1)"});
const StartButton = new Button(input, {x: canvas.width / 2 - 100, y: canvas.height / 1.5, text: "Start", fillColor: "rgba(75, 145, 250, 1)", hoverFillColor: "rgba(45, 145, 250, 1)"});
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d")

let player = {
    x: 25,
    y: canvas.height / 2 - 50,
    width: 25,
    height: 100
}

let bot = {
    x: canvas.width - 25,
    y: canvas.height / 2 - 50,
    width: 25,
    height: 100
}

let randomNum
let vxset
let vyset

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 25,
    vx: 0,
    vy: 0,
}

let closestX
let closestY
let dx
let dy
let closestXBot
let closestYBot
let dxBot
let dyBot

let playerpoints = 0
let botpoints = 0

let currentScene = "gamestart"

// let lastTime = performance.now();


gameLoop(performance.now());

function gameLoop(timestamp) {
    input.update();

    // const deltaTime = (currentTime - lastTime) / 1000;
    // lastTime = currentTime;

    ctx.fillStyle = "rgba(205, 225, 245, 1)";
    ctx.fillRect(0, 0, 800, 600);

    if(currentScene === "gameplay") {
        updateGame(timestamp)
    } else if(currentScene === "gameover") {
        updategameOver()
    } else if(currentScene === "gamestart") {
        updateGameStart()
    }

    requestAnimationFrame(gameLoop);

}

function updateGame(timestamp) {

    // if (countdown < 0) countdown = 0;

    // countdown -= deltaTime;

    // let closestXbot = clamp(player.x, pipeBottom.x, (pipeBottom.x + pipeBottom.width))
    // let closestYbot = clamp(player.y, pipeBottom.y, (pipeBottom.y + pipeBottom.height))

    // let dxbot = player.x - closestXbot
    // let dybot = player.y - closestYbot

    // Paint player
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(bot.x, bot.y, bot.width, bot.height);

    if(ball.y > bot.y + 50) {
        bot.y += 4
    } else {
        bot.y -= 4
    }

    // Paint ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(75, 145, 250, 1)"
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // ctx.fillStyle = "rgba(215, 245, 205, 1)";
    // ctx.fillRect(pipeTop.x, pipeTop.y, pipeTop.width, pipeTop.height);
    // ctx.strokeRect(pipeTop.x, pipeTop.y, pipeTop.width, pipeTop.height);

    if (input.getKey(Keys.W)) {
        player.y-= 4
    }

    if (input.getKey(Keys.S)) {
        player.y+= 4
    }

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";

    ctx.fillText(playerpoints, canvas.width / 2 - 110, 50);
    ctx.fillRect(canvas.width / 2, 5, 10, 50)
    ctx.fillText(botpoints, canvas.width / 2 + 100, 50);

    ball.x = ball.x + ball.vx
    ball.y = ball.y + ball.vy

    if(ball.y > canvas.height - ball.radius) {
        ball.vy = -5
    }

    if(ball.y < ball.radius) {
        ball.vy = 5
    }

    if(circleRectOverlapsBot() === true) {
        ball.vx = -5
    }

    if(circleRectOverlaps() === true) {
        ball.vx = 5
    }

    if(ball.x > canvas.width) {
        if(playerpoints < 4) {
            playerpoints++
            restartGame()
        } else {
            playerpoints++
            currentScene = "gameover"
        }
    }

    if(ball.x < 0) {
        if(botpoints < 4) {
            botpoints++
            restartGame()
        } else {
            botpoints++
            currentScene = "gameover"
        }
    }

    // if(circleRectOverlaps(coin, player) == true) {
    //     coinsCollected++
    //     randomPos()
    // }

    // ctx.font = "50px Arial";
    // ctx.fillStyle = "rgba(0, 0, 0, 1)";
    // // ctx.fillText(coinsCollected, 15, 50)

    // if (countdown > 0) {
    //     ctx.fillText(Math.ceil(countdown.toFixed(1)) + " S", 15, 115);
    //     paintball(coin)
    // } else {
    //     currentScene = "gameover"
    // }
}

function updategameOver() {

    restartButton.draw(ctx);
    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textAlign = "center";

    if(playerpoints > botpoints) {
        ctx.fillText("You Won!", canvas.width / 2, canvas.height / 2.5,);
    } else {
        ctx.fillText("You Lost!", canvas.width / 2, canvas.height / 2.5,);
    }

    ctx.textAlign = "left"
    // pipeTop.width = 50
    // pipeTop.y = 0
    // pipeTop.x = canvas.width - 50
    // pipeTop.height = 200

    // pipeBottom.width = 50
    // pipeBottom.y = 400
    // pipeBottom.x = canvas.width - 50
    // pipeBottom.height = 200

    if(restartButton.clicked()) {
        botpoints = 0
        playerpoints = 0
        restartGame()
    }
}

function updateGameStart() {

    StartButton.draw(ctx);

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textAlign = "center";
    ctx.fillText("Worse Pong", canvas.width / 2, canvas.height / 2.5);
    ctx.textAlign = "left";

    if(StartButton.clicked()) {
        botpoints = 0
        playerpoints = 0
        restartGame()
    }
}

// function clamp(value, min, max) {
//     if(value > min && value < max) {
//         return value

//     } else if(value > max) {
//         return max

//     } else if(value < min) {
//         return min
//     }
// }

function restartGame() {
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2,
    player.x = 25,
    player.y = canvas.height / 2 - 50
    bot.x = canvas.width - 50
    bot.y = canvas.height / 2 - 50
    currentScene = "gameplay"

    randomNum = Math.floor(Math.random() * 2) + 1;

    if(randomNum == 1) {
        vxset = 5
    } else {
        vxset = -5
    }

    randomNum = Math.floor(Math.random() * 2) + 1;

    if(randomNum == 1) {
        vyset = 5
    } else {
        vyset = -5
    }

    ball.vx = vxset
    ball.vy = vyset
}

// function paintball(coins) {
//     ctx.beginPath();
//     ctx.arc(coins.x, coins.y, 30, 0, Math.PI * 2);
//     ctx.closePath();
//     ctx.fillStyle = "rgba(255, 255, 0, 1)";
//     ctx.fill();
//     ctx.stroke();
// }

function clamp(value, min, max) {
    if(value > min && value < max) {
        return value

    } else if(value > max) {
        return max

    } else if(value < min) {
        return min
    }
}

function circleRectOverlaps() {
    closestX = clamp(ball.x, player.x, player.x + player.width)
    closestY = clamp(ball.y, player.y, player.y + player.height)

    dx = ball.x - closestX
    dy = ball.y - closestY

    if((dx * dx + dy * dy) < (ball.radius * ball.radius)) {
        return true
    } else {
        return false
    }
}

function circleRectOverlapsBot() {
    closestXBot = clamp(ball.x, bot.x, bot.x + bot.width)
    closestYBot = clamp(ball.y, bot.y, bot.y + bot.height)

    dxBot = ball.x - closestXBot
    dyBot = ball.y - closestYBot

    if((dxBot * dxBot + dyBot * dyBot) < (ball.radius * ball.radius)) {
        return true
    } else {
        return false
    }
}

// function randomPos() {
//     coin.x = Math.floor(Math.random() * (750 - 50 + 1)) + 50
//     coin.y = Math.floor(Math.random() * (550 - 50 + 1)) + 50 
// }