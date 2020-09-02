// first, make sure the canvas has right size
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let temp_canvas = document.createElement('canvas');
let context = temp_canvas.getContext('2d');

// default drawing tool is pencil
let tool = new tool_pencil();
highlight('pencil');
c.addEventListener('mousedown', draw_handler, false);
c.addEventListener('mousemove', draw_handler, false);
c.addEventListener('mouseup',   draw_handler, false);
c.addEventListener('mouseout',  draw_handler, false);

// backup canvas - for undo operation
let back1 = document.createElement("canvas");
let backCtx1 = back1.getContext("2d");
let back2 = document.createElement("canvas");
let backCtx2 = back2.getContext("2d");
let restored = false;

// pencil drawing tool
function tool_pencil () {
  var pencil = this;
  this.started = false;

  // This is called when you start holding down the mouse button.
  // This starts the pencil drawing.
  this.mousedown = function (e) {
      ctx.beginPath();
      ctx.moveTo(e._x, e._y);
      pencil.started = true;
  };

  // This function is called every time you move the mouse. Obviously, it only 
  // draws if the tool.started state is set to true (when you are holding down 
  // the mouse button).
  this.mousemove = function (e) {
    if (pencil.started) {
      ctx.lineTo(e._x, e._y);
      ctx.stroke();
    }
  };

  // This is called when you release the mouse button.
  this.mouseup = function (e) {
    if (pencil.started) {
      pencil.mousemove(e);
      pencil.started = false;
      saveCanvas();
    }
  };

    // This is called when you move the mouse button out.
  this.mouseout = function (e) {
    if (pencil.started) {
      pencil.mousemove(e);
      pencil.started = false;
      saveCanvas();
    }
  };
}

// rectangle drawing tool
function tool_rect() {
	var rect = this;
  this.started = false;
  

	this.mousedown = function (ev) {
		rect.started = true;
		rect.x0 = ev._x;
		rect.y0 = ev._y;
	};

	this.mousemove = function (ev) {
		if (!rect.started) {
			return;
		}

		var x = Math.min(ev._x,	rect.x0),
			y = Math.min(ev._y,	rect.y0),
			w = Math.abs(ev._x - rect.x0),
			h = Math.abs(ev._y - rect.y0);

		context.clearRect(0, 0, c.width, c.height);
		if (!w || !h) {
			return;
		}
    context.lineWidth = 2;
    context.strokeStyle = ctx.strokeStyle;
		context.strokeRect(x, y, w, h);
	};

	this.mouseup = function (ev) {
		if (rect.started) {
			rect.mousemove(ev);
      rect.started = false;
      updateImg();
      saveCanvas();
		}
  };
  
  this.mouseout = function (ev) {
		if (rect.started) {
			rect.mousemove(ev);
      rect.started = false;
      updateImg();
      saveCanvas();
		}
	};
};

