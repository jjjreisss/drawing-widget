var StrokeSample = function(id, width, height) {
  this.strokeSampleCanvas = document.getElementById(id);
  this.strokeSampleContext = this.strokeSampleCanvas.getContext('2d');
  this.strokeSampleCanvas.width = width;
  this.strokeSampleCanvas.height = height;
  this.size = width;
};

StrokeSample.prototype.pickSample = function (color, size) {
  this.strokeSampleContext.clearRect(0,0,this.size,this.size);
  var centerX = this.size / 2;
  var centerY = this.size / 2;
  var left = centerX - size / 2;
  var top = centerY - size / 2;
  this.strokeSampleContext.lineJoin = this.strokeSampleContext.lineCap = 'round';
  this.strokeSampleContext.beginPath();
  this.strokeSampleContext.moveTo(centerX, centerY);
  this.strokeSampleContext.lineTo(centerX+1, centerY+1);
  this.strokeSampleContext.strokeStyle = color;
  this.strokeSampleContext.lineWidth = size;
  this.strokeSampleContext.stroke();
  this.strokeSampleContext.closePath();

  // this.strokeSampleContext.fillRect(top, left, size, size);
};

module.exports = StrokeSample;
