const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

//zooming in a little bit
context.scale(20, 20);


const matrix = [
  //this is the variation of the t piece
  //3 rows so it can flip around
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];



function draw(){
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena.matrix, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}


//all the different blocks pieces, create a new one to drop
function createPiece(type){
  if (type === 'T'){
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === 'O'){
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === 'L'){
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === 'J'){
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === 'I'){
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === 'S'){
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === 'Z'){
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

//drawing the piece
//offset is how much it moves
function drawMatrix(matrix, offset){
  matrix.forEach((row, y) =>{
    row.forEach((value, x) => {
      //draw if value is not 0
      if (value !== 0){
        context.fillStyle= colors[value];
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}


let lastTime = 0;

//initial time is 0, when drop initially we 're not calling it wiht anything'
//this is dropping of the thing
function update(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;

  player.update(deltaTime);

  draw();
  requestAnimationFrame(update);
}

//for the colors
const colors = [
  null,
  'red',
  'blue',
  'violet',
  'green',
  'purple',
  'orange',
  'pink',
]

const arena = new Arena(12, 20);

const player = new Player;

//movement of the blocks
document.addEventListener('keydown', event =>{
  //if left pressed
  if (event.keyCode === 37){
    player.move(-1);
    //else right pressed
  } else if (event.keyCode === 39){
    player.move(1);
    //the down button pressed
  } else if (event.keyCode === 40){
    player.drop();
    //the q button is pressed
  } else if (event.keyCode == 81){
    player.rotate(-1);
    //the w button is pressed
  } else if (event.keyCode == 87){
    player.rotate(1);
  }
});

//updating score
function updateScore(){
  console.log(player.score);
  document.getElementById('score').innerText = player.score;
}

player.reset();
updateScore();
update();
