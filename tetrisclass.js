class Tetris {
  constructor(element){

    this.element = element;
    this.canvas = element.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    //zooming in a little bit
    this.context.scale(20, 20);


    this.arena = new Arena(12, 20);
    //giving player the tetris class instance
    this.player = new Player(this);

    //for the colors
    this.colors = [
      null,
      'red',
      'blue',
      'violet',
      'green',
      'purple',
      'orange',
      'pink',
    ]

    let lastTime = 0;

    //initial time is 0, when drop initially we 're not calling it wiht anything'
    //this is dropping of the thing
    const update = (time = 0) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      this.player.update(deltaTime);

      this.draw();
      requestAnimationFrame(update);
    }

    update();
    this.updateScore(0);
  }

  draw(){
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawMatrix(this.arena.matrix, {x: 0, y: 0});
    this.drawMatrix(this.player.matrix, this.player.pos);
  }

  //drawing the piece
  //offset is how much it moves
  drawMatrix(matrix, offset){
    matrix.forEach((row, y) =>{
      row.forEach((value, x) => {
        //draw if value is not 0
        if (value !== 0){
          this.context.fillStyle= this.colors[value];
          this.context.fillRect(x + offset.x,
                           y + offset.y,
                           1, 1);
        }
      });
    });
  }

  //updating score
  updateScore(score){
    this.element.querySelector('#score').innerText = score;
  }
}
