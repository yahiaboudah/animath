
function getAxisName(){
  var comp = app.project.activeItem;
  var counter = 1;
  var name = "Axis ";
  for(var i=1;i<comp.layers.length+1;i++){
    if(comp.layer(1).name.indexOf("Axis") != -1){
      counter += 1;
    }
  }
  name = name+counter;
  return name;
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
  +"var dashLength = effect(\"Axis\")(\"dashLength\");\n"
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

function Axis(numDashes){

  var comp = app.project.activeItem;
  var mainAxisShape = comp.layers.addShape();

  var axisType = prompt("Enter the type of the Axis: x,y","x");
  mainAxisShape.name = getAxisName();
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
}

Axis(21);
