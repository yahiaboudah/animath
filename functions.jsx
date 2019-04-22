
function getNewAxisName(){
  var comp = app.project.activeItem;
  var counter = 1;
  var name = "Axis ";
  for(var i=1;i<comp.layers.length+1;i++){
    if(comp.layer(i).name.indexOf("Axis") != -1){
      counter++;
    }
  }
  name = name+counter;
  return name;
}

function getAxisName(axis){
  var comp = app.project.activeItem;
  for(var i=1;i<comp.layers.length+1;i++){
    if(comp.layer(i).comment == axis){
      return comp.layer(i).name;
    }
  }
}

function dashCreator(mainShape,dashName){
  var dashPos = parseInt(dashName.split(" ")[1]);
  var dash = mainShape.property("Contents").addProperty("ADBE Vector Group");
  dash.name = dashName;
  // Add path:
  mainShape.property("Contents").property(dash.name).property("Contents").addProperty("ADBE Vector Shape - Group");
  // Add stroke:
  mainShape.property("Contents").property(dash.name).property("Contents").addProperty("ADBE Vector Graphic - Stroke");
  // Dash Path Expression:
  var dashPathExpression = "var dashSpacing = thisComp.layer(\""+mainShape.name+"\").effect(\"Axis\")(\"dashSpacing\");\n"
  +"var dashLength = thisComp.layer(\""+mainShape.name+"\").effect(\"Axis\")(\"dashLength\");\n"
  +"var pos = "+dashPos+"*dashSpacing;\n"
  +"createPath(points =[[pos,-dashLength/2], [pos,dashLength/2]],\n"
  +"inTangents = [], outTangents = [], is_closed = false)";

  // Dash Opacity expression:
  var dashOpacityExpression = "var numDashes = ((thisComp.layer(\""+mainShape.name+"\").effect(\"Axis\")(\"numDashes\")-1)/2);\n"
  +"var currDash = "+dashPos+";\n"
  +"if((currDash<=numDashes) && (currDash>=-numDashes)){100;}"
  +"else{0;}";

  // Set opacity expression:
  var opacityProp = mainShape.property("Contents").property(dashName).property("Transform").property("Opacity");
  opacityProp.expression = dashOpacityExpression;
  // Set expression:
  mainShape.property("Contents").property(dashName).property("Contents").property("Path 1").property("Path").expression = dashPathExpression;
  // Set strokeWidth value:
  mainShape.property("Contents").property(dashName).property("Contents").property("Stroke 1").property("Stroke Width").setValue(2.5);
}

function dashCreator2(mainShape,dashName,xAxisName,yAxisName){

  var dashPos = parseInt(dashName.split(" ")[1]);
  var dash = mainShape.property("Contents").addProperty("ADBE Vector Group");
  dash.name = dashName;
  // Add path:
  mainShape.property("Contents").property(dash.name).property("Contents").addProperty("ADBE Vector Shape - Group");
  // Add stroke:
  mainShape.property("Contents").property(dash.name).property("Contents").addProperty("ADBE Vector Graphic - Stroke");
  // Dash Path Expression:

  var dashPathExpression = "var xDashSpacing = thisComp.layer(\""+xAxisName+"\").effect(\"Axis\")(\"dashSpacing\");\n"
  +"var yDashSpacing = thisComp.layer(\""+yAxisName+"\").effect(\"Axis\")(\"dashSpacing\");\n"
  +"var yAxisNumDashes = thisComp.layer(\""+yAxisName+"\").effect(\"Axis\")(\"numDashes\");\n"
  +"var dashLength = ((yAxisNumDashes-1)/2)*yDashSpacing;\n"
  +"var pos = "+dashPos+"*xDashSpacing;\n"
  +"createPath(points =[[pos,-dashLength], [pos,dashLength]],\n"
  +"inTangents = [], outTangents = [], is_closed = false)";

  // Dash Opacity expression:
  var dashOpacityExpression = "var numDashes = ((thisComp.layer(\""+xAxisName+"\").effect(\"Axis\")(\"numDashes\")-1)/2);\n"
  +"var currDash = "+dashPos+";\n"
  +"if((currDash<=numDashes) && (currDash>=-numDashes)){100;}"
  +"else{0;}";

  // Set opacity expression:
  var opacityProp = mainShape.property("Contents").property(dashName).property("Transform").property("Opacity");
  opacityProp.expression = dashOpacityExpression;
  // Set expression:
  mainShape.property("Contents").property(dashName).property("Contents").property("Path 1").property("Path").expression = dashPathExpression;
  // Set strokeWidth value:
  mainShape.property("Contents").property(dashName).property("Contents").property("Stroke 1").property("Stroke Width").setValue(2.5);
}

