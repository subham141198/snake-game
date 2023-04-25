jQuery(document).ready(function () {
  var canvas = jQuery("#canvas")[0];
  var context = canvas.getContext("2d");
  var width = jQuery("#canvas").width();
  var height = jQuery("#canvas").height();

  var cw = 10;
  var d;
  var food;
  var score;
  var level;
  var highScore = 0
  

  var snake_array;

  function init() {
    d = "right";
    create_snake();
    create_food();
    score = 0;
    level = 1;

    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint, 250);
  }
  init();

  function create_snake() {
    var length = 5;
    snake_array = [];
    for (var i = length - 1; i >= 0; i--) {
      snake_array.push({ x: i, y: 0 });
    }
  }

  function create_food() {
    food = {
      x: Math.round((Math.random() * (width - cw)) / cw),
      y: Math.round((Math.random() * (height - cw)) / cw),
    };
  }

  function paint() {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    var nx = snake_array[0].x;
    var ny = snake_array[0].y;

    if (d == "right") nx++;
    else if (d == "left") nx--;
    else if (d == "up") ny--;
    else if (d == "down") ny++;

    if (
      nx == -1 ||
      nx == width / cw ||
      ny == -1 ||
      ny == height / cw ||
      check_collision(nx, ny, snake_array)
    ) {
      init();
      return;
    }

    if (nx == food.x && ny == food.y) {
      var tail = { x: nx, y: ny };
      score++;
      levelIncrease(score)
      
      highScore = localStorage.getItem("highScore") ? localStorage.getItem("highScore") < score ? localStorage.setItem("highScore", score) : localStorage.getItem("highScore") :  localStorage.setItem("highScore", score)
      create_food();
    } else {
      var tail = snake_array.pop();
      tail.x = nx;
      tail.y = ny;
    }

    snake_array.unshift(tail);

    for (var i = 0; i < snake_array.length; i++) {
      var c = snake_array[i];
      paint_cell(c.x, c.y, "blue");
    }

    paint_cell(food.x, food.y, "red");
    var score_text = "Score: " + score;
    var level_text = "Level: " + level;
    var high_text = "High Score: " + localStorage.getItem("highScore");
    context.fillText(score_text, 5, height - 5);
    context.fillText(level_text, 60, height - 5);
    context.fillText(high_text, 120, height - 5);
  }
  function paint_cell(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * cw, y * cw, cw, cw);
    context.strokeStyle = "white";
    context.strokeRect(x * cw, y * cw, cw, cw);
  }

  function levelIncrease(){
    if(score  == 5 ){
        level++;
        clearInterval(game_loop)
        game_loop = setInterval(paint, 100);
    }
    if(score  == 10 ){
        level++;
        clearInterval(game_loop)
        game_loop = setInterval(paint, 75);
    }
    if(score  == 15 ){
        level++;
        clearInterval(game_loop)
        game_loop = setInterval(paint, 50);
    }

  }

  function check_collision(x, y, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].x == x && array[i].y == y) return true;
    }
    return false;
  }

  jQuery(document).keydown(function (e) {
    var key = e.which;
    if (key == "37" && d != "right") d = "left";
    else if (key == "38" && d != "down") d = "up";
    else if (key == "39" && d != "left") d = "right";
    else if (key == "40" && d != "up") d = "down";
  });

  $(".stopInterval").on("click", function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(game_loop);
  });

});
