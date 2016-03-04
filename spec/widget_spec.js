describe("Drawing Canvas", function() {


  it ("should make a mark on click", function() {
    var drawingCanvasElement = document.getElementById("drawing-canvas");
    var frame = widget.drawingCanvas.history[5];

    widget.drawingCanvas.mouseDown();
    widget.drawingCanvas.mouseUp();
    // drawingCanvasElement.click();

    expect(frame).not.toBe(widget.drawingCanvas.history[5]);
  });

})

describe("Clear button", function() {

  it ("should reset the drawing canvas history on click", function() {
    var clearImageElement = document.getElementById("clear-image");
    var drawingCanvasElement = document.getElementById("drawing-canvas");
    var frame = widget.drawingCanvas.history[5];

    for (var i = 0; i < 3; i++) {
      widget.drawingCanvas.mouseDown();
      widget.drawingCanvas.mouseUp();
    }

    expect(frame).not.toBe(widget.drawingCanvas.history[5]);

    clearImageElement.click()

    expect(frame).toEqual(widget.drawingCanvas.history[5]);

  })
})
