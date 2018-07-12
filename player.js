//creating a class for players to play in tetris

class Player {
  constructor(tetris){

    this.DROP_SLOW = 1000;
    this.DROP_FAST = 50;

    this.tetris = tetris;
    this.arena = tetris.arena;

    this.dropCounter = 0;
    this.dropInterval = this.DROP_SLOW;

    this.pos = {x: 0, y: 0};
    this.matrix = null;
    this.score = 0;

    this.reset();
  }

  move(dir){
    console.log(dir);
    this.pos.x += dir;

    //so it can't exit the left or right
    if (this.arena.collide(this)){
      this.pos.x -= dir;
    }
  }

  //rotating the block
  rotate(dir){
    const pos = this.pos.x;
    let offset = 1;
    this._rotateMatrix(this.matrix, dir);

    //checking if colliding while rotating (cannot rotate in the wall)
    while(this.arena.collide(this)){
      this.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length){
        this._rotateMatrix(this.matrix, dir);
        this.pos.x = pos;
        return;
      }
    }
  }
  //rotating the matrix
  _rotateMatrix(matrix, dir){
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

  reset(){
    const pieces = 'ILJOTSZ';
    //picking a random piece
    this.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    //setting it at the top
    this.pos.y = 0;
    this.pos.x = (this.arena.matrix[0].length / 2 | 0) -
                    (this.matrix[0].length / 2 | 0);

    //if reset, and this.arena.collides rightaway then the game is over
    if (this.arena.collide(this)){
      //clear the arena
      this.arena.clear();
      this.score = 0;
      updateScore();
    }
  }

  //when player manually drops the block
  drop(){
    this.pos.y++;
    //when the player hits the bottom of the game, or this.arena.collides with another block
    if (this.arena.collide(this)){
      //move it up to the bottom floor
      this.pos.y--;
      //merge arena with player
      this.arena.merge(this);
      this.reset();
      this.score += this.arena.sweep();
      this.tetris.updateScore(this.score);
    }

    this.dropCounter = 0;
  }

  update(deltaTime){

    this.dropCounter += deltaTime;
    if (this.dropCounter > this.dropInterval){
      this.drop();
    }

  }
}
