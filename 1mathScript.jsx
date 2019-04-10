#targetengine selLayersArr
selLayersArr = [];

win=new Window("palette","mathScript",[0,0,250,460],{resizeable:true,});
getEquationPanel=win.add("panel",[20,20,220,170],"Get Expression");
getExpressionEditText=getEquationPanel.add("edittext",[20,27,182,69] ,"x",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
getItButton=getEquationPanel.add("button",[43,75,163,105],"GET IT!");
graphExpressionPanel=win.add("panel",[20,173,220,437],"Graph Expression");
createGridButton=graphExpressionPanel.add("button",[21,15,113,49],"Create Grid");
defaultGridChecked=graphExpressionPanel.add("checkbox",[120,25,190,45],"Default");
defaultGridChecked.value=0
graphFunctionButton=graphExpressionPanel.add("button",[21,53,113,87],"Graph Function");
defaultFunctionGraphChecked=graphExpressionPanel.add("checkbox",[120,63,190,83],"Default");
defaultFunctionGraphChecked.value=0
createAxisButton=graphExpressionPanel.add("button",[21,91,113,125],"Create Axis");
drawGraphButton=graphExpressionPanel.add("button",[21,129,113,163],"Draw Graph");
transitionToButton=graphExpressionPanel.add("button",[21,167,113,201],"Transition To");
getSelectedLayers=graphExpressionPanel.add("button",[21,210,113,240],"Get SleLay");
resetSelectedLayers=graphExpressionPanel.add("button",[120,210,180,240],"Reset");
createPointButton=graphExpressionPanel.add("button",[118,91,188,124],"Create Point");
dynamicLineButton=graphExpressionPanel.add("button",[118,130,188,163],"DynamicLine");
handButton=graphExpressionPanel.add("button",[118,167,188,200],"Hand");

var illustratorAppSpecifier = "illustrator-19.032";
var editEquationIllustrator = "editEquation();"
    +"function editEquation(){"
    +"var importedFileString = \"C:\\wget\\x.png\";"
    +"var importedFile = new File(importedFileString);"
    +"open(importedFile);"
    +"var doc = app.activeDocument;"
    +"var image = doc.selection[0];"
    +"image.hasSelectedArtwork = true;"
    +"var tracedImage = doc.selection[0].trace();"
    +"var options = tracedImage.tracing.tracingOptions.loadFromPreset('uuuu');"
    +"tracedImage.tracing.expandTracing();"
    +"var exportedFileString = importedFileString;"
    +"exportedFileString = exportedFileString.slice(0,-3);"
    +"exportedFileString += \"eps\";"
    +"var exportedFile = new File(exportedFileString);"
    +"var saveOpts = new EPSSaveOptions();"
    +"doc.saveAs(exportedFile,saveOpts);"
    +"return exportedFileString;}";

function getEquationButtonClicked(){
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
  };
  var isIllustratorOpen = BridgeTalk.isRunning(illustratorAppSpecifier);
  if(!isIllustratorOpen){
    alert("Illustrator is not launched");
  }else{
  var eqStr0 = getExpressionEditText.text;
  var eqStr2 = eqStr0.replaceAll(" ","%20");
  var eqStr = eqStr2.replaceAll("^","^^");
  var myCommand = "cd C:\\wget & wget -O x.png http://latex.codecogs.com/png.latex?\\dpi{300}%20\\huge%20"+ eqStr;
  system.callSystem("cmd /c \"" + myCommand + "\"");
  var file = new File("C:\\wget\\x.png");
  var bt = new BridgeTalk;
  bt.target = illustratorAppSpecifier;
  bt.body = editEquationIllustrator;
  bt.onResult = function(fileString){
    var importedFile = new File(fileString.body);
    var comp = app.project.activeItem;
    var importOptions = new ImportOptions();
    importOptions.file = importedFile;
    importOptions.importAs = ImportAsType.FOOTAGE;
    BridgeTalk.bringToFront("aftereffects");
    var footage = app.project.importFile(importOptions);
    var footageLayer = comp.layers.add(footage);
    app.executeCommand(3973);
    var layerNow = comp.layer(1);
    layerNow.name = eqStr0;
    layerNow.transform.scale.setValue([250,250]);
    footageLayer.remove();
    // fix the equation:
    var content = layerNow.property("Contents");
    for(var i=1;i<content.numProperties+1;i++){
      var group = content.property(i).property("Contents");
      group.property("Fill 1").property("Color").setValue([1,1,1,1]);
       for(var j=1;j<group.numProperties+1;j++){
        if(group.property(j).name.indexOf("Merge Paths") != -1){
          if(group.property(j).property("Mode").value == 4){
          var foundPath = false;
          var k = j-1;
          while(!foundPath && k>0){
            if(group.property(k).name.indexOf("Path") != -1){
              var kth = group.property(k).name;
              var jth = group.property(j).name;
              group.property(kth).remove();
              group.property(jth).remove();
              foundPath = true;
            }
            k--;
          }
        }
       }
      }
    }
    app.project.item(app.project.items.length).selected = false;
  }
  bt.send();
}
}

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

