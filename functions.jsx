
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

axis(21);
axis(21);
grid(21);
