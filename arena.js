class Arena{
  constructor(w, h){
    const matrix = [];

    //while h is not 0, we decrease by 1, then make an array and fill it with 0s
    while (h--){
      matrix.push(new Array(w).fill(0));
    }
    this.matrix = matrix;
  }

  clear(){
    this.matrix.forEach(row => row.fill(0));
  }

  collide(player){
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y){
      for (let x =0 ; x < m[y].length; ++x){
        //checking matrix on index y and x
        //if arena has row
        // and column
        if (m[y][x] !== 0 &&
            (this.matrix[y + o.y] &&
             this.matrix[y + o.y][x + o.x]) !== 0){
               console.log('just collided');
              return true;
            }
      }
    }
    return false;
  }

  //this will copy all the players into the arena at the correct position
  merge(player){
    player.matrix.forEach((row, y) => {
      row.forEach((value, x ) =>{
        if (value !== 0){
          this.matrix[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  }

  //collecting the rows when the row is cleared
  sweep(){
    let rowCount = 1;
    let score = 0;
    outer: for (let y = this.matrix.length - 1; y > 0; y--){
      for (let x = 0; x < this.matrix[y].length; ++x){
        //if not fully populated
        if (this.matrix[y][x] === 0){
          continue outer;
        }
      }

      //remove that row from this.matrix
      const row = this.matrix.splice(y, 1)[0].fill(0);
      //putting that row on top of the arena so its still full arrays
      arena.unshift(row);
      y++;

      score += rowCount * 10;
      rowCount *= 2;
    }
    return score;
  }
}
