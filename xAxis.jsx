
var start = -1000;
var end = 1000;
var spacingout = 100;
var count=-11;

var axisStroke = 2;
var dashLength = 28;
var currComp = app.project.activeItem;

function centerAnchorPoint(layer){
  var x = layer.sourceRectAtTime(comp.time,false).width/2 + textLayer.sourceRectAtTime(comp.time,false).left;
  var y = layer.sourceRectAtTime(comp.time,false).height/2 + textLayer.sourceRectAtTime(comp.time,false).top;
  layer.anchorPoint.setValue([x,y]);
}

function addStroke(shape,strokeWidthValue){
  var stroke = shape.content.addProperty("ADBE Vector Graphic - Stroke");
  var strokeWidth = stroke.property("ADBE Vector Stroke Width");
  strokeWidth.setValue(strokeWidthValue);
}


function createLine(x0, x1, strokeWidthValue){
   var shapeLayer = new Shape();
   shapeLayer.vertices=[[x0,0],[x1,0]];
   var line = currComp.layers.addShape();
   var path = line.content.addProperty("ADBE Vector Shape - Group");
   path.path.setValue(shapeLayer);
   addStroke(line,strokeWidthValue);
}

  function createDashes(x0,strokeWidthValue){
    var shapeLayer = new Shape();
    shapeLayer.vertices=[[x0,dashLength/2],[x0,-dashLength/2]];
    var line = currComp.layers.addShape();
    var path = line.content.addProperty("ADBE Vector Shape - Group");
    path.path.setValue(shapeLayer);
    addStroke(line,strokeWidthValue);
  }

 function createNumbers(x0,value){
    var textLayer = currComp.layers.addText(value);
    centerAnchorPoint(textLayer);
    textLayer.position.setValue([(currComp.width/2)+x0,540+40]);
  }

app.beginUndoGroup("Create Axis");
 createLine(start,end,axisStroke);

var length=start;

 while (length <= end){
  count++;
  createDashes(length,axisStroke);
  createNumbers(length,count);
  length= length+spacingout;
}
app.endUndoGroup();
