# Drawing Widget

This is a drawing widget built with HTML5 and Javascript. No external libraries are used
(e.g. JQuery) to reduce the weight and dependencies. The widget is designed to be embedded
into webpages with as little work as possible.

## Features
 - **Colors:** Click the spectrum sidebar to change color. Click and drag to see your color change in real time.
 - **Stroke Size:** Use your mouse wheel to change the size of the stroke.
 - **Save Image:** Click the save icon to open a .png of your drawing.
 - **Clear Canvas:** Click the new document icon to clear the canvas.

## API

To embed the widget, add the following lines in the body of your HTML file:

```html
  <div id="drawing-widget">
  <script async src="https://rawgit.com/jjjreisss/drawing-widget/master/widget.js"></script>
```

This will default to a 400px by 300px widget. In order to specify your own dimensions, change the code to:

```html
  <div id="drawing-widget" width=[your-width] height=[your-height]>
  <script async src="https://rawgit.com/jjjreisss/drawing-widget/master/widget.js"></script>
```

## History

This widget was inspired by my full-stack web application [StampLife](http://github.com/jjjreisss/StampLife).

## Demo

You can see the widget demo'd on my [portfolio](http://jjjreisss.github.io) page.
