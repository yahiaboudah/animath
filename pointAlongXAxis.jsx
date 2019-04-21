var comp = app.project.activeItem;
var t = comp.time;
var size = [15,15];

function point(comp,size){
 var ellipseShape = comp.layers.addShape();
 var ellipse = ellipseShape.content.addProperty("ADBE Vector Shape - Ellipse");
 ellipse.property("ADBE Vector Ellipse Size").setValue(size);
 ellipseShape.content.addProperty("ADBE Vector Graphic - Fill");
 return ellipseShape;
}
function xAnimate(point,t,pos){
  point.position.setValueAtTime(t,[pos,540]);
}
function yAnimateRelToX(ypoint,xpoint){
  ypoint.transform.position.expression = "\
  var xPosition = thisComp.layer(\""+xpoint.name+"\").transform.position[0];\
  var yPosition = (-100*(Math.round(10000*Math.cos(((xPosition-960)/100))))/10000) +540;\
  [960,yPosition]";
}
function lineAnimateRelToX(xpoint){
  var line = comp.layers.addShape();
  line.name = "verticalLine";
  var path = line.content.addProperty("ADBE Vector Shape - Group");
  path.path.expression = "\
  var xPosition = thisComp.layer(\""+xpoint.name+"\").transform.position[0]-960;\
  var yPosition = (-100*(Math.round(10000*Math.cos(((xPosition)/100))))/10000);\
  createPath(points =[[xPosition,0],[xPosition,yPosition]],\
    inTangents = [], outTangents = [], is_closed = false)";
  addStroke(line,5);
}

 function lineAnimateRelToY(xpoint,ypoint){
   var line = comp.layers.addShape();
   line.name = "horizontalLine";
   var path = line.content.addProperty("ADBE Vector Shape - Group");
   path.path.expression = "\
   var xPosition = thisComp.layer(\""+xpoint.name+"\").transform.position[0]-960;\
   var yPosition = thisComp.layer(\""+ypoint.name+"\").transform.position[1]-540;\
   createPath(points =[[0,yPosition],[xPosition,yPosition]],\
     inTangents = [], outTangents = [], is_closed = false)";
   addStroke(line,5);
 }

function addStroke(shape,strokeWidthValue){
  var stroke = shape.content.addProperty("ADBE Vector Graphic - Stroke");
  var strokeWidth = stroke.property("ADBE Vector Stroke Width");
  strokeWidth.setValue(strokeWidthValue);}

var xPoint = point(comp,size);
xPoint.name = "xPoint";
var yPoint = point(comp,size);
yPoint.name = "yPoint";

// animate x point
xAnimate(xPoint,0,0);
xAnimate(xPoint,8,1920);
//animate y point
yAnimateRelToX(yPoint,xPoint);

//animate connecting lines
lineAnimateRelToX(xPoint);
lineAnimateRelToY(xPoint,yPoint);

var functionPoint = point(comp,size);
functionPoint.name = "functionPoint";
functionPointExpression="\
var xPosition = thisComp.layer(\""+xPoint.name+"\").transform.position[0];\
var yPosition = thisComp.layer(\""+yPoint.name+"\").transform.position[1];\
[xPosition,yPosition]";

functionPoint.transform.position.expression=functionPointExpression;