function createGrid(x0,x1,y0,y1,xbasis,ybasis,strokeWidth){
  switch(arguments.length){
    case 0: x0=-4000;
    case 1: x1=4000;
    case 2: y0=-3000;
    case 3: y1=3000;
    case 4: xbasis=100;
    case 5: ybasis=100;
    case 6: strokeWidth=2;
    case 7:break;
    default: alert('invalid argument length')
  }
  createLines("vertical",x0,x1,y0,y1,xbasis,strokeWidth);
  createLines("horizontal",x0,x1,y0,y1,ybasis,strokeWidth);
}

function Plot(optimized,functionText,xbasis,ybasis,start,end,stepSize){
  switch (arguments.length) {
    case 0: alert("Enter some parameters");
    case 1: alert("Enter a function");
    case 2: xbasis = 100;
    case 3: ybasis = 100;
    case 4: start = -10;
    case 5: end = 10;
    case 6: stepSize = optimized?80:20;
    case 7: break;
    default: alert("Be reasonable with the parameters");
}
var shapeLayer = app.project.activeItem.layers.addShape();
var path = shapeLayer.content.addProperty("ADBE Vector Shape - Group");
var length = Math.floor((((end-start)*xbasis)/stepSize)+2);
var k = (100/stepSize) * 3;
var h = 0.0000000001;
var approx = 10000;
var vertices=[];
var inTangents=[];
var outTangents=[];
var shape = new Shape();
var generator = new Function("x","return "+functionText+";");
var x,y,xh,fh,f,y0;
for(var i =0;i<length;i++){
  x = ((stepSize * i) + start* xbasis);
  y = (-ybasis) * Math.round(approx*generator(((stepSize * i) + start* xbasis)/xbasis))/approx;
  if(optimized){
    xh = x+h*xbasis;
    fh = (ybasis/k) * generator((x/xbasis)+h);
    f =  (ybasis/k) * generator((x/xbasis));
    y0 = 100*(fh-f)/(xh-x);
    inTangents.push([-100/k,y0]);
    outTangents.push([100/k,-y0]);
  }
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
 return shapeLayer;
}

function createGridButtonClicked(){
  if(defaultGridChecked.value){
    createGrid();
  }else{
    var x0 = prompt("Enter the starting point x0: ",-4000);
    x0 = eval(x0);
    var x1 = prompt("Enter the ending point x1: ",-4000);
    x1 = eval(x1);
    var y0 = prompt("Enter the starting point y0: ",-3000);
    y0 = eval(y0);
    var y1 = prompt("Enter the ending point y1: ",3000);
    y1 = eval(y1);
    var xbasis = prompt("Enter the value of the Xbasis: ",100);
    xbasis = eval(xbasis);
    var ybasis = prompt("Enter the value of the Ybais: ",100);
    ybasis = eval(ybasis);
    var strokeWidth = prompt("Enter the stroke width: ",2);
    strokeWidth = eval(strokeWidth);
    createGrid(x0,x1,y0,y1,xbasis,ybasis,strokeWidth);
  }
}

function graphFunctionButtonClicked(){
  var functionText = prompt("Enter the function that you want to graph: ","x*x");
  var optimizeGraph = confirm("Do you want to optimize it?");
  if(functionText == null || optimizeGraph == null){
    alert("Please pick some parameters!");
  }
  else{
  if(defaultFunctionGraphChecked.value){
    Plot(optimizeGraph,functionText);
  }else{
    var xbasis = prompt("Enter the X basis: ",100);
    xbasis = eval(xbasis);
    var ybasis = prompt("Enter the Y basis: ",100);
    ybasis = eval(ybasis);
    var start = prompt("Enter the start: ",-10);
    start = eval(start);
    var end = prompt("Enter the end: ",10);
    end = eval(end);
    var stepSize = prompt("Enter the step size: ",20);
    stepSize = eval(stepSize);
    Plot(optimizeGraph,functionText,xbasis,ybasis,start,end,stepSize);
  }
}
}

function Axis(numDashes,textIncluded){
  var comp = app.project.activeItem;
  var lineShape = comp.layers.addShape();
  lineShape.name = "Axis line";
  var axisProp = lineShape.property("Effects").addProperty("Axis");
  // Just add Group 1
  var mainLineGroup = lineShape.content.addProperty("ADBE Vector Group");
  mainLineGroup.name = "line";
  // add a path prop:
  lineShape.property("Contents").property(mainLineGroup.name).property("Contents").addProperty("ADBE Vector Shape - Group");
  var mainLineExpression = "var start = effect(\"Axis\")(\"Start\");\n"
    +"var end = effect(\"Axis\")(\"End\");\n"
    +"createPath(points =[[start,0], [end,0]],\n"
    +"inTangents = [], outTangents = [], is_closed = false)";
  lineShape.property("Contents").property(mainLineGroup.name).property("Contents").property("Path 1").property("Path").expression = mainLineExpression;
  // add a stroke prop:
  var mainLineStroke = lineShape.property("Contents").property(mainLineGroup.name).property("Contents").addProperty("ADBE Vector Graphic - Stroke");
  mainLineStroke.property("ADBE Vector Stroke Width").setValue(4);

  // Now create the other dashes:
  for(var i=0;i<numDashes;i++){
    var dash = lineShape.property("Contents").addProperty("ADBE Vector Group");
    dash.name = "dash "+i;
    lineShape.property("Contents").property(dash.name).property("Contents").addProperty("ADBE Vector Shape - Group");
    lineShape.property("Contents").property(dash.name).property("Contents").addProperty("ADBE Vector Graphic - Stroke");

    var dashPathExpression = "var start = thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"Start\");\n"
    +"var spacingout = thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"Spacingout\");\n"
    +"var end =thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"End\");\n"
    +"var factor = 30;\n"
    +"var dashLength = effect(\"Axis\")(\"Dash length\");\n"
    +"var pos = start+"+i+"*spacingout;\n"
    + "var dashLen = 0;\n"
    +"if(pos-end<-20){dashLen = dashLength;}\n"
    +"else{dashLen = dashLength*Math.exp(-Math.pow(end-pos,2)/(2*factor*factor));}\n"
    +"createPath(points =[[pos,-dashLen/2], [pos,dashLen/2]],\n"
    +"inTangents = [], outTangents = [], is_closed = false)";

    //var dashStrokeExpression = "thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"Stroke Width\");";
    lineShape.property("Contents").property(dash.name).property("Contents").property("Path 1").property("Path").expression = dashPathExpression;
    lineShape.property("Contents").property(dash.name).property("Contents").property("Stroke 1").property("Stroke Width").setValue(4);
}
if(textIncluded){
for(var i=0;i<numDashes;i++){
  var textLayer = comp.layers.addText();
  textLayer.shy = true;
  // Editing the source text
  textLayer.sourceText.expression = "var num = thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"Count\")+"
  +i+"*thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"Basis\");\
  Math.round(10*num)/10";
  textLayer.name = textLayer.sourceText.value;

  //Anchor Point of the text
  textLayer.transform.anchorPoint.expression= "var x = sourceRectAtTime(time,false).width/2 + sourceRectAtTime(time,false).left;\
  var y = sourceRectAtTime(time,false).height/2 + sourceRectAtTime(time,false).top;\
  [x,y]";

  // Position of the text
  var positionExpression = "var x0 = thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"Start\");"
  +"var spacingout = thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"Spacingout\");"
  +"var x = (thisComp.width/2)+"+i+"*spacingout+x0+thisComp.layer(\""+lineShape.name+"\").transform.position[0]-960;"
  +"var y = thisComp.layer(\""+lineShape.name+"\").transform.position[1]+55;"
  +"[x,y]";

  textLayer.transform.position.expression = positionExpression;

  //Opacity of the text
  var opacityExpression = "var end0 =thisComp.layer(\""+lineShape.name+"\").effect(\"Axis\")(\"End\");\
  var pos = transform.position[0]-thisComp.width/2;\
  if(pos-end0 <-10){100}\
  else{100*Math.exp(-Math.pow(end0-pos,2)/(2*30*30))}";

  textLayer.transform.opacity.expression = opacityExpression;

  // END TEXT RELATED THINGS HERE
}
}
 lineShape.property("Effects").property("Axis").property("Start").setValue(-(numDashes*100 -100)/2);
 lineShape.property("Effects").property("Axis").property("End").setValue((numDashes*100 -100)/2);
}

function draw(drawingTime){
  var currComp = app.project.activeItem;
  var shape = currComp.selectedLayers[0];
  if( (currComp.selectedLayers.length != 1) || (!(shape.reflect.name == "ShapeLayer"))){
    alert("Select a single shape layer");
  }else{
    var trim = shape.content.addProperty("ADBE Vector Filter - Trim");
    trim.property("ADBE Vector Trim End").setValueAtTime(currComp.time,0);
    trim.property("ADBE Vector Trim End").setValueAtTime(currComp.time+drawingTime,100);
  }
}

function transitionTo(interval){
  if( (selLayersArr.length != 1) || !(selLayersArr[0] instanceof ShapeLayer)){
    alert("Please pick a single shape layer");
  }else{
  var newPath0 = selLayersArr[0].content.property("ADBE Vector Shape - Group");
  var newPath = newPath0.path;
  var functionShape = app.project.activeItem.selectedLayers[0];
  var currPath0 = functionShape.content.property("ADBE Vector Shape - Group");
  var currPath = currPath0.path;
  var currComp = app.project.activeItem;
  currPath.setValueAtTime(currComp.time, currPath.value);
  currPath.setValueAtTime(currComp.time+interval,newPath.value);
}
}
function createShapeLayerWithPath(strokeWidth,expressionStroke){
 var line = app.project.activeItem.layers.addShape();
 var path = line.content.addProperty("ADBE Vector Shape - Group");
 addStroke(line,strokeWidth,expressionStroke);
 return line;
}

function addFill(shape){
  var fill = shape.content.addProperty("ADBE Vector Graphic - Fill");
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
   layer.name = "circle "+currComp.layers.length;
   layer.comment = radius;
   this.layer = layer;
   this.name = layer.name;
}

function centerAnchorPoint(layer){
   var comp = app.project.activeItem;
   var x = layer.sourceRectAtTime(comp.time,false).width/2 + layer.sourceRectAtTime(comp.time,false).left;
   var y = layer.sourceRectAtTime(comp.time,false).height/2 + layer.sourceRectAtTime(comp.time,false).top;
   layer.anchorPoint.setValue([x,y]);
}

function DynamicLine(x0,y0,x1,y1){
  var shape = new createShapeLayerWithPath(2,true);
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
  centerAnchorPoint(shape);
  this.layer = shape;
  return this.layer;
}

function Hand(scale){
  var comp = app.project.activeItem;
  var scale  = (typeof scale != 'undefined')? scale: 28;
  fileExists = false;
  var fileIndex = 1;
  for(var i=1;i<app.project.items.length+1;i++){
    if(app.project.item(i).name == "hand.ai"){
      fileExists = true;
      fileIndex = i;
      break;
    }
  }
  if(!fileExists){
  var importedFile = new File("C:\\Users\\HP\\Desktop\\math animation'\\Scripts\\hand.ai");
  var importOptions = new ImportOptions();
  importOptions.file = importedFile;
  importOptions.importAs = ImportAsType.FOOTAGE;
  var footage = app.project.importFile(importOptions);
  var layer = comp.layers.add(footage);
  app.project.item(app.project.items.length).selected = false;
}else{
  var item = app.project.item(fileIndex);
  var layer = comp.layers.add(item);
}

  layer.transform.anchorPoint.setValue([161,236]);
  layer.transform.scale.setValue([scale,scale]);
  this.layer = layer;
}

function doFunction(fn){
      var funcString = eval(fn);
      var args = "(";
      for(var i=1;i<arguments.length;i++){
        args += arguments[i]+",";
      }
      args = args.slice(0,-1) + ");\n";
      functionString = fn + args + funcString.toString();
      //alert(functionString);
      var bt = new BridgeTalk;
      bt.target = "aftereffects";
      var message = functionString;
      bt.body = message;
      bt.send();
}


function createAxisButtonClicked(){
  var numDashes = prompt("Enter the number of dashes: ",10);
  numDashes = eval(numDashes);
  var textIncludedConfirm = confirm("Do you want to include numbers?");
  Axis(numDashes,textIncludedConfirm);
}
function drawGraphButtonClicked(){
  var drawTime = prompt("Enter the drawing time: ",1.2);
  drawTime = eval(drawTime);
  draw(drawTime);
}
function transitionToButtonClicked(){
  var transitionTime = prompt("Enter the transition time: ",1.2);
  transitionTime = eval(transitionTime);
  transitionTo(transitionTime);
}
function createPointButtonClicked(){
  var rad = prompt("Enter a radius of your choosing: ",8);
  rad = eval(rad);
  Point(rad);
}
function dynamicLineButtonClicked(){
  if(selLayersArr.length != 2){
    alert("Please select two layers that you want to link");
  }else{
    var firstx = prompt("Enter the first x: "+selLayersArr[0].name,100);
    firstx = (firstx == 's')? [selLayersArr[0],0]:parseFloat(firstx);
    var firsty = prompt("Enter the first y: "+selLayersArr[0].name,100);
    firsty = (firsty == 's')? [selLayersArr[0],1]:parseFloat(firsty);
    var secondx = prompt("Enter the second x: "+selLayersArr[1].name,100);
    secondx = (secondx == 's')? [selLayersArr[1],0]:parseFloat(secondx);
    var secondy = prompt("Enter the second y: "+selLayersArr[1].name,100);
    secondy = (secondy == 's')? [selLayersArr[1],1]:parseFloat(secondy);
    DynamicLine(firstx,firsty,secondx,secondy);
}
}

getItButton.onClick = function(){
  app.beginUndoGroup("Get equation");
  getEquationButtonClicked();
  app.endUndoGroup();
}
createGridButton.onClick = function(){
  app.beginUndoGroup("create grid");
  createGridButtonClicked();
  app.endUndoGroup();
}
graphFunctionButton.onClick = function(){
  app.beginUndoGroup("Graph");
  graphFunctionButtonClicked();
  app.endUndoGroup();
}
createAxisButton.onClick = function(){
  app.beginUndoGroup("create axis");
  createAxisButtonClicked();
  app.endUndoGroup();
}
drawGraphButton.onClick = function(){
  app.beginUndoGroup("draw");
  drawGraphButtonClicked();
  app.endUndoGroup();
}
getSelectedLayers.onClick = function(){
  app.beginUndoGroup("Get sel layers");
  var comp = app.project.activeItem;
  var selectedLayers = comp.selectedLayers;
  selLayersArr = selectedLayers;
  var selStr = "Stored layers are: \n";
  for(var i=0;i<selLayersArr.length;i++){
    selStr += selLayersArr[i].name+"\n";
  }
  alert(selStr);
  app.endUndoGroup();
}
resetSelectedLayers.onClick = function(){
  app.beginUndoGroup("Empty");
  selLayersArr = [];
  alert("List emptied!");
  app.endUndoGroup();
}

transitionToButton.onClick = function(){
  app.beginUndoGroup("Transition");
  transitionToButtonClicked();
  app.endUndoGroup();
}
createPointButton.onClick = function(){
  app.beginUndoGroup("create Point");
  createPointButtonClicked();
  app.endUndoGroup();
}
dynamicLineButton.onClick = function(){
  app.beginUndoGroup("Dyanmic Line");
  dynamicLineButtonClicked();
  app.endUndoGroup();
}
handButton.onClick = function(){
  app.beginUndoGroup("create Hand");
  var scale = prompt("Enter the scale value",28);
  scale = eval(scale);
  Hand(scale);
  app.endUndoGroup();
}

win.center();
win.show();
