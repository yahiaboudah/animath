  var currComp = app.project.activeItem;
  // var currTime = currComp.time;
  //Plotting a function with a lot of vertices:

  function PlotStandardFunction(functionText,xbasis,ybasis,start,end,stepSize){
    this.xbasis = xbasis;
    this.ybasis = ybasis;
    this.functionText = functionText;
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

      this.functionShape = shapeLayer;
  }

  //Plotting a function with less vertices:
  function Plot(functionText,functionDerivativeText,xbasis,ybasis,start,end,stepSize){
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

Plot.prototype = {
draw: function(interval){
var functionShape = this.functionShape;
var currComp = app.project.activeItem;
var trim = functionShape.content.addProperty("ADBE Vector Filter - Trim");
trim.property("ADBE Vector Trim End").setValueAtTime(currComp.time,0);
trim.property("ADBE Vector Trim End").setValueAtTime(currComp.time+interval,100);
},

transitionTo: function(newFunction,interval){
  if( !(newFunction instanceof ShapeLayer) ){
    alert("Please pass a shape layer as a parameter");
  }

  var newPath0 = newFunction.content.property("ADBE Vector Shape - Group");
  var newPath = newPath0.path;
  var functionShape = this.functionShape;
  var currPath0 = functionShape.content.property("ADBE Vector Shape - Group");
  var currPath = currPath0.path;
  var currComp = app.project.activeItem;
  currPath.setValueAtTime(currComp.time, currPath.value);
  currPath.setValueAtTime(currComp.time+interval,newPath.value);
}
}

function draw(interval){

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
   var layer = new createShapeLayerWithPath(0);
   var path0 = layer.content.property("ADBE Vector Shape - Group");
   path0.path.setValue(shape);
   addFill(layer);
   var currComp = app.project.activeItem;
   layer.name = "circle"+currComp.layers.length;
   layer.comment = radius;
   this.layer = layer;
   this.name = layer.name;
}
// I dont understand why is the Point prototype undefined:
/*
 Point.prototype = {
   attachToFunction: function(passedFunction){
     var positionExpression =
     "var x = thisLayer.position[0]+960;\n"
     +"var fx = new Function(\"x\",\"return "+passedFunction.functionText+";\");\n"
     +"var xbasis ="+passedFunction.xbasis+" ;\n"
     +"var ybasis ="+passedFunction.ybasis+";\n"
     +"[x,-ybasis*fx((x-960)/xbasis)+540]";
     this.layer.transform.position.expression = positionExpression;
   },
   attachToHand: function(hand){
   var positionExpression = "thisComp.layer(\""+hand.layer.name+"\").transform.position";
   this.layer.transform.position.expression = positionExpression;
   }
}
*/

function show(timeInterval){
   var currentComp = app.project.activeItem;
   var layers = currentComp.selectedLayers;
   var layer = layers[0];
   var currTime = currentComp.time;
   layer.transform.opacity.setValueAtTime(currTime,0);
   layer.transform.opacity.setValueAtTime(currTime+timeInterval,100);
}

 function hide(timeInterval){
   var currentComp = app.project.activeItem;
   var layers = currentComp.selectedLayers;
   var layer = layers[0];
   var currTime = currentComp.time;
   layer.transform.opacity.setValueAtTime(currTime,100);
   layer.transform.opacity.setValueAtTime(currTime+timeInterval,0);
 }

 function draw(layer,interval,d){
 var currComp = app.project.activeItem;
 var trim = layer.content.addProperty("ADBE Vector Filter - Trim");
 trim.property("ADBE Vector Trim Start").setValue((d==1)?0:100);
 trim.property("ADBE Vector Trim End").setValueAtTime(currComp.time,(d==1)?0:100);
 trim.property("ADBE Vector Trim End").setValueAtTime(currComp.time+interval,(d==1)?100:0);
 }

 function DynamicLine(x0,y0,x1,y1){
   var shape = new createShapeLayerWithPath(2,true);
   this.layer = shape;
   var path0 = shape.content.property("ADBE Vector Shape - Group");
   var pathEx = "";
   var argName = ["x0","y0","x1","y1"];
   for(var i=0; i<arguments.length;i++){
     if(arguments[i] instanceof Array){
       pathEx += "var "+argName[i]+" = thisComp.layer(\""+arguments[i][0].name+"\").transform.position["+arguments[i][1]+"]-(("+arguments[i][1]+"==0)?960:540);\n";
       pathEx += "var anch"+argName[i]+" = thisComp.layer(\""+arguments[i][0].name+"\").transform.anchorPoint["+arguments[i][1]+"];";
     }else{
       pathEx += "var "+argName[i]+"="+arguments[i]+";\n";
       pathEx += "var anch"+argName[i]+" = 0;";
     }
   }

   var pathExpression = pathEx
   +"createPath(points = [[x0-anchx0,y0-anchy0],[x1-anchx1,y1-anchy1]],\n"
   +"inTangents = [], outTangents = [], is_closed = true)";

   path0.path.expression = pathExpression;

   return this.layer;
 }

function attachXPosition(attached,attachedOn){
  var positionExpression = "[thisComp.layer("+attachedOn.name+").transform.position[0],thisLayer.position[1]]";
  attached.transform.position.expression = positionExpression;
}

 //adding stroke to an existing shape layer:
 function addStroke(shape,strokeWidthValue,expression){
     switch (arguments.length) {
       case 0: alert("select a shape");
       case 1: strokeWidthValue = 6;
       case 2: expression = false;
       case 3: break;
       default: alert("check your arguments boy");
     }

     var stroke = shape.content.addProperty("ADBE Vector Graphic - Stroke");
     var strokeWidth = stroke.property("ADBE Vector Stroke Width");
     if(!expression){
       strokeWidth.setValue(strokeWidthValue);
     }else{
       shape.property("Effects").addProperty("Slider Control");
       strokeWidth.expression = "effect(\"Slider Control\")(\"Slider\").value == 0? 5: effect(\"Slider Control\")(\"Slider\")";
      }
  }

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
    switch (arguments.length) {
      case 0: x0=-4000;
      case 1: x1=4000;
      case 2: y0=-3000;
      case 3: y1=3000;
      case 4: xbasis=100;
      case 5: ybasis=100;
      case 6: strokeWidth=2;
      case 7:break;
      default: alert('invalid argument type')
    }
    createLines("vertical",x0,x1,y0,y1,xbasis,strokeWidth);
    createLines("horizontal",x0,x1,y0,y1,ybasis,strokeWidth);
  }

  // create a line:
  function Line(x0, x1, strokeWidthValue){
     var shapeLayer = new Shape();
     shapeLayer.vertices = [[x0,0],[x1,0]];
     var line = app.project.activeItem.layers.addShape();
     var path = line.content.addProperty("ADBE Vector Shape - Group");
     path.path.setValue(shapeLayer);

     addStroke(line,strokeWidthValue);
     line.name = "line";

     this.layer = line;
  }

  Line.prototype = {
    attachToPoints : function(point1,point2){

      if(arguments.length != 2){
        alert("Please pass two points as parameters");
      }

      var line = this.layer;

      var positionExpression ="thisComp.layer(\""+point1.name+"\").transform.position";

      var rotationExpression = "var p0 =thisComp.layer(\""+point1.name+"\").transform.position;\n"
     +"var p1 =thisComp.layer(\""+point2.name+"\").transform.position;\n"
     +"var rot =  (p1[0]-p0[0]) ==0?0: radiansToDegrees(Math.atan((p1[1]-p0[1])/(p1[0]-p0[0])));"
     +"rot";
     line.transform.position.expression = positionExpression;
     line.transform.rotation.expression = rotationExpression;
    }
  }

  function Hand(scale){
    scale  = (typeof scale !== 'undefined')? scale: 28;
    var importedFile = app.project.importFile(new ImportOptions(File("hand.ai")));
    var layer = currComp.layers.add(importedFile);
    layer.transform.anchorPoint.setValue([161,236]);
    layer.transform.scale.setValue([scale,scale]);
    this.layer = layer;
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
   function createShapeLayerWithPath(strokeWidth,expressionStroke){
    var line = app.project.activeItem.layers.addShape();
    var path = line.content.addProperty("ADBE Vector Shape - Group");
    addStroke(line,strokeWidth,expressionStroke);
    return line;
  }

  function addFill(shape){
    var fill = shape.content.addProperty("ADBE Vector Graphic - Fill");
    return fill;
  }

  function staticXAxis(start,end,spacingout,count,dashLength,strokeWidth){
    createLines(0,start,end,strokeWidth+2);

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

  function dynamicXAxis(numDashes,textIncluded){
    switch (arguments.length) {
      case 0: numDashes = 80;
      case 1: textIncluded = false;
      case 2: break;
      default:alert('invalid arguments length')
    }
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

      if(textIncluded){
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

 function setPathValue(layer,shape){
   var path0 = layer.content.property("ADBE Vector Shape - Group");
   var path = path0.path;
   path.setValue(shape);
 }

 function createLineWithTwoPoints(type,x0,x1){
   var shapeLayer = new Shape();
   switch (type) {
     case "horizontal":
     shapeLayer.vertices = [[x0,0],[x1,0]];
       break;
     case "vertical":
      shapeLayer.vertices = [[0,x0],[0,x1]];
      break;
     default: alert("Please specify whether your line is\
     horizontal or vertical!");
   }
   var line = app.project.activeItem.layers.addShape();
   var path = line.content.addProperty("ADBE Vector Shape - Group");
   path.path.setValue(shapeLayer);

   addStroke(line,2);
   line.name = "line";

   return line;
}

function slope(){
  var slope = new createLineWithTwoPoints("horizontal",-400,400);
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

  this.layer = slope;
}

function deltaxyOfSlope(point,slope){
  var deltax= new createShapeLayerWithPath(5);
  deltax.name = "DeltaX";
  var deltay = new createShapeLayerWithPath(5);
  deltay.name = "DeltaY";
  deltax.effect.addProperty("Function Point");
  deltay.effect.addProperty("Function Point");
  var xpath = deltax.content.property("ADBE Vector Shape - Group");
  var ypath = deltay.content.property("ADBE Vector Shape - Group");

  var xpathExpression = "var someCoordinate = thisComp.layer(\""+slope.layer.name+"\").transform.rotation<0 ? 0: -200;\n"
  +"createPath(points =[[-100,0], [someCoordinate,0]],\n"
  +"inTangents = [], outTangents = [], is_closed = false)";

  var xpositionExpression = "var x = thisComp.layer(\""+point.layer.name+"\").transform.position[0]+100;\n"
  +"var y = thisComp.layer(\""+point.layer.name+"\").transform.position[1];\n"
  +"[x,y]";

  var ypathExpression = "var tanShit =Math.tan(degreesToRadians(thisComp.layer(\""+slope.layer.name+"\").transform.rotation));\n"
  +"var someCoordinate = thisComp.layer(\""+slope.layer.name+"\").transform.rotation<0?tanShit:-tanShit;\n"
  +"var k = thisComp.layer(\""+slope.layer.name+"\").transform.rotation<0?1:-1;\n"
  +"createPath(points =[[k*100,0], [k*100,100*someCoordinate]],\n"
  +"inTangents = [], outTangents = [], is_closed = false)";

  var ypositionExpression = "var x = thisComp.layer(\""+point.layer.name+"\").transform.position[0];\n"
  +"var y = thisComp.layer(\""+point.layer.name+"\").transform.position[1];\n"
  +"[x,y]";

  var colorExpression = "function hexToColor(theHex){\
  theHex = parseInt(theHex,16);\
  var r = theHex >> 16;\
  var g = (theHex & 0x00ff00) >> 8;\
  var b = theHex & 0xff;\
  return [r/255,g/255,b/255,1];\
  }\
  if(thisComp.layer(\""+slope.layer.name+"\").transform.rotation<0){\
  hexToColor(\"2DAA4B\");\
  }else{\
  hexToColor(\"FF1717\");\
  }";
  var someStroke = deltax.content.property("ADBE Vector Graphic - Stroke");

  xpath.path.expression = xpathExpression;
  ypath.path.expression = ypathExpression;

  deltax.transform.position.expression= xpositionExpression;
  deltay.transform.position.expression = ypositionExpression;

  someStroke.property("ADBE Vector Stroke Color").expression = colorExpression;
}


function createParameter(someFunctionName){
   var paramText = currComp.layers.addText();
   paramText.name = "paramText";
   paramText.property("Effects").addProperty("Slider Control");
   var paramTextExpression = "var x = \"(\"+Math.floor(effect(\"Slider Control\")(\"Slider\").value)+\")\";"
   +"x";
    paramText.sourceText.expression = paramTextExpression;
    paramText.transform.scale.setValue([137,156]);
    centerAnchorPoint(paramText);
    positionExpression = "var x = thisComp.layer(\""+someFunctionName+"\").transform.position[0]+120;\n"
    +"var y = thisComp.layer(\""+someFunctionName+"\").transform.position[1];\n[x,y]";
    paramText.transform.position.expression = positionExpression;
}
