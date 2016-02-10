(function() {
  var DrawingCanvas = window.DrawingCanvas = function(id) {
    this.canvas = document.getElementById(id);
    // this.canvas.width = width;
    // this.canvas.height = height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext('2d');
    this.prevX = 0;
    this.prevY = 0;
    this.currX = 0;
    this.currY = 0;
    this.rgbString = "black";
    this.ctx.lineJoin = this.ctx.lineCap = 'round';
    this.blankImageData = this.getImageData();
    this.history = [this.blankImageData, this.blankImageData, this.blankImageData, this.blankImageData, this.blankImageData, this.blankImageData];

    this.drawing = false;
    this.stamping = false;

    this.color = "#000";
    this.size = 20;
  };

  DrawingCanvas.prototype.mouseDown = function (e, color, size) {
    this.drawInitialMark();
    this.drawing = true;
  };

  DrawingCanvas.prototype.mouseMove = function (e) {
    this.prevX = this.currX;
    this.prevY = this.currY;

    this.currX = e.pageX - this.canvas.getBoundingClientRect().left - window.scrollX;
    this.currY = e.pageY - this.canvas.getBoundingClientRect().top - window.scrollY;

    if (this.drawing) {
      this.draw();
    } else {
      this.preview();
    }
  };


  DrawingCanvas.prototype.mouseUp = function (e) {
    this.saveFrame();
    this.drawing = false;
  };


  DrawingCanvas.prototype.mouseWheel = function (e) {
    if (e.deltaY > 0) {
      this.scaleDown();
    } else if (e.deltaY < 0) {
      this.scaleUp();
    }
  };


  DrawingCanvas.prototype.mouseOut = function (e) {
    if(this.drawing) {
      this.saveFrame();
    }
    this.setToLastFrame();

    this.drawing = false;
  };

  DrawingCanvas.prototype.scaleUp = function () {
    this.size = this.size * 1.1;
  };

  DrawingCanvas.prototype.scaleDown = function () {
    this.size = this.size / 1.1;
  };

  DrawingCanvas.prototype.setToLastFrame = function() {
    this.clear();
    this.putImageData(this.history[this.history.length - 1]);
  };

  DrawingCanvas.prototype.saveFrame = function () {
    this.history.shift();
    this.history.push(this.getImageData());
  };


  DrawingCanvas.prototype.setColor = function (color) {
    this.color = color;
  };

  DrawingCanvas.prototype.setSize = function (size) {
    this.size = size;
  };

  DrawingCanvas.prototype.undo = function () {
    this.history.unshift(this.history.pop());
    this.setToLastFrame();
  };

  DrawingCanvas.prototype.preview = function () {
    if (this.stamping) {
      this.setToLastFrame();
      this.previewStamp();
    } else {
      this.setToLastFrame();
      this.previewStroke();
    }
  };

  DrawingCanvas.prototype.draw = function () {
    if (this.stamping) {
      this.drawStamp();
    } else {
      this.drawStroke();
    }
  };

  DrawingCanvas.prototype.previewStamp = function () {
    this.ctx.globalAlpha = 0.4;
    this.drawStamp();
    this.ctx.globalAlpha = 1.0;
  };

  DrawingCanvas.prototype.drawStamp = function () {
    var img = new Image();
    img.src = this.stampImg;
    this.ctx.drawImage(img, this.currX-this.stampSize/2, this.currY-this.stampSize/2);
  };

  DrawingCanvas.prototype.previewStroke = function () {
    this.ctx.globalAlpha = 0.4;
    this.ctx.beginPath();
    this.ctx.moveTo(this.currX+1, this.currY+1);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.globalAlpha = 1.0;
  };

  DrawingCanvas.prototype.drawStroke = function () {
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevX, this.prevY);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  DrawingCanvas.prototype.drawInitialMark = function () {
    if (this.stamping) {
      this.drawStamp();
    } else {
      this.drawInitialStroke();
    }
  };

  DrawingCanvas.prototype.drawInitialStroke = function () {
    this.ctx.beginPath();
    this.ctx.moveTo(this.currX+1, this.currY+1);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  DrawingCanvas.prototype.toggleStamping = function () {
    this.stamping = !this.stamping;
  };

  DrawingCanvas.prototype.turnStampingOn = function () {
    this.stamping = true;
  };

  DrawingCanvas.prototype.toData = function () {
    return this.canvas.toDataURL("image/png");
  };

  DrawingCanvas.prototype.setStamp = function (stampImg, stampSize) {
    this.stampImg = stampImg;
    this.stampSize = stampSize;
  };

  DrawingCanvas.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  DrawingCanvas.prototype.loadImage = function (url) {
    var img = new Image();
    img.crossOrigin="anonymous";
    img.src = url;
    img.onload = function() {
      this.ctx.drawImage(img, 0, 0);
    }.bind(this);
  };

  DrawingCanvas.prototype.getImageData = function () {
    return this.ctx.getImageData(0,0,this.width,this.height);
  };

  DrawingCanvas.prototype.putImageData = function (imageData) {
    this.clear();
    this.ctx.putImageData(imageData, 0, 0);
  };

  DrawingCanvas.prototype.hardReset = function () {
    this.clear();
    this.history = [this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData()];
  };


    /******** Our main function ********/
  function main() {
    var drawingCanvas = new DrawingCanvas("drawing-canvas")
    var canvasElement = document.getElementById("drawing-canvas");
    canvasElement.addEventListener("mousedown", drawingCanvas.mouseDown.bind(drawingCanvas), true);
    canvasElement.addEventListener("mouseup", drawingCanvas.mouseUp.bind(drawingCanvas), true);
    canvasElement.addEventListener("mousemove", drawingCanvas.mouseMove.bind(drawingCanvas), true);
    canvasElement.addEventListener("mousewheel", drawingCanvas.mouseWheel.bind(drawingCanvas), true);

  }

  main();

})(this)
