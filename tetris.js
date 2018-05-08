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

function collide(arena, player){
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y){
    for (let x =0 ; x < m[y].length; ++x){
      //checking matrix on index y and x
      //if arena has row
      // and column
      if ((m[y][x] !== 0) &&
          (arena[y + o.y] &&
           arena[y + o.y][x + o.x] !== 0)){
             console.log('just collided');
            return true;
          }
    }
  }
  return false;
}

function draw(){
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);
}


function createMatrix(w, h){
  const matrix = [];

  //while h is not 0, we decrease by 1, then make an array and fill it with 0s
  while (h--){
    matrix.push(new Array(w).fill(0));
  }

  return matrix;
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
      [1, 1],
      [1, 1],
    ];
  } else if (type === 'L'){
    return [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ];
  } else if (type === 'J'){
    return [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ];
  } else if (type === 'I'){
    return [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ];
  } else if (type === 'S'){
    return [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
  } else if (type === 'Z'){
    return [
      [1, 1, 0],
      [0, 1, 1],
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
        context.fillStyle='red';
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

//this will copy all the players into the arena at the correct position
function merge(arena, player){
  player.matrix.forEach((row, y) => {
    row.forEach((value, x ) =>{
      if (value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerMove(dir){
  console.log(dir);
  player.pos.x += dir;

  //so it can't exit the left or right
  if (collide(arena, player)){
    player.pos.x -= dir;
  }
}

function playerReset(){
  const pieces = 'ILJOTSZ';
  //picking a random piece
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  //setting it at the top
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) -
                  (player.matrix[0].length / 2 | 0);
}

//rotating the block
function playerRotate(dir){
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);

  //checking if colliding while rotating (cannot rotate in the wall)
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length){
      rotate(player.matrix, dir);
      player.pos.x = pos;
      return;
    }
  }
}

//rotating the matrix
function rotate(matrix, dir){
  for (let y = 0; y < matrix.length; y++){
    for (let x = 0; x < y; ++x){
      [
        matrix[x][y],
        matrix[y][x],
      ] =
      [
        matrix[y][x],
        matrix[x][y],
      ];
    }
  }
  if (dir > 0 ){
    matrix.forEach(row => row.reverse());
  } else{
    matrix.reverse();
  }
}

//when player manually drops the block
function playerDrop(){
  player.pos.y++;
  //when the player hits the bottom of the game, or collides with another block
  if (collide(arena, player)){
    //move it up to the bottom floor
    player.pos.y--;
    //merge arena with player
    merge(arena, player);
    playerReset();
  }

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
  matrix: createPiece('T'),
}

//movement of the blocks
document.addEventListener('keydown', event =>{
  //if left pressed
  if (event.keyCode === 37){
    playerMove(-1);
    //else right pressed
  } else if (event.keyCode === 39){
    playerMove(1);
    //the down button pressed
  } else if (event.keyCode === 40){
    playerDrop();
    //the q button is pressed
  } else if (event.keyCode == 81){
    playerRotate(-1);
    //the w button is pressed
  } else if (event.keyCode == 87){
    playerRotate(1);
  }
});

update();
