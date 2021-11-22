//Creating variables and loading sprite pictures into them
const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let soundStep = new Audio('./sound/step.mp3');


let picStart = new Image();
picStart.src = "./pic/background/start.png";
let picBackgroundlvl1 = new Image();
picBackgroundlvl1.src = "./pic/background/lvl1.jpg";
let picBackgroundlvl2 = new Image();
picBackgroundlvl2.src = "./pic/background/lvl2.jpg";
let picBackgroundlvl3 = new Image();
picBackgroundlvl3.src = "./pic/background/lvl3.jpg";

let picPlayerLeft = new Image();
picPlayerLeft.src = "./pic/playerLeft.png";
let picPlayerRight = new Image();
picPlayerRight.src = "./pic/playerRight.png";

let arrPicPlayer = [];
arrPicPlayer['left'] = picPlayerLeft;
arrPicPlayer['right'] = picPlayerRight;

let picEnemyLeft = new Image();
picEnemyLeft.src = "./pic/enemyLeft.png";
let picEnemyRight = new Image();
picEnemyRight.src = "./pic/enemyRight.png";

let picLife = new Image();
picLife.src = "./pic/life.png";

let picCoin = new Image();
picCoin.src = "./pic/picCoin.png";

let arrPicEnemy = [];
arrPicEnemy['left'] = picEnemyLeft;
arrPicEnemy['right'] = picEnemyRight;

let arrPicBackground = [picStart,picBackgroundlvl1,picBackgroundlvl2,picBackgroundlvl3];

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function generateRandomPosition(pic, xMin, xMax, yMin, yMax) {
    let x = Math.random() * ((xMax - pic.width) - xMin) + xMin,
        y = Math.random() * ((yMax - pic.height) - yMin) + yMin;
    return [x, y];
}
let positionCoin = [0, 0];

function newPositionCoin() {
    positionCoin = generateRandomPosition(picCoin, 0, innerWidth, innerHeight * 0.7, innerHeight * 0.88);
}

function resizeImg(img, percent) {
    
    if (img.width < img.height) {
        let prop = img.height / img.width;
        img.height = window.innerHeight * percent / 100;
        img.width = img.height / prop;
    } else {
     let prop = img.width / img.height;
     console.log(img.width);
     console.log(img.height);
     console.log(prop);
        img.width = window.innerHeight * percent / 100;
        img.height = img.width / prop;
    }
}
let startGame = false;
let xPlayer = 50,
    yPlayer = 665,
    speedPlayer = 5,
    speedEnemy = 50,
    lvl=0,
    navPlayer = 'right',
    navEnemy = 'left',
    xEnemy = 750,
    yEnemy = 680,
    boardPicPlayer, boardPicEnemy, boardPicCoin,
    countLife = 3,
    countCoin = 0;

function boardPic(pic, x, y) {
    let picRight, picBottom;
    picRight = x + pic.width;
    picBottom = y + pic.height;
    return [picRight, picBottom]
}

function checkCollision(x1, x2, y1, y2, r1, r2, b1, b2) {
    if (r1 > x2 && r2 > x1 && y1 < b2 && y2 < b1) {
        return true;
    } else {
        return false;
    }
}

