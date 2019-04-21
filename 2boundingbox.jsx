
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function fixString(namo){
  var finalName = namo;
  finalName = finalName.replaceAll("\\","\\\\");
  finalName = finalName.replaceAll("\"","\\\"");
  finalName = finalName.replaceAll("\'","\\\'");
  finalName = finalName.replaceAll("\&","\\&");
  finalName = finalName.replaceAll("\n","\\n");
  finalName = finalName.replaceAll("\r","\\r");
  finalName = finalName.replaceAll("\t","\\t");
  finalName = finalName.replaceAll("\b","\\b");
  finalName = finalName.replaceAll("\f","\\f");
  return finalName;
}

function getBoxExpression(layer){
  var finalName = fixString(layer.name);
  var boundingBoxExpression = "var src = thisComp.layer(\""+finalName+"\").sourceRectAtTime();\n"
  +"var getScale = thisComp.layer(\""+finalName+"\").transform.scale;\n"
  +"var sx = getScale[0]/100 - 1;\n"
  +"var sy = getScale[1]/100 - 1;\n"
  +"var padding = thisComp.layer(\""+finalName+"\").effect(\"BoundingBox\")(\"Padding\");\n"
  +"var p1 = [(src.left)-padding-sx*src.width,src.top-padding-sy*src.height];\n"
  +"var p2 = [(src.left+src.width)+padding+sx*src.width,(src.top)-padding-sy*src.height];\n"
  +"var p3 = [(src.left+src.width)+padding+sx*src.width,(src.top+src.height)+padding+sy*src.height];\n"
  +"var p4 = [(src.left)-padding-sx*src.width,(src.top+src.height)+padding+sy*src.height];\n"
  +"createPath(points =\n"
  +"[p1, p2, p3, p4],\n"
  +"inTangents = [], outTangents = [],\n"
  +"is_closed = true)"
  return boundingBoxExpression;
}

function getBoundedLayer(){
  var layers = app.project.activeItem.selectedLayers;
  if(layers.length == 1){
    return layers[0];
  }
  alert("Select a single layer to bound.");
}

function createShapePath(){
 var line = app.project.activeItem.layers.addShape();
 var path = line.content.addProperty("ADBE Vector Shape - Group");
 return line;
}

function doEverything(){

    app.beginUndoGroup("Create BBox");

    var comp = app.project.activeItem;
    comp.hideShyLayers = true;
    // Get layer and add BB pseudo-effect:
    var layer = getBoundedLayer();
    layername = fixString(layer.name);
    var bb = layer.property("Effects").addProperty("BoundingBox");

    // Box layer stuff
    var boxLayer = createShapePath();
    boxLayer.moveAfter(layer);
    boxLayer.shy = true;
    boxLayer.name = layer.name + " BBox";
    boxLayer.transform.position.expression = "thisComp.layer(\""+layername+"\").position";
    //boxLayer.transform.rotation.expression = "thisComp.layer(\""+layername+"\").rotation";
    boxLayer.transform.anchorPoint.expression = "thisComp.layer(\""+layername+"\").anchorPoint";
    //boxLayer.transform.scale.expression = "thisComp.layer(\""+layername+"\").scale";
    // Path:
    var path0 = boxLayer.content.property("ADBE Vector Shape - Group");
    path0.path.expression = getBoxExpression(layer);
    // Stroke fill trim:
    boxLayer.content.addProperty("ADBE Vector Graphic - Stroke");
    boxLayer.content.addProperty("ADBE Vector Graphic - Fill");
    boxLayer.content.addProperty("ADBE Vector Filter - Trim");

    // Modify box layer:
    // Stroke:
    var boxStrokeWidth = boxLayer.property("ADBE Root Vectors Group").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width");
    boxStrokeWidth.expression = "thisComp.layer(\""+layername+"\").effect(\"BoundingBox\")(\"Stroke Width\")";
    var boxStrokeOpacity = boxLayer.property("ADBE Root Vectors Group").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Opacity");
    boxStrokeOpacity.expression = "thisComp.layer(\""+layername+"\").effect(\"BoundingBox\")(\"Stroke Opacity\")"
    var boxStrokeColor = boxLayer.property("ADBE Root Vectors Group").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Color");
    boxStrokeColor.expression = "thisComp.layer(\""+layername+"\").effect(\"BoundingBox\")(\"Stroke Color\")"

    // Fill:
    var boxFillColor = boxLayer.property("ADBE Root Vectors Group").property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color");
    boxFillColor.expression = "thisComp.layer(\""+layername+"\").effect(\"BoundingBox\")(\"Fill Color\")";
    var boxFillOpacity = boxLayer.property("ADBE Root Vectors Group").property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Opacity");
    boxFillOpacity.expression = "thisComp.layer(\""+layername+"\").effect(\"BoundingBox\")(\"Fill Opacity\")";

    //trimPaths:
    var trimEnd = boxLayer.property("ADBE Root Vectors Group").property("ADBE Vector Filter - Trim").property("ADBE Vector Trim End");
    trimEnd.expression = "thisComp.layer(\""+layername+"\").effect(\"BoundingBox\")(\"TracePath\")";
    boxLayer.locked = true;
    app.endUndoGroup();
}

doEverything();
