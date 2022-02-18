//creating variables for the divs 
const cvs = document.querySelector("#bobby")
const ctext = cvs.getContext("2d")

const lvlImg = new Image()
lvlImg.src = "brickBreaker/https-github.com-JameikBadia-Nevels-brickBreaker/levels.png"

const lifeImg = new Image()
lifeImg.src = "brickBreaker/https-github.com-JameikBadia-Nevels-brickBreaker/life.png"

const scoreImg = new Image()
scoreImg.src = "brickBreaker/https-github.com-JameikBadia-Nevels-brickBreaker/highscore.png"

const bGroundImg = new Image()
bGroundImg.src = "brickBreaker/https-github.com-JameikBadia-Nevels-brickBreaker/Background.png"

//player varibles 
const playerWidth = 100
const playerMargin = 50
const playerHeight = 20
const ballRadius = 8

//Gaming variables
let playerLives = 3 
let score = 0
const scoring = 10
let level = 1
const maxLevel = 10
let gameOver = false

//arrow keys declared
let leftArrow = false
let rigthArrow = false

//The player/paddle object & properties 
const player = {
    x: cvs.width/2 - playerWidth/2,
    y: cvs.height - playerMargin - playerHeight,
    width: playerWidth,
    height: playerHeight,
    dx : 5
}

//Drawing player 
const drawPlayer = () =>{
    ctext.fillstyle = "black"
    ctext.fillRect(player.x, player.y, player.width, player.height)
}

const fuckthis = () =>{
    console.log("click")
}

//Player movement 
const movePlayer = () =>{
    if(rigthArrow && player.x + player.width < cvs.width ){
        player.x += player.dx
    }else if(leftArrow && player.x > 0){
        player.x -= player.dx
    }
}

//The ball
const ball = {
    x : cvs.width/2,
    y : player.y - ballRadius,
    radius : ballRadius,
    speed : 3,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

// Draw the ball
const drawBall = () =>{
    ctext.beginPath()

    ctext.clearRect(0, 0, cvs.width, cvs.height);

    ctext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctext.fillstyle = "green"
    ctext.fill()

    ctext.strokeStyle = "purple"
    ctext.stroke()

    ctext.closePath()
}

//Ball movement 
const ballMove = () =>{
    ball.x += ball.dx
    ball.y += ball.dy
}

//What happens if the ball hits the wall
const wallCollision = () =>{
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = - ball.dx
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = - ball.dy
    }
    if(ball.y + ball.radius > cvs.height){
        playerLives--

        resetBall()
    }
}

//Ball Reset function 
const resetBall = () =>{
    ball.x = cvs.width/2
    ball.y = player.y - ballRadius
    ball.dx = 3 * (Math.random() * 2 -1)
    ball.dy = -3
}

//When the ball hits the player
const ballHitPlayer = () =>{
    if(ball.x < player.x + player.width && ball.x > player.x && player.y < player.y + player.height && ball.y > player.y){
        let collision = ball.x - (player.x + player.width/2)

        collision = collision / (player.width/2)

        let angle = collision * Math.PI/3

        ball.dx = ball.speed * Math.sin(angle)
        ball.dy = - ball.speed * Math.cos(angle)
    }
}

//object bricks & properties 
const brick = {
    row: 1,
    column : 5, 
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "black",
    strokeColor: "orange"
}

let bricks = [] 

//creating the bricks
const brickCreate = () => {
    for(let row = 0; row < brick.row; row++){
        bricks[row] = []
        for(let col = 0; col < brick.column; col++){
            bricks[row][col] = {
                x : col * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: row * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}
brickCreate()

//drawing the bricks 
const drawBricks = () =>{
    for (let row  = 0; row  < brick.row; row ++){
        for (let col = 0; col < brick.column; col++) {
            let b = bricks[row][col];
            
            if(b.status){
                ctext.fillstyle = brick.fillColor
                ctext.fillRect(b.x, b.y, brick.width, brick.height)

                // ctx.strokeStyle = brick.strokeColor;
                // ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

//ball brick collision function 
const bbCollision = () =>{
    for (let row = 0; row < brick.row; row++) {
        for (let col = 0; col < brick.column; col++) {
            let b = bricks[row][col];
            if(b.status){
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y  + ball.radius > b.y && ball.y - ball.height) {
                    ball.dy = - ball.dy
                    b.status = false //brick is broken 
                    score += scoring
                
                }
            }

        }
    }

}

//to show game stats 
const gameStats = (text, texta, textb, img,) =>{
    //draw text
    ctext.fillstyle = "black"
    ctext.font = "25px Germania One"
    ctext.fillText(text,texta,textb)

    //draw images
    ctext.drawImage(img, width = 25, height = 25)
}

//draw function
const draw = () => {
    drawPlayer()

    drawBall()

    drawBricks()
    //display score
    gameStats(score, 35, 25, scoreImg , 5, 5 )
    //display player lives
    gameStats(playerLives, cvs.width - 25, 25, lifeImg, cvs.width - 55, 5)
    //display level
    gameStats(level, cvs.width/2, 25, lvlImg, cvs.width/2 - 30, 5)
}

//game over
const gameDone = () =>{
    if(playerLives <= 0){
        showLose()
        gameOver = true
    }
}

//leveling up 
const lvlUp = () =>{
    let lvlComplete = true

    for (let row = 0; row < brick.row; row++) {
        for (let col = 0; col < brick.column; col++) {
            lvlComplete = lvlComplete && ! bricks[row][col].status
            
        }
        
    }
    if (lvlComplete) {
        if (level >= maxLevel) {
            showWin()
            gameOver = true
            return; 
        }
        brick.row++
        brickCreate()
        ball.speed+= 0.5
        resetBall()
        level++
    }
}

//updating function
const updating = () =>{
    movePlayer()

    ballMove()

    wallCollision()

    ballHitPlayer()

    bbCollision()

    gameDone()

    lvlUp()
}

const loopy = () =>{

    let r = document.querySelector("#bobby")
    r.addEventListener("click", fuckthis )

    ctext.drawImage(bGroundImg, 0, 0)

    draw()

    updating()

    if(! gameOver){
        requestAnimationFrame(loopy)
    }
}
loopy()

const gameover = document.querySelector("#gameover");
const youwin = document.querySelector("#youwin");
const youlose = document.querySelector("#youlose");
const restart = document.querySelector("#restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

//display winners screen
function showWin(){
    gameover.style.display = "block";
    youwin.style.display = "block";
}

//display game over screen 
function showLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}