// (function() {
  var DrawingCanvas = window.DrawingCanvas = function(id) {
    this.canvas = document.getElementById(id);
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
    this.drawInitialStroke();
    this.drawing = true;
  };

  DrawingCanvas.prototype.mouseMove = function (e) {
    this.prevX = this.currX;
    this.prevY = this.currY;

    this.currX = e.pageX - this.canvas.getBoundingClientRect().left - window.scrollX;
    this.currY = e.pageY - this.canvas.getBoundingClientRect().top - window.scrollY;

    if (this.drawing) {
      this.drawStroke();
    } else {
      this.preview();
    }
  };


  DrawingCanvas.prototype.mouseUp = function (e) {
    if (this.drawing) {
      this.saveFrame();
    }
    this.drawing = false;
  };


  DrawingCanvas.prototype.mouseWheel = function (e) {
    e.preventDefault();
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
    this.setToLastFrame();
    this.previewStroke();
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

  DrawingCanvas.prototype.drawInitialStroke = function () {
    this.ctx.beginPath();
    this.ctx.moveTo(this.currX+1, this.currY+1);
    this.ctx.lineTo(this.currX, this.currY);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.stroke();
    this.ctx.closePath();
  };

  DrawingCanvas.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  DrawingCanvas.prototype.getPNG = function () {
    return this.canvas.toDataURL("image/png");
  };

  DrawingCanvas.prototype.putImageData = function (imageData) {
    this.clear();
    this.ctx.putImageData(imageData, 0, 0);
  };

  DrawingCanvas.prototype.hardReset = function () {
    this.clear();
    this.history = [this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData()];
  };

  DrawingCanvas.prototype.getImageData = function () {
    return this.ctx.getImageData(0,0,this.width,this.height);
  };

  var ColorPicker = window.ColorPicker = function(id) {
    this.colorPickerCanvas = document.getElementById(id);
    this.colorPickerContext = this.colorPickerCanvas.getContext('2d');
    this.width = this.colorPickerCanvas.width;
    this.height = this.colorPickerCanvas.height;

    var pickerImg = new Image();
    pickerImg.crossOrigin="Anonymous";
    pickerImg.src = "http://res.cloudinary.com/ddhru3qpb/image/upload/w_" + this.width + ",h_" + this.height + "/color-picker-80-500_uyhcxj.png";

    pickerImg.onload = function() {
      this.colorPickerContext.drawImage(pickerImg, 0, 0);
    }.bind(this);
  };

  ColorPicker.prototype.pickColor = function (e) {
    var x = e.clientX - this.colorPickerCanvas.getBoundingClientRect().left;
    var y = e.clientY - this.colorPickerCanvas.getBoundingClientRect().top;
    var imgData = this.colorPickerContext.getImageData(x, y, 1, 1).data;
    var rgbArray = [].slice.call(imgData, 0, 3);
    this.rgbString = "rgb(" + rgbArray.join(",") + ")";
    return this.rgbString;
  };

  ColorPicker.prototype.color = function () {
    return this.rgbString;
  };


    /******** Our main function ********/
  var Widget = function() {
    this.drawingWidgetElement = document.getElementById("drawing-widget");
    this.drawingCanvasElement = document.createElement("canvas");
    this.colorPickerContainer = document.createElement("div");
    this.colorPickerElement = document.createElement("canvas");
    this.colorSampleElement = document.createElement("div");
    this.saveImageElement = document.createElement("button");
    this.saveImagePicture = document.createElement("img");
    this.clearImageElement = document.createElement("button");
    this.clearImagePicture = document.createElement("img");
    this.widgetWidth = this.drawingWidgetElement.getAttribute("width") || 400;
    this.widgetHeight = this.drawingWidgetElement.getAttribute("height") || 300;
  }


  Widget.prototype.setSize = function(element, width, height) {
    element.style.width = width + "px";
    element.style.height = height + "px";
  }

  Widget.prototype.setUpDrawingWidget = function() {
    this.setSize(
      this.drawingWidgetElement, this.widgetWidth, this.widgetHeight
    );
  }

  Widget.prototype.setUpDrawingCanvas = function () {
    this.setSize(
      this.drawingCanvasElement, this.widgetWidth * 4/5, this.widgetHeight
    );
    this.drawingCanvasElement.setAttribute("width", this.widgetWidth * 4/5);
    this.drawingCanvasElement.setAttribute("height", this.widgetHeight);
    this.drawingCanvasElement.id = "drawing-canvas";
  };

  Widget.prototype.setUpColorPickerContainer = function () {
    this.setSize(
      this.colorPickerContainer, this.widgetWidth * 1/5, this.widgetHeight
    );
    this.colorPickerContainer.style.display = "inline-block";
    this.colorPickerContainer.style.position = "absolute";
    this.colorPickerContainer.id = "color-picker-container";
  };

  Widget.prototype.setUpColorPicker = function () {
    this.setSize(
      this.colorPickerElement, this.widgetWidth * 1/5, this.widgetHeight - this.widgetWidth * 1/5
    );
    this.colorPickerElement.setAttribute("width", this.widgetWidth * 1/5);
    this.colorPickerElement.setAttribute("height", (this.widgetHeight - this.widgetWidth * 1/5));
    this.colorPickerElement.id = "color-picker";
  };

  Widget.prototype.setUpColorSample = function () {
    this.setSize(
      this.colorSampleElement, this.widgetWidth * 1/5, this.widgetWidth * 1/5
    );
    this.colorSampleElement.style.background = "black";
    this.colorSampleElement.style.position = "absolute";
    this.colorSampleElement.style.bottom = "0";
    this.colorSampleElement.id = "color-sample";
  };

  Widget.prototype.setUpSaveImage = function() {
    this.saveImageElement.style.position = "absolute";
    this.saveImageElement.style.bottom = "3px";
    this.saveImageElement.style.right = "3px";
    this.saveImageElement.style.padding = "2px";
    this.saveImageElement.style.borderRadius = "5px";
    this.saveImageElement.id = "save-image";

    var floppySize = this.widgetWidth * 1/25;
    this.saveImagePicture.src = "http://res.cloudinary.com/ddhru3qpb/image/upload/w_" + floppySize + ",h_" + floppySize + "/save_tkicwp.png";
  }

  Widget.prototype.setUpClearImage = function () {
    this.clearImageElement.style.position = "absolute";
    this.clearImageElement.style.bottom = "3px";
    this.clearImageElement.style.left = "3px";
    this.clearImageElement.style.padding = "2px";
    this.clearImageElement.style.borderRadius = "5px";
    this.clearImageElement.id = "clear-image";

    var newPageSize = this.widgetWidth * 1/25;
    this.clearImagePicture.src = "http://res.cloudinary.com/ddhru3qpb/image/upload/w_" + newPageSize + ",h_" + newPageSize + "/new_eolomw.png";
  };

  Widget.prototype.setUpScaffolding = function () {
    this.drawingWidgetElement.appendChild(this.drawingCanvasElement);
    this.drawingWidgetElement.appendChild(this.colorPickerContainer);
    this.colorPickerContainer.appendChild(this.colorPickerElement);
    this.colorPickerContainer.appendChild(this.colorSampleElement);
    this.colorSampleElement.appendChild(this.saveImageElement);
    this.saveImageElement.appendChild(this.saveImagePicture);
    this.colorSampleElement.appendChild(this.clearImageElement);
    this.clearImageElement.appendChild(this.clearImagePicture);
  };

  Widget.prototype.initializeDrawingCanvas = function () {
    this.drawingCanvas = new DrawingCanvas("drawing-canvas");
    this.drawingCanvasElement.addEventListener("mousedown", this.drawingCanvas.mouseDown.bind(this.drawingCanvas), true);
    this.drawingCanvasElement.addEventListener("mouseup", this.drawingCanvas.mouseUp.bind(this.drawingCanvas), true);
    this.drawingCanvasElement.addEventListener("mousemove", this.drawingCanvas.mouseMove.bind(this.drawingCanvas), true);
    this.drawingCanvasElement.addEventListener("mousewheel", this.drawingCanvas.mouseWheel.bind(this.drawingCanvas), true);
    this.drawingCanvasElement.addEventListener("mouseout", this.drawingCanvas.mouseOut.bind(this.drawingCanvas), true);
  };

  Widget.prototype.initializeColorCanvas = function () {
    this.colorPicker = new ColorPicker("color-picker");
    this.changingColor = false;

    this.colorPickerElement.addEventListener(
      "mousedown",
      function(e) {
        this.changingColor = true;
        var newColor = this.colorPicker.pickColor.bind(this.colorPicker, e)();
        this.drawingCanvas.setColor.bind(this.drawingCanvas, newColor)();
        this.colorSampleElement.style.background = newColor;
      }.bind(this),
      true
    );

    this.colorPickerElement.addEventListener(
      "mouseup",
      function(e) {
        this.changingColor = false;
      }.bind(this),
      true
    );

    this.colorPickerElement.addEventListener(
      "mousemove",
      function(e) {
        if (this.changingColor) {
          var newColor = this.colorPicker.pickColor.bind(this.colorPicker, e)();
          this.drawingCanvas.setColor.bind(this.drawingCanvas, newColor)();
          this.colorSampleElement.style.background = newColor;
        }
      }.bind(this),
      true
    );

    this.saveImageElement.addEventListener(
      "click",
      function(e) {
        var imagePNG = this.drawingCanvas.getPNG.bind(this.drawingCanvas)();
        window.open(imagePNG);
      }.bind(this),
      true
    );

    this.clearImageElement.addEventListener(
      "click",
      function(e) {
        var imagePNG = this.drawingCanvas.hardReset.bind(this.drawingCanvas)();
      }.bind(this),
      true
    );

  };

  var widget = new Widget();

  function main() {
    widget.setUpDrawingWidget();
    widget.setUpDrawingCanvas();
    widget.setUpColorPickerContainer();
    widget.setUpColorPicker();
    widget.setUpColorSample();
    widget.setUpSaveImage();
    widget.setUpClearImage();
    widget.setUpScaffolding();
    widget.initializeDrawingCanvas();
    widget.initializeColorCanvas();
  }


  main();
//
// })(this)
