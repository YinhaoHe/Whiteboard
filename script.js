//Initial letiables
let status = 'draw'; //'draw' 'clear'
let dotWidth = 50;
let color = 'DarkKhaki';
let lineWidth = 5;
let canvas = {
  //Initial Canvas
  init() {
    this.ele = document.createElement('canvas');
    document.body.appendChild(this.ele);
    this.ctx = this.ele.getContext('2d');
    //Background
    this.floor = document.createElement('canvas');
    this.floor.id = 'bg';
    document.body.appendChild(this.floor);
    this.floorCtx = this.floor.getContext('2d');
    //Set size for canvas
    this.width = this.ele.width = this.floor.width = window.innerWidth;
    this.height = this.ele.height = this.floor.height = window.innerHeight;

    return this;
  },
  get() {
    return this;
  },
  /* Load background (futher use)
  drawImage(imgPath) {
    let that = this;
    let img = new Image();
    img.src = imgPath;
    img.onload = function() {
      that.floorCtx.clearRect(0, 0, that.width, that.height);
      that.floorCtx.drawImage(img, that.width / 2 - 500, that.height / 2 - 100);
    }

  }, */
  //Bind mouseclick to function
  bind() {
    let ctx = this.ctx;
    let startDraw = false;
    this.ele.onmousedown = function(ev) {
      startDraw = true;
      let x = ev.clientX,
        y = ev.clientY;
      ctx.beginPath();
    }
    this.ele.onmousemove = function(ev) {
      if (startDraw) {
        console.log(status);
        let x = ev.clientX,
          y = ev.clientY;
        if (status == 'draw') {
          ctx.strokeStyle = color;
          ctx.lineWidth = lineWidth;
          ctx.lineTo(x, y);
          ctx.stroke();
        } else if (status == 'clear') {
          ctx.strokeStyle = 'rgba(0,0,0,1)';
          ctx.clearRect(x - 20, y - 20, 40, 40);
        }
      }
    }
    this.ele.onmouseup = function() {
      ctx.closePath();
      startDraw = false;
    }
  }
}
canvas.init().bind();

//Change color function
function changeColor(c) {
  color = c;
}
//Draw function
function draw() {
  console.log('You hit draw function');
  status = 'draw';
}
//Eraser function
function eraser() {
  console.log('You hit eraser function');
  status = 'clear';
}
//Change pen width
function changeWidth(w) {
  lineWidth = w;
}

//Clear canvas
function clearCanvas() {
  let ins = canvas.get();
  ins.ctx.clearRect(0, 0, ins.width, ins.height);
}
//Screenshot and download
function screena() {
  //Set pic type to png
  let type = 'png';
  let imgdata = canvas.get().ele.toDataURL(type);
  //Change mime-type to image/octet-stream
  //Force download
  let fixtype = function(type) {
    type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
    let r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
  }
  imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')
  //Download pic.png
  let saveFile = function(data, filename) {
    let link = document.createElement('a');
    link.href = data;
    link.download = filename;
    let event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
  }
  let filename = new Date().toLocaleDateString() + '.' + type;
  saveFile(imgdata, filename);
}

//Feedback to Yinhao's Github
function feedback() {
  window.location.href = "https://github.com/ArdentLabs/milestone-1-YinhaoHe";
}
