  //Plotting a function with a lot of vertices:
  function plotStandardFunction(functionText,xbasis,ybasis,start,end,stepSize){
    var shapeLayer = app.project.activeItem.layers.addShape();
    var path = shapeLayer.content.addProperty("ADBE Vector Shape - Group");
    var length = Math.floor((((end-start)*xbasis)/stepSize)+2);
    var approx = 10000;
    var vertices=[];
    var inTangents=[];
    var outTangents=[];
    var shape = new Shape();
    var generator = new Function("x","return "+functionText+";");

    for(var i =0;i<length;i++){
      x = ((stepSize * i) + start* xbasis);
      y = (-ybasis) * Math.round(approx*generator(((stepSize * i) + start* xbasis)/xbasis))/approx;
      vertices.push([x,y]);
      }

     shape.vertices=vertices;
     shape.inTangents = inTangents;
     shape.outTangents = outTangents;
     shape.closed=false;

     path.path.setValue(shape);
     addStroke(shapeLayer,5);
     shapeLayer.name = functionText;
     shapeLayer.comment = functionText;
     shapeLayer.effect.addProperty("xAxis");

     return shapeLayer;
  }




  //Plotting a function with less vertices:
  function plotFunction(functionText,functionDerivativeText,xbasis,ybasis,start,end,stepSize){
  var shapeLayer = app.project.activeItem.layers.addShape();
  var path = shapeLayer.content.addProperty("ADBE Vector Shape - Group");
  var length = Math.floor((((end-start)*xbasis)/stepSize)+2);
  var k = (100/stepSize) * 3;
  var approx = 10000;
  var vertices=[];
  var inTangents=[];
  var outTangents=[];
  var shape = new Shape();
  var generator = new Function("x","return "+functionText+";");
  var generatorDeriv = new Function("x","return "+functionDerivativeText+";");

  for(var i =0;i<length;i++){
    x = ((stepSize * i) + start* xbasis);
    y = (-ybasis) * Math.round(approx*generator(((stepSize * i) + start* xbasis)/xbasis))/approx;
    y0 = (ybasis/k) * Math.round(approx*generatorDeriv(((stepSize * i) + start* xbasis)/xbasis))/approx;
    vertices.push([x,y]);
    inTangents.push([-100/k,y0]);
    outTangents.push([100/k,-y0]);
    }

   shape.vertices=vertices;
   shape.inTangents = inTangents;
   shape.outTangents = outTangents;
   shape.closed=false;

   path.path.setValue(shape);
   addStroke(shapeLayer,5);
   shapeLayer.name = functionText;
   shapeLayer.comment = functionText;
   shapeLayer.effect.addProperty("xAxis");

   return shapeLayer;
 }

 //adding stroke to an existing shape layer:
 function addStroke(shape,strokeWidthValue){
     var stroke = shape.content.addProperty("ADBE Vector Graphic - Stroke");
     var strokeWidth = stroke.property("ADBE Vector Stroke Width");
     strokeWidth.setValue(strokeWidthValue);}

  //centering the anchor point of a layer:
  function centerAnchorPoint(layer){
    var comp = app.project.activeItem;
    var x = layer.sourceRectAtTime(comp.time,false).width/2 + layer.sourceRectAtTime(comp.time,false).left;
    var y = layer.sourceRectAtTime(comp.time,false).height/2 + layer.sourceRectAtTime(comp.time,false).top;
    layer.anchorPoint.setValue([x,y]);
  }

 //creating lines:
 function createLines(type,x0,x1,y0,y1,basis,strokeWidth){

   var boo = (type=="vertical")?true:false;

   if(boo){if(x0>=x1){alert("First value is always less!");}}
   else{if(y0>=y1){alert("First value is always less!");}}

   var count = 0;
   var shape = new Shape();
   var length = boo?Math.round(((x1-x0)/basis)+2):Math.round(((y1-y0)/basis)+2);
   var indicies = [];
   var currComp = app.project.activeItem;

   app.beginUndoGroup("Lines Creation");

   for(var i=0;i<length;i++){
   var vert = boo?x0+(basis*i):y0+(basis*i);
   shape.vertices=boo?[[vert,y0],[vert,y1]]:[[x0,vert],[x1,vert]];
   var shapeLayer = currComp.layers.addShape();
   var path = shapeLayer.content.addProperty("ADBE Vector Shape - Group");
   path.path.setValue(shape);
   addStroke(shapeLayer,strokeWidth);
   shapeLayer.name = i;
   indicies[indicies.length]=i+1;
   }
   app.endUndoGroup();

   var comp = app.project.activeItem.layers.precompose(indicies,type,true);
   currComp.layer(1).transform.opacity.setValue(10);
   return comp;
 }

 // function create a total grid:
  function createGrid(x0,x1,y0,y1,xbasis,ybasis,strokeWidth){
    createLines("vertical",x0,x1,y0,y1,xbasis,strokeWidth);
    createLines("horizontal",x0,x1,y0,y1,ybasis,strokeWidth);
  }

  // create a line:
  function createLine(type, x0, x1, strokeWidthValue){
     var shapeLayer = new Shape();
     if(type==0){shapeLayer.vertices = [[x0,0],[x1,0]]}
     else if(type==1){shapeLayer.vertices = [[0,x0],[0,x1]]}
     else{alert("Creampie responsibly!")}
     var line = app.project.activeItem.layers.addShape();
     var path = line.content.addProperty("ADBE Vector Shape - Group");
     path.path.setValue(shapeLayer);

     addStroke(line,strokeWidthValue);
     line.name = "line";

     return line;
  }

  function createShapeLayer(shapeObj,strokeWidth){
    var line = app.project.activeItem.layers.addShape();
    var path = line.content.addProperty("ADBE Vector Shape - Group");
    path.path.setValue(shapeObj);
    addStroke(line,strokeWidth);

    return line;
  }

  function createShapeObject(vertices,inTangents,outTangents,state){
    var shapeObj = new Shape();
    shapeObj.vertices=vertices;
    shapeObj.inTangents = inTangents;
    shapeObj.outTangents = outTangents;
    shapeObj.closed = state;

    return shapeObj;
  }


  function populateXAxis(x0,strokeWidthValue,textValue,dashLength){
    var comp = app.project.activeItem;
    //create dashes:
    var shapeObj = createShapeObject([[x0,dashLength/2],[x0,-dashLength/2]],[],[],false);
    createShapeLayer(shapeObj,strokeWidthValue);

    //create numbers:
    var textLayer = comp.layers.addText(textValue);
    textLayer.position.setValue([(comp.width/2)+x0,540+40]);
    centerAnchorPoint(textLayer);
  }


   //Create a shape and add a path directly:
   function createShapeLayerWithPath(strokeWidth){
    var line = app.project.activeItem.layers.addShape();
    var path = line.content.addProperty("ADBE Vector Shape - Group");
    addStroke(line,strokeWidth);

    return line;
  }


  function staticXAxis(start,end,spacingout,count,dashLength,strokeWidth){
    createLine(0,start,end,strokeWidth+2);

    var length = ((end-start)/spacingout)+2;
    var indicies = [];
    for(var i=0; i<length; i++){
      populateXAxis((start+(spacingout*i)),strokeWidth,count+i,dashLength);
      indicies[indicies.length]=(2*i)+1;
      indicies[indicies.length]=2*(i+1);
  }

    var compo = app.project.activeItem.layers.precompose(indicies,"xAxis",true);
    compo.name="xAxis";
  }

  function dynamicXAxis(numDashes){
    var comp = app.project.activeItem;
    var shape = new createShapeLayerWithPath(5);
    shape.name= "xLine";
    shape.effect.addProperty("xAxis");
    var path = shape.content.property("ADBE Vector Shape - Group");
    var axisExpression = "var x0 = effect(\"xAxis\")(\"Start\");\
      var x1 = effect(\"xAxis\")(\"End\");\
      createPath(points =[[x0,0], [x1,0]],\
        inTangents = [], outTangents = [], is_closed = false)";
      path.path.expression = axisExpression;

      for(var i=0;i<numDashes;i++){
      var dash = new createShapeLayerWithPath(3);
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


      var textLayer = comp.layers.addText();
      textLayer.sourceText.expression =
      "var num = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Count\")+"
      +i+"*thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Basis\");\
      Math.round(10*num)/10";
      textLayer.name = textLayer.sourceText.value;
      textLayer.transform.anchorPoint.expression="\
      var x = sourceRectAtTime(time,false).width/2 + sourceRectAtTime(time,false).left;\
      var y = sourceRectAtTime(time,false).height/2 + sourceRectAtTime(time,false).top;\
      [x,y]";
      dash.name = textLayer.sourceText.value;

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
      textLayer.transform.opacity.expression = opacityExpression;
  }
  }

  function dynamicYAxis(numDashes){
    var comp = app.project.activeItem;
    var shape = new createShapeLayerWithPath(5);
    shape.name= "yLine";
    shape.effect.addProperty("xAxis");
    var path = shape.content.property("ADBE Vector Shape - Group");
    var axisExpression = "var y0 =effect(\"xAxis\")(\"Start\");\
      var y1 = effect(\"xAxis\")(\"End\");\
      createPath(points =[[0,y0], [0,y1]],\
      inTangents = [], outTangents = [], is_closed = false)";
      path.path.expression = axisExpression;

      for(var i=0;i<numDashes;i++){
      var dash = new createShapeLayerWithPath(3);
      dash.effect.addProperty("Dashes");
      var path = dash.content.property("ADBE Vector Shape - Group");
      var dashPathExpression = "var y0 = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Start\");\
      var y1 =thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"End\");\
      var spacingout =thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Spacingout\");;\
      var factor = 30;\
      var dashLength0 = effect(\"Dashes\")(\"Dash length\");\
      var pos = y0+"+i+"*spacingout;\
      var dashLength = 0;\
      if(pos-y1<-20){dashLength = dashLength0;}\
      else{dashLength = dashLength0*Math.exp(-Math.pow(y1-pos,2)/(2*factor*factor));}\
      createPath(points =[[-dashLength/2,pos], [dashLength/2,pos]],\
      inTangents = [], outTangents = [], is_closed = false)";
      path.path.expression = dashPathExpression;

      var textLayer = comp.layers.addText();
      textLayer.sourceText.expression =
      "var num = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Count\")+"
      +(-1*i)+"*thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Basis\");\
      Math.round(10*num)/10";
      textLayer.name = textLayer.sourceText.value;
      textLayer.transform.anchorPoint.expression="\
      var x = sourceRectAtTime(time,false).width/2 + sourceRectAtTime(time,false).left;\
      var y = sourceRectAtTime(time,false).height/2 + sourceRectAtTime(time,false).top;\
      [x,y]";
      dash.name = textLayer.sourceText.value;

      var positionExpression = "\
      var y0 = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Start\");\
      var spacingout = thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"Spacingout\");;\
      var x = thisComp.layer(\""+shape.name+"\").transform.position[0]-45;\
      var y = (thisComp.height/2)+"+i+"*spacingout+y0;\
      [x,y]";
      textLayer.transform.position.expression = positionExpression;

      var opacityExpression = "\
      var end0 =thisComp.layer(\""+shape.name+"\").effect(\"xAxis\")(\"End\");\
      var pos = transform.position[1]-thisComp.height/2;\
      if(pos-end0 <-10){100}\
      else{100*Math.exp(-Math.pow(end0-pos,2)/(2*30*30))}\
      ";
      textLayer.transform.opacity.expression = opacityExpression;
  }
  }

 function createCircle(radius){
   var stretch = radius/1.81066;
   var shape = new Shape();
   shape.vertices = [[-radius,0],[0,radius],[radius,0],[0,-radius]];
   shape.inTangents = [[0,-stretch],[-stretch,0],[0,stretch],[stretch,0]];
   shape.outTangents = [[0,stretch],[stretch,0],[0,-stretch],[-stretch,0]];
   shape.closed = true;
   var layer = new createShapeLayerWithPath(8);
   var path0 = layer.content.property("ADBE Vector Shape - Group");
   path0.path.setValue(shape);
   layer.name = "circle";
   layer.comment = radius;

   return layer;
 }

 function setPathValue(layer,shape){
   var path0 = layer.content.property("ADBE Vector Shape - Group");
   var path = path0.path;
   path.setValue(shape);
 }

 function createLineWithTwoPoints(type,x0,x1){
   var shapeLayer = new Shape();
   if(type==0){shapeLayer.vertices = [[x0,0],[x1,0]]}
   else if(type==1){shapeLayer.vertices = [[0,x0],[0,x1]]}
   else{alert("Creampie responsibly!")}
   var line = app.project.activeItem.layers.addShape();
   var path = line.content.addProperty("ADBE Vector Shape - Group");
   path.path.setValue(shapeLayer);

   addStroke(line,2);
   line.name = "line";

   return line;
 }

function createPointAlongFunction(){
   var circle = new createCircle(10);
   circle.effect.addProperty("Function Point");
   var positionExpression = "var x = 960+thisLayer.position[0];\n"+
   "var functiona = thisLayer.effect(\"Function Point\")(\"FunctionLayer\");\n"+
   "var gen = new Function(\"x\",\"return\"+functiona.name+\";\");\n"
   +"var xbasis = thisLayer.effect(\"Function Point\")(\"xbasis\");\n"
   +"var ybasis = thisLayer.effect(\"Function Point\")(\"ybasis\");\n"
   +"[x,-100*gen((x-960)/100)+540]";
  circle.transform.position.expression = positionExpression;
}
