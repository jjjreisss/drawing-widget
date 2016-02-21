(function() {
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

  DrawingCanvas.prototype.getPNG = function () {
    return this.canvas.toDataURL("image/png");
  };

  DrawingCanvas.prototype.putImageData = function (imageData) {
    this.clear();
    this.ctx.putImageData(imageData, 0, 0);
  };

  DrawingCanvas.prototype.hardReset = function () {
    this.clear();
    this.history = [this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData(), this.getImageData()];
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
  function main() {
    var drawingWidgetElement = document.getElementById("drawing-widget");
    var drawingCanvasElement = document.createElement("canvas");
    var colorPickerContainer = document.createElement("div");
    var colorPickerElement = document.createElement("canvas");
    var colorSampleElement = document.createElement("div");
    var saveImageElement = document.createElement("button");
    var saveImagePicture = document.createElement("img");
    var widgetWidth = drawingWidgetElement.getAttribute("width") || 400;
    var widgetHeight = drawingWidgetElement.getAttribute("height") || 300;

    drawingWidgetElement.style.width = widgetWidth + "px";
    drawingWidgetElement.style.height = widgetHeight + "px";

    drawingCanvasElement.style.width = widgetWidth * 4/5 + "px";
    drawingCanvasElement.style.height = widgetHeight + "px";

    drawingCanvasElement.setAttribute("width", widgetWidth * 4/5);
    drawingCanvasElement.setAttribute("height", widgetHeight);

    colorPickerContainer.style.width = widgetWidth * 1/5 + "px";
    colorPickerContainer.style.height = widgetHeight + "px";
    colorPickerContainer.style.display = "inline-block";
    colorPickerContainer.style.position = "absolute";

    colorPickerElement.style.width = widgetWidth * 1/5 + "px";
    colorPickerElement.style.height = (widgetHeight - widgetWidth * 1/5) + "px";

    colorPickerElement.setAttribute("width", widgetWidth * 1/5);
    colorPickerElement.setAttribute("height", (widgetHeight - widgetWidth * 1/5));

    colorSampleElement.style.width = widgetWidth * 1/5 + "px";
    colorSampleElement.style.height = widgetWidth * 1/5 + "px";
    colorSampleElement.style.background = "black";
    colorSampleElement.style.position = "absolute";
    colorSampleElement.style.bottom = "0";

    saveImageElement.style.position = "absolute";
    saveImageElement.style.bottom = "3px";
    saveImageElement.style.right = "3px";
    saveImageElement.style.padding = "2px";
    saveImageElement.style.borderRadius = "5px";

    var floppySize = widgetWidth * 1/20;
    saveImagePicture.src = "http://res.cloudinary.com/ddhru3qpb/image/upload/w_" + floppySize + ",h_" + floppySize + "/save_tkicwp.png"

    drawingCanvasElement.id = "drawing-canvas";
    colorSampleElement.id = "color-sample";
    colorPickerElement.id = "color-picker";
    saveImageElement.id = "save-image";

    drawingWidgetElement.appendChild(drawingCanvasElement);
    drawingWidgetElement.appendChild(colorPickerContainer);
    colorPickerContainer.appendChild(colorPickerElement);
    colorPickerContainer.appendChild(colorSampleElement);
    colorSampleElement.appendChild(saveImageElement);
    saveImageElement.appendChild(saveImagePicture);

    drawingCanvas = new DrawingCanvas("drawing-canvas");
    colorPicker = new ColorPicker("color-picker");

    drawingCanvasElement.addEventListener("mousedown", drawingCanvas.mouseDown.bind(drawingCanvas), true);
    drawingCanvasElement.addEventListener("mouseup", drawingCanvas.mouseUp.bind(drawingCanvas), true);
    drawingCanvasElement.addEventListener("mousemove", drawingCanvas.mouseMove.bind(drawingCanvas), true);
    drawingCanvasElement.addEventListener("mousewheel", drawingCanvas.mouseWheel.bind(drawingCanvas), true);
    drawingCanvasElement.addEventListener("mouseout", drawingCanvas.mouseOut.bind(drawingCanvas), true);

    var changingColor = false;

    colorPickerElement.addEventListener(
      "mousedown",
      function(e) {
        changingColor = true;
        var newColor = colorPicker.pickColor.bind(colorPicker, e)();
        drawingCanvas.setColor.bind(drawingCanvas, newColor)();
        colorSampleElement.style.background = newColor;
      },
      true
    );

    colorPickerElement.addEventListener(
      "mouseup",
      function(e) {
        changingColor = false;
      },
      true
    );

    colorPickerElement.addEventListener(
      "mousemove",
      function(e) {
        if (changingColor) {
          var newColor = colorPicker.pickColor.bind(colorPicker, e)();
          drawingCanvas.setColor.bind(drawingCanvas, newColor)();
          colorSampleElement.style.background = newColor;
        }
      },
      true
    );

    saveImageElement.addEventListener(
      "click",
      function(e) {
        var imagePNG = drawingCanvas.getPNG.bind(drawingCanvas)();
        window.open(imagePNG);
      },
      true
    );


    // colorPickerElement.addEventListener("mousedown", colorPicker.pickColor.bind(colorPicker), true);
    // colorPickerElement.addEventListener("divmouseup", colorPicker.mouseUp.bind(colorPicker), true);
    // colorPickerElement.addEventListener("mousemove", colorPicker.mouseMove.bind(colorPicker), true);
    // colorPickerElement.addEventListener("mousewheel", colorPicker.mouseWheel.bind(colorPicker), true);


  }


  main();

})(this)