function draw() {
    function printText(text, x, y, size, color) {
        ctx.font = size + "px Arial"
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, );
    }

    function drawPath(path, colorLine, Fill, stroke) {
        ctx.strokeStyle = colorLine;
        ctx.fillStyle = Fill;
        ctx.lineWidth = stroke;
        ctx.stroke(path);
        ctx.fill(path);
    }
    let picBackground = arrPicBackground[lvl];
    //Creating a button, defining coordinates
    if (!startGame) {
       
        let buttonStart = new Path2D;
        function drawButton(strokeColor, fillColor) {
            ctx.clearRect(0, 0, innerWidth, innerHeight)
            ctx.drawImage(picBackground, 0, 0, window.innerWidth, window.innerHeight);
            let widthButton = innerWidth * 0.2,
                heightButton = innerHeight * 0.1;
            let xButton = innerWidth * 0.5 - widthButton / 2,
                yButton = innerHeight * 0.5 - heightButton / 2;
            buttonStart.rect(xButton, yButton, widthButton, heightButton);
            drawPath(buttonStart, strokeColor, fillColor, 3);
            let buttonText = "START";
            printText(buttonText, xButton+widthButton/2-innerWidth*0.02, yButton+heightButton/2+innerHeight*0.01, 25, "Black");
        }
        //Set the color of the button and determine if the cursor is over the button
        drawButton("Blue", "Silver");
        canvas.addEventListener("mousemove",(event)=>{
            if(lvl==0){
                if(ctx.isPointInPath(buttonStart,event.clientX,event.clientY)){
                    drawButton("Blue", "White")
                }else{
                    drawButton("Blue", "Silver");
            }
        }
        });
        document.addEventListener("click",(event)=>{
            if(lvl==0){
                if(ctx.isPointInPath(buttonStart,event.clientX,event.clientY)){
                    startPosition();
                    newPositionCoin();
                    moveEnemy();
                    lvl=1;
                    startGame = true;
                }
            }
        });
    } 
        let picPlayer = arrPicPlayer[navPlayer];
        let picEnemy = arrPicEnemy[navEnemy];
       
        boardPicPlayer = boardPic(picPlayer, xPlayer, yPlayer);
        boardPicEnemy = boardPic(picEnemy, xEnemy, yEnemy);
        boardPicCoin = boardPic(picCoin, positionCoin[0], positionCoin[1]);

        function startPosition() {
            xPlayer = window.innerWidth * 0.05;
            yPlayer = window.innerHeight * 0.88 - picPlayer.height;

            xEnemy = window.innerWidth * 0.85;
            yEnemy = window.innerHeight * 0.88 - picEnemy.height;
        }

        function moveEnemy() {
            function collisionEnemy() {
                if (checkCollision(xPlayer, xEnemy, yPlayer, yEnemy, boardPicPlayer[0], boardPicEnemy[0], boardPicPlayer[1], boardPicEnemy[1])) {
                    countLife--;
                    if (countLife <= 0) {
                        let newGame = confirm('GameOver:(\nХотите начать заново?');
                        if (newGame) {
                            countLife = 3;
                        } else {
                            clearTimeout(timerMoveEnemy);
                            startPosition();
                            return;
                        }
                    }
                    startPosition();
                }
            }
            collisionEnemy();
            let timerMoveEnemy = setTimeout(() => {
                if (xEnemy > (xPlayer + picPlayer.width)) {
                    xEnemy--;
                    navEnemy = 'left';
                } else if ((xEnemy + picEnemy.width) < xPlayer) {
                    xEnemy++;
                    navEnemy = 'right';
                }
                draw();
                moveEnemy();
            }, speedEnemy);
        }
        function collisionCoin() {
            if (checkCollision(xPlayer, positionCoin[0], yPlayer, positionCoin[1], boardPicPlayer[0], boardPicCoin[0], boardPicPlayer[1], boardPicCoin[1])) {
                countCoin++;
                newPositionCoin();
            }
        }
        collisionCoin();
if(startGame){
    resizeImg(picPlayer, 8);
    resizeImg(picEnemy, 5);
    resizeImg(picLife, 5);
    resizeImg(picCoin, 3);
        ctx.drawImage(picBackground, 0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(picPlayer, xPlayer, yPlayer, picPlayer.width, picPlayer.height);
        ctx.drawImage(picEnemy, xEnemy, yEnemy, picEnemy.width, picEnemy.height);
        ctx.drawImage(picCoin, positionCoin[0], positionCoin[1], picCoin.width, picCoin.height);
        for (let i = 0; i < countLife; i++) {
            let yLife = innerHeight * 0.05;
            let xLife = innerWidth * 0.05 + picLife.width * i;
            ctx.drawImage(picLife, xLife, yLife, picLife.width, picLife.height);
        }
        printText("Count = " + countCoin, innerWidth * 0.05, innerHeight * 0.05 + picLife.height, 14, "Green");
    }
}

picCoin.onload = picEnemyRight.onload = picEnemyLeft.onload = picPlayerLeft.onload = picPlayerRight.onload = picStart.onload = picBackgroundlvl1.onload = picBackgroundlvl2.onload = picBackgroundlvl3.onload = draw;

document.addEventListener('keydown', (event) => {
    let KeyPressed = event.code;
    switch (KeyPressed) {
        case 'ArrowLeft':
            xPlayer -= speedPlayer;
            navPlayer = 'left';
            soundStep.play();
            break;
        case 'ArrowRight':
            xPlayer += speedPlayer;
            navPlayer = 'right';
            soundStep.play();
            break;
    }
    draw();
});

document.addEventListener('keyup', (event) => {
    let KeyPressed = event.code;
    switch (KeyPressed) {
        case 'ArrowLeft':
            soundStep.pause();
            break;
        case 'ArrowRight':
            soundStep.pause();
            break;
    }
});