function axis(numDashes){

  var comp = app.project.activeItem;
  var mainAxisShape = comp.layers.addShape();

  var axisType = prompt("Enter the type of the Axis: x,y","x");
  mainAxisShape.name = getNewAxisName();
  mainAxisShape.comment = axisType;
  // Add the Axis property:
  var axisProp = mainAxisShape.property("Effects").addProperty("Axis");

  // Add the main axis Line:
  var mainLineGroup = mainAxisShape.content.addProperty("ADBE Vector Group");
  mainLineGroup.name = "line";
  // add a path prop:
  mainAxisShape.property("Contents").property(mainLineGroup.name).property("Contents").addProperty("ADBE Vector Shape - Group");
  var mainLineExpression = "var numDashes = thisLayer.effect(\"Axis\")(\"numDashes\");\n"
    +"var dashSpacing = thisLayer.effect(\"Axis\")(\"dashSpacing\");\n"
    +"var start = - ((numDashes-1)/2) * dashSpacing;\n"
    +"var end = ((numDashes-1)/2) * dashSpacing;\n"
    +"createPath(points =[[start,0], [end,0]],\n"
    +"inTangents = [], outTangents = [], is_closed = false)";
  // Set the expression:
  mainAxisShape.property("Contents").property(mainLineGroup.name).property("Contents").property("Path 1").property("Path").expression = mainLineExpression;
  // add a stroke prop:
  var mainLineStroke = mainAxisShape.property("Contents").property(mainLineGroup.name).property("Contents").addProperty("ADBE Vector Graphic - Stroke");
  mainLineStroke.property("ADBE Vector Stroke Width").setValue(2.5);


  // Create all the dashes:
  var oneSideDashes = ((numDashes-1)/2)
  for(var i=-oneSideDashes;i<=oneSideDashes;i++){
    var name = "Dash "+i;
    dashCreator(mainAxisShape,name);
  }
  if(axisType == 'y'){
    mainAxisShape.transform.rotation.setValue(90);
}
}

function grid(numDashes){
  var comp = app.project.activeItem;
  var mainGridShape = comp.layers.addShape();
  mainGridShape.name = "Vertical Grid";
  var secondGridShape = comp.layers.addShape();
  secondGridShape.name = "Horizontal Grid";
  var oneSideDashes = (numDashes-1)/2;
  var xAxisName = getAxisName('x');
  var yAxisName = getAxisName('y');
  if(xAxisName == null || yAxisName == null){
    alert("Please create an X and Y Axes");
  }else{
    for(var i=-oneSideDashes;i<=oneSideDashes;i++){
      var name = "Dash "+i;
      dashCreator2(mainGridShape,name,xAxisName,yAxisName);
      dashCreator2(secondGridShape,name,yAxisName,xAxisName);
    }
  }
}

function Point(radius){
   radius = (typeof radius !== 'undefined')?radius:8;
   this.radius = radius;
   var stretch = radius/1.81066;
   var shape = new Shape();
   shape.vertices = [[-radius,0],[0,radius],[radius,0],[0,-radius]];
   shape.inTangents = [[0,-stretch],[-stretch,0],[0,stretch],[stretch,0]];
   shape.outTangents = [[0,stretch],[stretch,0],[0,-stretch],[-stretch,0]];
   shape.closed = true;
   var layer = app.project.activeItem.layers.addShape();
   var commentPrompt = prompt("Enter the comment: ","xpoint");
   layer.comment = commentPrompt;
   var path = layer.content.addProperty("ADBE Vector Shape - Group");
   var path0 = layer.content.property("ADBE Vector Shape - Group");
   path0.path.setValue(shape);
   layer.content.addProperty("ADBE Vector Graphic - Fill");
   var currComp = app.project.activeItem;
   layer.name = "circle "+currComp.layers.length;
   return layer;
}

function getLayerWithComment(comment){
  var comp = app.project.activeItem;
  for(var i=1;i<comp.layers.length+1;i++){
    if(comp.layer(i).comment == comment){
      return comp.layer(i);
    }
  }
}

function yPoint(){
  var functionLayer = app.project.activeItem.selectedLayers[0];
  var p = Point(12);
  var xpoint = getLayerWithComment('xpoint');
  var xline = getLayerWithComment('x');
  var yline = getLayerWithComment('y');

  var dashSpacing = xline.property("Effects").property("Axis").property("dashSpacing").value;
  var oneEvery = xline.property("Effects").property("Axis").property("oneEveryNDashes").value;
  var xbasis = dashSpacing * oneEvery;

  var dashSpacing = yline.property("Effects").property("Axis").property("dashSpacing").value;
  var oneEvery = yline.property("Effects").property("Axis").property("oneEveryNDashes").value;
  var ybasis = dashSpacing * oneEvery;

  p.transform.position.expression = "function theFunction(x){\n"
  +"    return "+functionLayer.name+";\n"
  +"}"
  +"var xbasis = "+xbasis+";\n"
  +"var ybasis = "+ybasis+";\n"
  +"var x = thisLayer.transform.position[0];\n"
  +"var otherX = (thisComp.layer(\""+xpoint.name+"\").transform.position[0]-960)/xbasis;\n"
  +"var y = 540 - theFunction(otherX)*ybasis;\n"
  +"[x,y];";
}

