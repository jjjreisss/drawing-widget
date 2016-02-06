var ApiUtil = require('./apiUtil');
var StampStore = require('../stores/stampStore');

var BasicDrawingCanvas = function(id, length, width) {
  this.length = length;
  this.width = width;
  this.canvas = document.getElementById(id);
  this.canvas.width = length;
  this.canvas.height = width;
  this.ctx = this.canvas.getContext('2d');
  this.prevX = 0;
  this.prevY = 0;
  this.currX = 0;
  this.currY = 0;
  this.rgbString = "black";
  this.ctx.lineJoin = this.ctx.lineCap = 'round';
  this.history = [this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData()];

  this.drawing = false;
};

BasicDrawingCanvas.prototype.mouseDown = function(e, color, size) {
  this.drawInitialStroke();
  this.drawing = true;
};

BasicDrawingCanvas.prototype.mouseMove = function (e) {
  this.prevX = this.currX;
  this.prevY = this.currY;

  this.currX = (e.pageX - this.canvas.offsetLeft
    - this.canvas.offsetParent.offsetLeft
    - this.canvas.offsetParent.offsetParent.offsetLeft);
  this.currY = (e.pageY - this.canvas.offsetTop
    - this.canvas.offsetParent.offsetTop
    - this.canvas.offsetParent.offsetParent.offsetTop);

  if (this.drawing) {
    this.draw();
  } else {
    this.preview();
  }
};

BasicDrawingCanvas.prototype.mouseUp = function (e) {
  this.history.shift();
  this.history.push(this.getImageData());

  this.drawing = false;
};

BasicDrawingCanvas.prototype.mouseOut = function (e) {
  if(this.drawing) {
    this.history.shift();
    this.history.push(this.getImageData());
  }

  this.setToLastFrame();

  this.drawing = false;
};

BasicDrawingCanvas.prototype.setToLastFrame = function() {
  this.clear();
  this.putImageData(this.history[this.history.length - 1]);
};


BasicDrawingCanvas.prototype.setColor = function (color) {
  this.color = color;
};

BasicDrawingCanvas.prototype.setSize = function (size) {
  this.size = size;
};

BasicDrawingCanvas.prototype.undo = function () {
  this.history.unshift(null);
  this.history.pop();
  this.setToLastFrame();
};

BasicDrawingCanvas.prototype.preview = function () {
  this.setToLastFrame();
  this.ctx.globalAlpha = 0.4;
  this.draw();
  this.ctx.globalAlpha = 1.0;
};

BasicDrawingCanvas.prototype.draw = function () {
  if (this.stamping) {
    this.drawStamp();
  } else {
    this.drawStroke();
  }
};

BasicDrawingCanvas.prototype.drawStroke = function () {
  this.ctx.beginPath();
  this.ctx.moveTo(this.prevX, this.prevY);
  this.ctx.lineTo(this.currX, this.currY);
  this.ctx.strokeStyle = this.color;
  this.ctx.lineWidth = this.size;
  this.ctx.stroke();
  this.ctx.closePath();
};

BasicDrawingCanvas.prototype.drawStamp = function (transparent) {
  var img = new Image();
  img.src = this.stampImg;
  this.ctx.drawImage(img, this.currX-this.stampSize/2, this.currY-this.stampSize/2);
};

BasicDrawingCanvas.prototype.drawInitialStroke = function (transparent) {
  this.ctx.beginPath();
  this.ctx.moveTo(this.currX+1, this.currY+1);
  this.ctx.lineTo(this.currX, this.currY);
  this.ctx.strokeStyle = this.color;
  this.ctx.lineWidth = this.size;
  this.ctx.stroke();
  this.ctx.closePath();
};

BasicDrawingCanvas.prototype.toggleStamping = function() {
  this.stamping = !this.stamping;
};

BasicDrawingCanvas.prototype.setStamp = function(stampImg, stampSize) {
  this.stampImg = stampImg;
  this.stampSize = stampSize;
};

BasicDrawingCanvas.prototype.toData = function () {
  return this.canvas.toDataURL("image/png");
};

BasicDrawingCanvas.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.width, this.length);
};

BasicDrawingCanvas.prototype.loadImage = function (url) {
  var img = new Image();
  img.crossOrigin="anonymous";
  img.src = url;
  img.onload = function() {
    this.ctx.drawImage(img, 0, 0);
  }.bind(this);
};

BasicDrawingCanvas.prototype.getImageData = function () {
  return this.ctx.getImageData(0,0,this.width,this.length);
};

BasicDrawingCanvas.prototype.putImageData = function (imageData) {
  this.clear();
  this.ctx.putImageData(imageData, 0, 0);
};

BasicDrawingCanvas.prototype.hardReset = function () {
  this.clear();
  this.history = [this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData()];
};

module.exports = BasicDrawingCanvas;
