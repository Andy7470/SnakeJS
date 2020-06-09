
var ctx = document.getElementById("canvas").getContext('2d');
var selectMode = 1
var velocity = 80
var freeze = 0

/* ----------------------------------
 ----------	Objects --------------
 ---------------------------------------- */ 

var snake = {
	tail: [{x: 90, y: 50},{x: 91, y: 50}], //starts with 2 + 1 tail size
	width: 9,
	height: 9,
	color: 'green',
}


var direction = 0 // 0: stop, 1: up, 2: right, 3: down, 4: left

var food = {
	x: undefined,
	y: undefined,
	width: 9,
	height: 9,
	color: 'red',
	ate: true
}

var score = -1

/* ----------------------------------
 ----------	Draw Functions --------------
 ---------------------------------------- */ 
function rect(x,y,width,height,color){
		ctx.fillStyle = color
		ctx.fillRect(x,y,width,height)
}

function foodAte(){

	rect(food.x, food.y, food.width, food.height, food.color) // draw food

	if (food.ate) {
		food.x = (Math.floor(Math.random() * 30)) * 10
		food.y = (Math.floor(Math.random() * 30)) * 10
		food.ate = false
		score++
		snake.tail.push({x: snake.tail[1].x, y: snake.tail[1].y})
	}

	for(let i = 0; i < snake.tail.length; i++ ){
		if(snake.tail[i].x == food.x && snake.tail[i].y == food.y){
			food.ate = true
		}
	}
}

function drawSnake(){

	for(let i = 0; i < snake.tail.length; i++ ){
			rect(snake.tail[i].x, snake.tail[i].y, snake.width, snake.height, snake.color)
	}

}

function drawStats(){
	document.getElementById("score").innerHTML = score
	document.getElementById("snakeSize").innerHTML = snake.tail.length
	selectMode = parseInt(document.getElementById("mode").value)
	velocity = parseInt(document.getElementById("difficulty").value)
}
/* ----------------------------------
 ----------	Lose events --------------
 ---------------------------------------- */ 
function resetGame(){
	score = 0;
	for (let i = 3; i < snake.tail.length; i++){
		snake.tail.pop()
	}
}

function freezeScreen(freeze){
	if(freeze){
		ctx.fillStyle = 'black'
		ctx.font = "20px Arial"
		ctx.fillText("Your score: " + score, 85, 40)
		ctx.fillText("Click to restart!!", 80, 60)
		direction = 0

		snake.color = 'red'

		canvas.addEventListener("click",function(){
			resetGame()
			respawn()
			freeze = false
			snake.color = 'green'
		})
	}

}

function respawn(){
	let x = (Math.floor(Math.random() * 30)) * 10 //random Respawn
	let y = (Math.floor(Math.random() * 30)) * 10

	for(let i = 0;i < snake.tail.length;i++){
		snake.tail[i].x = x
		snake.tail[i].y = y + i
	}
	
}

function eatUp(){ // when eats him seft
	for (let i = 1; i < snake.tail.length; i++){
		if(snake.tail[0].x == snake.tail[i].x && snake.tail[0].y == snake.tail[i].y){
			freezeScreen(freeze = true)
		}	
	}
}

function eatBorder(mode){
	switch(mode){
		case 1:
			if(snake.tail[0].x < 0 || snake.tail[0].y < 0 || snake.tail[0].x > canvas.width - 10 || snake.tail[0].y > canvas.height - 10){
				freezeScreen(freeze = true)
			}
		break;
		case 2:

			if(snake.tail[0].x < 0){
				snake.tail.unshift({x: canvas.width -10, y: snake.tail[0].y})
				snake.tail.pop()
			}

			if(snake.tail[0].y < 0){
				snake.tail.unshift({x: snake.tail[0].x, y: canvas.height - 10})
				snake.tail.pop()
			}

			if(snake.tail[0].x > canvas.width - 10){
				snake.tail.unshift({x: 0, y: snake.tail[0].y})
				snake.tail.pop()
			}

			if(snake.tail[0].y > canvas.height - 10){
				snake.tail.unshift({x: snake.tail[0].x, y: 0})
				snake.tail.pop()
			}

		break;

	}

}


/* ----------------------------------
 ----------	Movement Fuctions --------------
 ---------------------------------------- */ 
// 1: up, 2: right, 3: down, 4: left

function controls(){
	document.addEventListener("keydown", function(){
		switch(event.keyCode){
		case 38:
			if (direction != 3) {
				direction = 1
			}
			break;

		case 39:
			if (direction != 4) {
				direction = 2		
			}

			break;

		case 40:
			if (direction != 1) {
				direction = 3		
			}
			break;

		case 37:
			if (direction != 2) {
				direction = 4		
			}
			break;
		}
	})
}

function movement(){
// 1: up, 2: right, 3: down, 4: left
	if (direction == 1){
		snake.tail.unshift({x: snake.tail[0].x ,y: snake.tail[0].y - 10})
		snake.tail.pop()
	}
	else if (direction == 2){
	snake.tail.unshift({x: snake.tail[0].x + 10 ,y: snake.tail[0].y})
	snake.tail.pop()
	}
	else if (direction == 3){
		snake.tail.unshift({x: snake.tail[0].x ,y: snake.tail[0].y + 10})
		snake.tail.pop()
	}
	else if (direction == 4){
		snake.tail.unshift({x: snake.tail[0].x - 10 ,y: snake.tail[0].y})
		snake.tail.pop()
	}

}

function pause(){
	document.addEventListener("keydown", function(){
		if (event.keyCode == 80) {
			clearInterval(interval)
			console.log("paused")
		}
	})
}

/* ----------------------------------
 ----------	Void Setup --------------
 ---------------------------------------- */ 
respawn()
setInterval(draw,velocity)
/* ----------------------------------
 ----------	Void Loop --------------
 ---------------------------------------- */ 

function draw(){

	velocity = parseInt(document.getElementById("difficulty").value)
	ctx.clearRect(0,0,canvas.width,canvas.height)

	foodAte()
	eatBorder(selectMode)
	drawSnake()

	pause()
	
	eatUp()
	controls()
	movement()
	drawStats()
}