// eraser tool
function tool_eraser (radius) {
  var eraser = this;
  this.started = false;
  this.radius = radius
  const color = ctx.strokeStyle;

  this.mousedown = function (e) {
      ctx.beginPath();
      ctx.arc(e._x,e._y,radius,0,2*Math.PI);
      ctx.strokeStyle = 'white';
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
      eraser.started = true;
  };

  // This function is called every time you move the mouse. Obviously, it only 
  // draws if the tool.started state is set to true (when you are holding down 
  // the mouse button).
  this.mousemove = function (e) {
    if (eraser.started) {
      ctx.moveTo(e._x, e._y);
      ctx.arc(e._x,e._y,radius,0,2*Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  };

  // This is called when you release the mouse button.
  this.mouseup = function (e) {
    if (eraser.started) {
      eraser.started = false;
      ctx.strokeStyle = color;
      saveCanvas();
    }
  };

    // This is called when you move the mouse button out.
  this.mouseout = function (e) {
    if (eraser.started) {
      eraser.started = false;
      ctx.strokeStyle = color;
      saveCanvas();
    }
  };
}

// General-purpose event handler
function draw_handler (ev) {
  if (ev.layerX || ev.layerX == 0) { // Firefox
    ev._x = ev.layerX;
    ev._y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }

  // Call the event handler of the tool.
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}

// clear the canvas with previous states
function resetCanvas(){
  document.getElementById('color_option').style.display = "none";
  document.getElementById('eraser_option').style.display = "none";
  
  ctx.clearRect(0,0,c.width,c.height);
  temp_canvas.width = c.width;
  temp_canvas.height = c.height;
  back1 = document.createElement("canvas");
  backCtx1 = back1.getContext("2d");
  backCtx1.fillStyle = back1.fillStyle;
  back2 = document.createElement("canvas");
  backCtx2 = back2.getContext("2d");
  backCtx2.fillStyle = back2.fillStyle;
  back1.width = c.width;
  back1.height = c.height;
  back2.width = c.width;
  back2.height = c.height;
  restored = false;
}

// resize the canvas
function resizeCanvas(e){
  // adjust the size of canvas dynamically
  const board = document.getElementById('board');
  const cs = getComputedStyle(board);
  c.width = parseInt(cs.getPropertyValue('width'), 10);
  c.height = parseInt(cs.getPropertyValue('height'), 10)*0.8824;
  resetCanvas();
}

// restore canvas to the previous state
function restoreCanvas(){
  document.getElementById('color_option').style.display = "none";
  document.getElementById('eraser_option').style.display = "none";

  if(!restored){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(back1,0,0);
    const newbackCanvas = document.createElement("canvas");
    const newbackCtx = newbackCanvas.getContext("2d");
    newbackCanvas.width = c.width;
    newbackCanvas.height = c.height;
    newbackCtx.drawImage(c,0,0);
    back2 = newbackCanvas;
    restored = true;
  }
}

// save current state
function saveCanvas(){
  const newbackCanvas = document.createElement("canvas");
  const newbackCtx = newbackCanvas.getContext("2d");
  newbackCanvas.width = c.width;
  newbackCanvas.height = c.height;
  newbackCtx.drawImage(c,0,0);
  back1 = back2;
  back2 = newbackCanvas;
  restored = false;
}

// draw the background layer to ctx (used for rectangle)
function updateImg(){
  ctx.drawImage(temp_canvas,0,0);
  context.clearRect(0,0,temp_canvas.width,temp_canvas.height);
}

// show color options
function showColorOption(){
  document.getElementById('eraser_option').style.display = "none";
  if(document.getElementById('color_option').style.display == "block")
    document.getElementById('color_option').style.display = "none";
  else
    document.getElementById('color_option').style.display = "block";
}

// show eraser options
function showEraserOption(){
  document.getElementById('color_option').style.display = "none";
  if(document.getElementById('eraser_option').style.display == "flex")
    document.getElementById('eraser_option').style.display = "none";
  else
    document.getElementById('eraser_option').style.display = "flex";
}

// change drawing color
function changeColor(color){
  ctx.strokeStyle = color;
  context.strokeStyle = color;
}

// change the drawing tool to pencil
function changePen(){
  document.getElementById('color_option').style.display = "none";
  document.getElementById('eraser_option').style.display = "none";
  highlight('pencil');
  tool = new tool_pencil();
}

// change the drawing tool to rect
function changeRect(){
  document.getElementById('color_option').style.display = "none";
  document.getElementById('eraser_option').style.display = "none";
  highlight('rect');
  tool = new tool_rect();
}

// change the drawing tool to eraser
function changeEraser(radius){
  document.getElementById('color_option').style.display = "none";
  highlight('eraser');
  tool = new tool_eraser(radius);
  return;
}

// highlight the selected drawing tool
function highlight(e){
  let pencil = document.getElementById("pencil");
  let eraser = document.getElementById("eraser");
  let rect = document.getElementById("rect");
  pencil.classList.remove("hoverBtn");
  eraser.classList.remove("hoverBtn");
  rect.classList.remove("hoverBtn");
  let div = document.getElementById(e);
  div.classList.add("hoverBtn");
}