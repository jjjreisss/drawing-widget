var SizePicker = function (id, width, height) {
  this.sizePickerCanvas = document.getElementById(id);
  this.sizePickerContext = this.sizePickerCanvas.getContext('2d');

  this.sizePickerCanvas.width = width;
  this.sizePickerCanvas.height = height;

  var pickerImg = new Image();
  if (this.sizePickerCanvas.width === 80) {
    pickerImg.src = './triangle-v2.png';
  } else {
    pickerImg.src = './triangle-v2-small.png';
  }

  pickerImg.onload = function() {
    this.sizePickerContext.drawImage(pickerImg, 0, 0);
  }.bind(this);
};

SizePicker.prototype.pickSize = function (e) {
  var y = e.clientY - this.sizePickerCanvas.getBoundingClientRect().top;

  if (this.sizePickerCanvas.width === 80) {
    var size = (390-y) * 52 / 355;
  } else {
    var size = (312-y) * 52 / 355;
  }

  return Math.max(0.1, size);
};


module.exports = SizePicker;
