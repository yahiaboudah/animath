function xAxis(numDashes){
  var comp = app.project.activeItem;
  var shape = new createShapeLayerWithPath(5);
  shape.name= "xLine";
  shape.effect.addProperty("xAxis");
  var path = shape.content.property("ADBE Vector Shape - Group");
  var axisExpression = "var x0 =effect(\"xAxis\")(\"Start\");\
    var x1 = effect(\"xAxis\")(\"End\");\
    createPath(points =[[x0,0], [x1,0]],\
    inTangents = [], outTangents = [], is_closed = false)";
    path.path.expression = axisExpression;

    for(var i=0;i<numDashes;i++){
    var dash = new createShapeLayerWithPath(3);
    dash.name = count;
    dash.effect.addProperty("Dashes");
    var path = dash.content.property("ADBE Vector Shape - Group");
    var dashPathExpression = "var x0 = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Start\");\
    var end0 =thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"End\");\
    var spacingout =thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Spacingout\");;\
    var factor = 30;\
    var dashLength0 = effect(\"Dashes\")(\"Dash length\");\
    var pos = x0+"+i+"*spacingout;\
    var dashLength = 0;\
    if(pos-end0<-20){dashLength = dashLength0;}\
    else{dashLength = dashLength0*Math.exp(-Math.pow(end0-pos,2)/(2*factor*factor));}\
    createPath(points =[[pos,-dashLength/2], [pos,dashLength/2]],\
    inTangents = [], outTangents = [], is_closed = false)";
    path.path.expression = dashPathExpression;

    if(count !== 0){
    var textLayer = comp.layers.addText();
    textLayer.sourceText.expression = "thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Count\");"
    textLayer.name = textLayer.sourceText.value;
    centerAnchorPoint(textLayer);
    var positionExpression = "\
    var x0 = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Start\");\
    var spacingout = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Spacingout\");;\
    var x = (thisComp.width/2)+"+i+"*spacingout+x0;\
    var y = thisComp.layer(\""+shape.name+"\").transform.position[1]+40;\
    [x,y]";
    textLayer.transform.position.expression = positionExpression;

    var opacityExpression = "\
    var end0 =thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"End\");\
    var pos = transform.position[0]-thisComp.width/2;\
    if(pos-end0 <-10){100}\
    else{100*Math.exp(-Math.pow(end0-pos,2)/(2*30*30))}\
    ";
    textLayer.transform.opacity.expression = opacityExpression;}
    count++;
}
}

function centerAnchorPoint(layer){
  var comp = app.project.activeItem;
  var x = layer.sourceRectAtTime(comp.time,false).width/2 + layer.sourceRectAtTime(comp.time,false).left;
  var y = layer.sourceRectAtTime(comp.time,false).height/2 + layer.sourceRectAtTime(comp.time,false).top;
  layer.anchorPoint.setValue([x,y]);
}


function createShapeLayerWithPath(strokeWidth){
  var line = app.project.activeItem.layers.addShape();
  var path = line.content.addProperty("ADBE Vector Shape - Group");
  addStroke(line,strokeWidth);

  return line;
}

function addStroke(shape,strokeWidthValue){
    var stroke = shape.content.addProperty("ADBE Vector Graphic - Stroke");
    var strokeWidth = stroke.property("ADBE Vector Stroke Width");
    strokeWidth.setValue(strokeWidthValue);}


xAxis(12,150,-5);
