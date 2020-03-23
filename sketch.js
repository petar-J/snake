let p = document.createElement("p");
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
let food = [];
let eaten;
let pressed;
let score = head+1;
let muff, coffee, turkey;
let heads = [];
let bodies = [];
let tails = [];
let corners = [];

function preload(){
    muff = loadImage("images/muffin.png");
    coffee = loadImage("images/coffee.png");
    turkey = loadImage("images/turkey.png");
    for(let i = 0; i<4; i++){
        if(i<2){
            bodies.push(loadImage("images/body"+i+".png"));
        }
        heads.push(loadImage("images/head"+i+".png"));
        tails.push(loadImage("images/tail"+i+".png"));
        corners.push(loadImage("images/corner"+i+".png"));
    }
    font = loadFont("fonts/font.ttf");

}
function setup(){
    createCanvas(640, 640);
    p.style.display = "block";
    document.getElementsByTagName("body")[0].appendChild(p);

    nBlocks = width/blockWidth;
    snake.push(new Vec(nBlocks/2, nBlocks/2));
    snake.push(new Vec(nBlocks/2+1, nBlocks/2));
    snake.push(new Vec(nBlocks/2+2, nBlocks/2));
    frameRate(20);

    food.push(newFood("food"));
    textSize(16);
    textFont(font);
    textAlign(LEFT);
}
function reSetup(){
    snake = [];
    direction = 1;
    dx = dy = 0;
    dead = false;
    head = 2;
    food = [];
    eaten = false;
    pressed = false;
    score = head+1;
    snake.push(new Vec(nBlocks/2, nBlocks/2));
    snake.push(new Vec(nBlocks/2+1, nBlocks/2));
    snake.push(new Vec(nBlocks/2+2, nBlocks/2));
    food.push(newFood("food"));
}

function draw(){
    background(0);
    pressed = false;
    
    if(!dead){

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
            score++;
            head++;
        }
        snake.push(newPiece);


        //Collision checking
        //Edges
        if(snake[head].x < 0 || snake[head].x+1 > nBlocks || snake[head].y < 0 || snake[head].y+1 > nBlocks){
            eaten = true;
            gameOver();
        }
        //Food
        for(let i = 0; i<food.length; i++){
            if(snake[head].x == food[i].pos.x && snake[head].y == food[i].pos.y){
                if(food[i].type == "food"){
                    //Allow it to get bigger
                    food[i] = newFood("food");
                    eaten = true;
                    console.log("head collided with food",i)
                }
                else if(food[i].type == "half"){
                    //Cut length in half and slow down
                    frameRate(frameRate()*2/3);
                    food.splice(i,1);
                    snake.splice(0, head/2);
                    head = snake.length-1;
                    continue;
                }
                else if(food[i].type == "speedup"){
                    frameRate(frameRate()+3);
                    food.splice(i,1);
                    continue;
                }
            }

            //Remove foods ---------------------------
            if(food[i].type == "half"){
                if(frameCount - food[i].count > 200){
                    food.splice(i,1);
                }
            }
            else if(food[i].type == "speedup"){
                if(frameCount - food[i].count > 200){
                    food.splice(i,1);
                }
            }
        }
        //Self
        for(let i = 0; i<head; i++){
            if(snake[head].x == snake[i].x && snake[head].y == snake[i].y){
                console.log(i);
                gameOver();
            }
        }

        //Add food if needed
        if(food.length+1 < floor(sqrt(snake.length))){
            food.push(newFood("food"));
        }
        if(score % 10 == 9){
            food.push(newFood("half"));
            score++;
        }
        if(score % 10 == 4){
            food.push(newFood("speedup"));
            score++;
        }

    }
    else{
        rectMode(CENTER);
        fill(255);
        rect(nBlocks/2*blockWidth, nBlocks/2*blockHeight, blockWidth*20, blockHeight*5);
        rectMode(CORNER);
        text("Your score was "+score, width/2, height/2-blockHeight*4);
        text("Click to restart", width/2, height/2);
        
    }

    // Display  (Food and Snake)  
    fill(255);
    text("Score: "+score, 2, 16);
    for(let i = 0; i<food.length; i++){
        food[i].show()
    }
    for(let i = 0; i<snake.length; i++){
        if(i == 0){
            //Tail
            let dir;
            if(snake[1].x == snake[0].x){
                dir = snake[1].y - snake[0].y == 1 ? 2 : 0; 
            }
            else{
                dir = snake[1].x - snake[0].x == 1 ? 1 : 3;
            }
            image(tails[dir], snake[0].x*blockWidth, snake[0].y*blockHeight, blockWidth, blockHeight);
        }
        else if(i == head){
            //Head
            image(heads[direction], snake[head].x*blockWidth, snake[head].y*blockHeight, blockWidth, blockHeight);
        }
        else{
            //Body
            drawBody(i);
        }
    }


}


