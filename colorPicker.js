var ColorPicker = function(id, width, height) {
  this.colorPickerCanvas = document.getElementById(id);
  this.colorPickerContext = this.colorPickerCanvas.getContext('2d');

  this.colorPickerCanvas.width = width;
  this.colorPickerCanvas.height = height;

  var pickerImg = new Image();
  if (this.colorPickerCanvas.width === 80) {
    pickerImg.src = './color-picker-80-500.png';
  } else {
    pickerImg.src = './color-picker-64-400.png';
  }
  pickerImg.onload = function() {
    this.colorPickerContext.drawImage(pickerImg, 0, 0);
  }.bind(this);
};

ColorPicker.prototype.pickColor = function (e) {
  var x = e.clientX - this.colorPickerCanvas.getBoundingClientRect().left;
  var y = e.clientY - this.colorPickerCanvas.getBoundingClientRect().top;
  var imgData = this.colorPickerContext.getImageData(x, y, 1, 1).data;
  var rgbArray = imgData.slice(0,3);
  this.rgbString = "rgb(" + rgbArray.join(",") + ")";
  return this.rgbString;
};

ColorPicker.prototype.color = function () {
  return this.rgbString;
};


module.exports = ColorPicker;