function functionPoint(){
  var p = Point(12);
  var xpoint = getLayerWithComment("xpoint");
  var ypoint = getLayerWithComment("ypoint");
  var positionExpression = "var x = thisComp.layer(\""+xpoint.name+"\").transform.position[0];\n"
  +"var y = thisComp.layer(\""+ypoint.name+"\").transform.position[1];\n"
  +"[x,y];";
  p.transform.position.expression = positionExpression;
}

function createLine(){
  var line = app.project.activeItem.layers.addShape();
  var path = line.content.addProperty("ADBE Vector Shape - Group");
  line.property("Effects").addProperty("Slider Control");
  path.path.expression = "var stretch = effect(\"Slider Control\")(\"Slider\")\n"
  +"createPath(points = [[-stretch,0], [stretch,0]], inTangents = [], outTangents = [], is_closed = true)";
  var stroke = line.content.addProperty("ADBE Vector Graphic - Stroke");
  line.name = "line";
  return line;
}

function centerAnchorPoint(layer){
   var comp = app.project.activeItem;
   var x = layer.sourceRectAtTime(comp.time,false).width/2 + layer.sourceRectAtTime(comp.time,false).left;
   var y = layer.sourceRectAtTime(comp.time,false).height/2 + layer.sourceRectAtTime(comp.time,false).top;
   layer.transform.anchorPoint.setValue([x,y]);
}

function slope(){
  var slope = createLine();
  centerAnchorPoint(slope);
  slope.effect.addProperty("Function Point");

  var positionExpression = "var x = thisLayer.position[0]+960;\n"
  +"var chosenFunction = thisLayer.effect(\"Function Point\")(\"FunctionLayer\");\n"
  +"var fx = new Function(\"x\",\"return \"+chosenFunction.name+\";\");\n"
  +"var xbasis = thisLayer.effect(\"Function Point\")(\"xbasis\");\n"
  +"var ybasis = thisLayer.effect(\"Function Point\")(\"ybasis\");\n"
  +"[x,-ybasis*fx((x-960)/xbasis)+540]";

  var rotationExpression = "var h = 0.00001;\n"
  +"var xposition = thisLayer.position[0];\n"
  +"var chosenFunction = thisLayer.effect(\"Function Point\")(\"FunctionLayer\");\n"
  +"var xbasis = thisLayer.effect(\"Function Point\")(\"xbasis\");\n"
  +"var yabsis = thisLayer.effect(\"Function Point\")(\"ybasis\");\n"
  +"var fx = new Function(\"x\",\"return \"+chosenFunction.name+\";\");\n"
  +"var rot = -radiansToDegrees(Math.atan(((fx(((xposition-960)/xbasis)+h)-fx((xposition-960)/xbasis)))/h));\n"
  +"rot"

  slope.transform.position.expression = positionExpression;
  slope.transform.rotation.expression = rotationExpression;
}

function extensibleDynamicLine(){

  var shape = app.project.activeItem.layers.addShape();
  shape.property("Effects").addProperty("Slider Control");
  var path = shape.content.addProperty("ADBE Vector Shape - Group");
  shape.content.addProperty('ADBE Vector Graphic - Stroke');
  var path0 = shape.content.property("ADBE Vector Shape - Group");
  var pathEx = "";
  var argName = ["x0","y0","x1","y1"];
  for(var i=0; i<arguments.length;i++){
    if(arguments[i] instanceof Array){
      pathEx += "var "+argName[i]+" = thisComp.layer(\""+arguments[i][0].name+"\").transform.position["+arguments[i][1]+"]-(("+arguments[i][1]+"==0)?960:540);\n";
      pathEx += ""+argName[i]+" -= thisComp.layer(\""+arguments[i][0].name+"\").transform.anchorPoint["+arguments[i][1]+"];";
    }else{
      pathEx += "var "+argName[i]+"="+arguments[i]+";\n";
    }
}

  var pathExpression = pathEx
  +"function getSign(){\n"
  +"    if(x1-x0 > 0){\n"
  +"        return -1;\n"
  +"    }else{\n"
  +"        return 1;\n"
  +"  }\n"
  +"}\n"
  +"var s = (y1-y0)/(x1-x0);\n"
  +"var a = effect(\"Slider Control\")(\"Slider\");\n"
  +"var xadd = getSign()*a/Math.sqrt(1+s*s);\n"
  +"var yadd = s*xadd;\n"
  +"createPath(points = [[x0+xadd,y0+yadd],[x1-xadd,y1-yadd]],\n"
  +"inTangents = [], outTangents = [], is_closed = true)";

  path0.path.expression = pathExpression;

  return shape;
}

function lineWithTwoPoints(){
  var selLayers = app.project.activeItem.selectedLayers;
  if(selLayers.length != 2){
    alert("Select two layers, please.");
  }else{
  var firstPoint = selLayers[0];
  var secondPoint = selLayers[1];
  extensibleDynamicLine([firstPoint,0],[firstPoint,1],[secondPoint,0],[secondPoint,1]);
}
}

lineWithTwoPoints();
