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
  drawMatrix(player.matrix, player.pos);
}

function createMatrix(w, h){
  const matrix = [];

  while (h--){
    matrix.push(new Array(w).fill(0));
  }

  return matrix;
}

//drawing the piece
//offset is how much it moves
function drawMatrix(matrix, offset){
  matrix.forEach((row, y) =>{
    row.forEach((value, x) => {
      //draw if value is not 0
      if (value !== 0){
        context.fillStyle='red';
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

//this will copy all the players in the arena at the correct position
function merge(arena, player){
  player.matrix.forEach((row, y) => {
    row.forEach((value, x ) =>{
      if (value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  })
}

//when player manually drops the block
function playerDrop(){
  player.pos.y++;
  dropCounter = 0;
}

let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

//initial time is 0, when drop initially we 're not calling it wiht anything'
//this is dropping of the thing
function update(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval){
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);
const player = {
  pos: {x: 5, y: 5},
  matrix: matrix,
}

//movement of the blocks
document.addEventListener('keydown', event =>{
  //if left pressed
  if (event.keyCode === 37){
    player.pos.x--;
    //else right pressed
  } else if (event.keyCode === 39){
    player.pos.x++;
  } else if (event.keyCode === 40){
    playerDrop();
  }
});

update();