function gameOver(){
    dead = true;
    //noLoop();
}


// Event functions -------------------------------------------------------------------------------------
function keyPressed(){
    if(!pressed && !dead){
        pressed = true;
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
    else if(dead) {
        dead = false;
        reSetup();
    }
}

//Utility functions ---------------------------------------------------------------------------------------
function pickPos(){
    let overlap = true;
    let v;
    while (overlap){
        overlap = false;
        v = new Vec(round(random(nBlocks-2))+1, round(random(nBlocks-2))+1);
        for(let i = 0; i<snake.length; i++)
        {
            if(v.x == snake[i].x && v.y == snake[i].y){
                overlap = true;
                continue;
            };
        }
    }
    return v;
}

function newFood(type){
    return new Food(type, pickPos());
}

function drawBody(i){
    let dir;
    let n = abs(snake[i+1].x - snake[i-1].x);
    if(n == 1){
        //Corner
        dir = 0;
        let x0 = snake[i].x; let x1 = snake[i-1].x; let x2 = snake[i+1].x;
        let y0 = snake[i].y; let y1 = snake[i-1].y; let y2 = snake[i+1].y;
        let dx = x2 - x1;
        let dy = y2 - y1;
        let dx0 = x0 - x1;
        if(dx > 0 && dy > 0){
            if(dx0 == 0) dir = 3;
            else dir = 2;
        }
        if(dx > 0 && dy < 0){
            if(dx0 == 0) dir = 1;
            else dir = 0;
        }
        if(dx < 0 && dy > 0){
            if(dx0 == 0) dir = 0;
            else dir = 1;
        }
        if(dx < 0 && dy < 0){
            if(dx0 == 0) dir = 2;
            else dir = 3;
        }

        image(corners[dir], snake[i].x*blockWidth, snake[i].y*blockHeight, blockWidth, blockHeight);
        // fill(255);
        // rect(snake[i].x*blockWidth, snake[i].y*blockHeight, blockWidth, blockHeight);
    }
    else{
        //Normal
        //n == 0 ? horizontal : vertical
        n == 0 ? dir = 0 : dir = 1;
        image(bodies[dir], snake[i].x*blockWidth, snake[i].y*blockHeight, blockWidth, blockHeight);
    }
    
}



//Classes ---------------------------------------------------------------------------------------------------------
class Vec{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
}

class Food{
    constructor(type, v){
        //type can be "food"
        this.type = type;
        this.pos = new Vec(v.x, v.y);
        if(this.type == "half" || this.type == "speedup"){
            this.count = frameCount;
        }
    }

    show(){
        if(this.type == "food"){
            fill(0, 255, 0);
            image(muff, this.pos.x*blockWidth, this.pos.y*blockHeight, blockWidth, blockHeight);
        }
        else if(this.type == "half"){
            frameCount % 10 < 4 ? fill(100, 0, 0) : fill(255, 0, 0);
            image(turkey, this.pos.x*blockWidth, this.pos.y*blockHeight, blockWidth, blockHeight);
        }
        else if(this.type == "speedup"){
            frameCount % 10 > 5 ? fill(0, 0, 100) : fill(0, 0, 255);
            image(coffee, this.pos.x*blockWidth, this.pos.y*blockHeight, blockWidth, blockHeight);
        }
        
    }
}
