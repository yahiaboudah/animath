
var start = 600;
var end = -600;
var axisStroke = 2;
var dashLength = 28;
var currComp = app.project.activeItem;

function centerAnchorPoint(textLayer){
  var x = textLayer.sourceRectAtTime(comp.time,false).width/2 + textLayer.sourceRectAtTime(comp.time,false).left;
  var y = textLayer.sourceRectAtTime(comp.time,false).height/2 + textLayer.sourceRectAtTime(comp.time,false).top;
  textLayer.anchorPoint.setValue([x,y]);
}

function addStroke(shape,strokeWidthValue){
  var stroke = shape.content.addProperty("ADBE Vector Graphic - Stroke");
  var strokeWidth = stroke.property("ADBE Vector Stroke Width");
  strokeWidth.setValue(strokeWidthValue);
}


function createLine(y0, y1, strokeWidthValue){
   var shapeLayer = new Shape();
   shapeLayer.vertices=[[0,y0],[0,y1]];
   var line = currComp.layers.addShape();
   var path = line.content.addProperty("ADBE Vector Shape - Group");
   path.path.setValue(shapeLayer);
   addStroke(line,strokeWidthValue);
}

  function createDashes(y0,strokeWidthValue){
    var shapeLayer = new Shape();
    shapeLayer.vertices=[[dashLength/2,y0],[-dashLength/2,y0]];
    var line = currComp.layers.addShape();
    var path = line.content.addProperty("ADBE Vector Shape - Group");
    path.path.setValue(shapeLayer);
    addStroke(line,strokeWidthValue);
  }

 function createNumbers(y0,value){
    var textLayer = currComp.layers.addText(value);
    centerAnchorPoint(textLayer);
    textLayer.position.setValue([960-40,(currComp.height/2)+y0]);
  }

app.beginUndoGroup("Create Axis");
 createLine(start,end,axisStroke);

var length=start;
var count=-7;
 while (length >= end){
  count++;
  createDashes(length,axisStroke);
  createNumbers(length,count);
  length= length-100;
}
app.endUndoGroup();
