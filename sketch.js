let blockWidth = 16;
let blockHeight = 16;
let nBlocks;
let snake = [];
let direction = 1;
// 0 up 1 right 2 down 3 left
let dx, dy;
dx = dy = 0;
let dead = false;
let head = 2;
let food;
let eaten;

function setup(){
    createCanvas(640, 640);
    nBlocks = width/blockWidth;
    snake.push(new Vec(nBlocks/2, nBlocks/2));
    snake.push(new Vec(nBlocks/2+1, nBlocks/2));
    snake.push(new Vec(nBlocks/2+2, nBlocks/2));
    frameRate(10);

    food = new Vec(10, 10);
}

function draw(){
    background(0);

    fill(255);
    rect(0, 0, 10, 10);
    //Update position
    dx = dy = 0;
    if(direction == 0){
        dy = -1;
    }
    else if(direction == 1){
        dx = 1;
    }
    else if(direction == 2){
        dy = 1;
    }
    else if(direction == 3){
        dx = -1;
    }

    //Move snake
    let newPiece = new Vec(snake[head].x+dx, snake[head].y+dy);
    if(!eaten){
        snake.splice(0, 1);
    }
    else {
        eaten = false;
        head++;
    }
    snake.push(newPiece);


    //speed up snake as it goes on
    frameRate(head/5*15+1);

    //Collision checking
    //Edges
    // Figure out whats wrong ------------------------------------------------------
    if(snake[head].x-1 == -1 || snake[head].x+1 == nBlocks || snake[head].y-1 == -1 || snake[head].y+1 == nBlocks){
        gameOver();
    }
    //Food
    if(snake[head].x == food.x && snake[head].y == food.y){
        food = new Vec(round(random(nBlocks-2))+1, round(random(nBlocks-2))+1);
        eaten = true;
    }
    //Self
    for(let i = 0; i<head; i++){
        if(snake[head].x == snake[i].x && snake[head].y == snake[i].y){
            console.log(i);
            gameOver();
        }
    }


    // Display
    fill(0, 255, 0);
    rect(food.x * blockWidth, food.y * blockHeight, blockWidth, blockHeight);


    for(let i = 0; i<snake.length; i++){
        dead && i == head ? fill(0, 0, 255) : (i == head ? fill(255, 0, 0) : fill(255));
        rect(snake[i].x*blockWidth, snake[i].y*blockHeight, blockWidth, blockHeight);
    }


}

function gameOver(){
    dead = true;
    noLoop();
    console.log("Game Over, Your score is:", head+1);
    let p = document.createElement("p");
    p.innerHTML = "Game Over, Your score is: "+(head+1);
    document.getElementsByTagName("body")[0].appendChild(p);
}


function keyPressed(){
    if(keyCode === UP_ARROW){
        if(direction != 2)
            direction = 0;
    }
    else if(keyCode === RIGHT_ARROW){
        if(direction != 3)
            direction = 1;
    }
    else if(keyCode === DOWN_ARROW){
        if(direction != 0)
            direction = 2;
    }
    else if(keyCode === LEFT_ARROW){
        if(direction != 1)
            direction = 3;
    }




}



class Vec{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
}