#include "big-ol-pile-of-functions.jsx";
#target aftereffects
#targetengine weightsLocked

weightsLocked = false;
function Neuron(ellipSize,name){
  this.size = ellipSize;
  if( typeof name == 'undefined'){
    name = "neuron 1";
  }
  var precompDimension = ellipSize+5;
  var comp = app.project.activeItem;
  // The circle
  var neuron = comp.layers.addShape();
  neuron.transform.position.setValue([precompDimension/2,precompDimension/2]);
  neuron.name = name;
  neuron.property("Effects").addProperty("Slider Control");
  neuron.property("Effects").property("Slider Control").property("Slider").expression = "comp(\""+comp.name+"\").layer(\""+name+"\").effect(\"NeuronControl\")(\"Threshold\")";
  var contents = neuron.property("Contents");
  var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
  var ellipseSize = [ellipSize,ellipSize];
  ellipse.property("ADBE Vector Ellipse Size").setValue(ellipseSize);
  var fillProp = contents.addProperty("ADBE Vector Graphic - Fill");
  var fillColor = fillProp.property("ADBE Vector Fill Color");
  var fillOpacityProp = fillProp.property("ADBE Vector Fill Opacity");
  fillOpacityProp.expression = "comp(\""+comp.name+"\").layer(\""+name+"\").effect(\"NeuronControl\")(\"Activation\")";
  fillColor.setValue([1,1,1,1]);
  var stroke = contents.addProperty("ADBE Vector Graphic - Stroke");
  var strokeColor = stroke.property("ADBE Vector Stroke Color");
  var strokeWidth = stroke.property("ADBE Vector Stroke Width");
  strokeWidth.setValue(3);
  strokeColor.setValue([1,1,1,1]);
  // The text
  var txt = comp.layers.addText();
  var textProp = txt.property("Source Text");
  var textDocument = textProp.value;
  textDocument.fontSize = (75/200)*ellipSize;
  textDocument.fillColor = [1, 1, 1];
  textDocument.font = "LMRoman10-Regular";
  textDocument.strokeOverFill = true;
  textDocument.applyStroke = false;
  textDocument.applyFill = true;
  textProp.setValue(textDocument);
  txt.transform.position.setValue([precompDimension/2,precompDimension/2]);
  txt.Text.property("Source Text").expression ="var threshold = thisComp.layer(\""+name+"\").effect(\"Slider Control\")(\"Slider\").value;"
+"var k = threshold* thisComp.layer(\""+name+"\").content(\"Fill 1\").opacity/100;"
+"if(parseInt(k /10) == 0 && k == parseInt(k)){"
+"  k+\".00\" "
+"}else if(parseInt(k) / 10 > 0 && k == parseInt(k) && k != threshold){k+\".0\""
+"}else if(k>=10 && k<100 && k != parseInt(k)){"
+"parseInt(k)+\".\"+parseInt(10*(k-parseInt(k)))}"
+"else if(parseInt(parseInt(k)/10) == 0 && k != parseInt(k)){"
+"    parseInt(k)+\".\"+parseInt(100*(k-parseInt(k)))"
+"}"
+"else if(((k % 0.1) > 0.09 )||((k % 0.1) == 0) &&  k != threshold){"
+"k+\"0\"}else if(parseInt(k) >= 100){parseInt(k)"
+"}else{k}";
  var animator = txt.Text.Animators.addProperty("ADBE Text Animator");
  var textFillColor = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
  textFillColorExpression =
  "var k =  Math.floor(thisComp.layer(\""+name+"\").content(\"Fill 1\").opacity)/100;\n"
  +"if(k<0.5){\n"
  +"[1,1,1,1]\n"
  +"}else{\n"
  +"[1,1,1,255]/255\n"
  +"}\n";
  textFillColor.expression = textFillColorExpression;
  txt.transform.position.expression = "var k = thisComp.layer(\""+name+"\").content(\"Fill 1\").opacity/100;"
  +"if(k == 1){[112.5,99.5]}else{[101.5,99.5]}";
  centerAnchorPoint(txt);
  // the precomp
  var precomp = comp.layers.precompose([1,2],name,true);
  precomp.width = precompDimension;
  precomp.height = precompDimension;
  var precompLayer = comp.selectedLayers[0];
  precompLayer.collapseTransformation = true;
  precompLayer.property("Effects").addProperty("NeuronControl");
  precompLayer.shy = true;
  return precompLayer;
}

function maskExpression(n){
  var expression =
  "var radius0 = thisComp.layer(\""+n.name+"\").sourceRectAtTime(time,true).width/2;"
  +"var radius = radius0*thisComp.layer(\""+n.name+"\").transform.scale[0]/100;"
  +"var stretch = radius/1.81066;"
  +"var posx = thisComp.layer(\""+n.name+"\").position[0]-1060;"
  +"var posy = thisComp.layer(\""+n.name+"\").position[1]-640;"
  +"createPath(points = [[-radius+posx,posy],[posx,posy+radius],[posx+radius,posy],[posx,posy-radius]],"
  +"inTangents = [[0,-stretch],[-stretch,0],[0,stretch],[stretch,0]],"
  +"outTangents = [[0,stretch],[stretch,0],[0,-stretch],[-stretch,0]], is_closed = true)";
  return expression;
}

function Connec(n,m){
  var k = new DynamicLine([m,0],[m,1],[n,0],[n,1]);
  centerAnchorPoint(k);
  k.shy = true;
  // Adding masks
  k.Masks.addProperty("Mask");
  k.Masks.addProperty("Mask");
  k.property("Masks").property("Mask 1").maskMode = MaskMode.SUBTRACT;
  k.property("Masks").property("Mask 2").maskMode = MaskMode.SUBTRACT;
  // Editing the mask expressions
  var mask1 = k.property("Masks").property("Mask 1");
  var mask2 = k.property("Masks").property("Mask 2");
  mask1.property("Mask Path").expression = maskExpression(n);
  mask2.property("Mask Path").expression = maskExpression(m);
  mask1.locked = true;
  mask2.locked = true;
  return k;
}

function net(nn){
var comp = app.project.activeItem;
comp.netArray = nn;
var neuronSize = 200;
var depth = nn.length;
var arr = [];
for(var i=0;i<depth;i++){
 arr[i] = [];
 for(var j=0;j<nn[i];j++){
   var n = new Neuron(neuronSize,"Neuron "+i+""+j);
   n.comment = i+""+j;
   arr[i][j] = n;
   if(i > 0){
     for(var k=0;k<nn[i-1];k++){
     var c = new Connec(arr[i][j],arr[i-1][k]);
     c.name = i+": w"+j+""+k;
     c.comment = i+""+j+""+(i-1)+""+k;
     // c.locked = true;
   }
}
}
}

var max = nn[0];
for(var h=1;h<nn.length;h++){
  if(nn[h]>max){
    max = nn[h];
  }
}
// adjust position:
var horizontalSpacing = 400;
var verticalSpacing = 300;
var gapSize = verticalSpacing - neuronSize;
//center the neural net
var firstNeuronPosx = ((comp.width - neuronSize*(2*depth-1))/2)+neuronSize/2;
var firstNeuronPosy = ((comp.height - (neuronSize*max+(verticalSpacing-neuronSize)*(max-1)))/2)+neuronSize/2;

var startingPoint;

for(var i=0;i<depth;i++){
  for(var j=0;j<nn[i];j++){
    if(nn[i] == max){
      arr[i][j].transform.position.setValue([firstNeuronPosx+i*horizontalSpacing,firstNeuronPosy+verticalSpacing*j]);
  }else{
    startingPoint =  (max-nn[i])*((neuronSize+gapSize)/2)+firstNeuronPosy;
    arr[i][j].transform.position.setValue([firstNeuronPosx+i*horizontalSpacing,startingPoint+verticalSpacing*j]);
}
}
}
}

function formCombosGivenCoord(coords){
  var combos = [];
  var reverseFire = false;
  var comp = app.project.activeItem;
  var netArray = comp.netArray;
  if(typeof netArray == 'undefined'){
    alert("Select a neural net comp");
  }
  var vcord0 = coords[0];
  var vcord1 = coords[1];
  var cord0 = coords[0].length;
  var cord1 = coords[1].length;
  if(cord0 == 2 && cord1 == 2){
    if(eval(vcord0[0]) > eval(vcord1[0])){
      reverseFire = true;
      combos[combos.length] = vcord0+vcord1;
    }else{
      reverseFire = false;
      combos[combos.length] = vcord1+vcord0;
    }
  }else if ((cord0 == 2 && cord1 == 1)||(cord0 == 1 && cord1 == 2)) {
    if(eval(vcord0[0]) > eval(vcord1[0])){
      reverseFire = true;
      if(cord0 == 2 && cord1 == 1){
        vcord1 = eval(vcord1);
        for(var i=0;i<netArray[vcord1];i++){
          combos[combos.length] = vcord0+""+vcord1+""+i;
        }
      }else{
        vcord0 = eval(vcord0);
        for(var i=0;i<netArray[vcord0];i++){
          combos[combos.length] = vcord0+""+i+""+vcord1;
        }
      }
    }else{ // forward
      reverseFire = false;
      if(cord0 == 2 && cord1 == 1){
        vcord1 = eval(vcord1);
        for(var i=0;i<netArray[vcord1];i++){
          combos[combos.length] = vcord1+""+i+""+vcord0;
        }
      }else{
        vcord0 = eval(vcord0);
        for(var i=0;i<netArray[vcord0];i++){
          combos[combos.length] = vcord1+""+vcord0+""+i;
        }
      }
    }
  }else if (cord0 == 1 && cord1 == 1) {
    vcord0 = eval(vcord0);
    vcord1 = eval(vcord1);
    if(vcord0 > vcord1){
      reverseFire = true;
      for(var i=0;i<netArray[vcord0];i++){
        for(var j=0;j<netArray[vcord1];j++){
          combos[combos.length] = vcord0+""+i+""+vcord1+""+j;
        }
      }
    }else{
      reverseFire = false;
      for(var i=0;i<netArray[vcord1];i++){
        for(var j=0;j<netArray[vcord0];j++){
          combos[combos.length] = vcord1+""+i+""+vcord0+""+j;
        }
      }
    }
  }
  return [combos,reverseFire];
}

function select(fireup,reversed,coord){
if(typeof reversed == 'undefined'){
  reversed = false;
}
var comp = app.project.activeItem;
var selectedLayers = comp.selectedLayers;
if(fireup){
if(typeof coord == 'undefined'){
  alert("please enter some coords");
}
var combos = coord;
}else{
var combos = formCombos(selectedLayers);
}
for(var i=0;i<selectedLayers.length;i++){
  selectedLayers[i].selected = false;
}
for(var i=1;i<comp.layers.length+1;i++){
  var comment = comp.layer(i).comment;
  if(reversed){
  var comboChecked = 0;
  if(comment.length == 4){
  for(var j=0;j<combos.length;j++){
    if(comment != combos[j]){
      comboChecked++;
    }
  }
}
if(comboChecked == combos.length){
  comp.layer(i).selected = true;
}
}else{
  if(comment.length == 4){
    for(var j=0;j<combos.length;j++){
      if(comment == combos[j]){
        comp.layer(i).selected = true;
      }
    }
  }
}
}
}

function formCombos(array){
  var combos = [];
  for(var i=0;i<array.length;i++){
    for(var j=i+1;j<array.length;j++){
      if(eval(array[i].comment[0]) == (eval(array[j].comment[0])+1)){
        combos[combos.length] = array[i].comment+array[j].comment;
      }
    }
  }
  return combos;
}

function fire(flashTime,firingColor,reverseCheckVar){
app.beginUndoGroup("Fire");
if(typeof flashTime == 'undefined'){
  flashTime = 1.201201201201;
}
var easeInOffset = new KeyframeEase(0, 75);
var easeOutOffset = new KeyframeEase(0, 75);
var easeInEnd1 = new KeyframeEase(0, 60);
var easeOutEnd1 = new KeyframeEase(0, 60);
var easeInEnd2 = new KeyframeEase(0.25, 13);
var easeOutEnd2 = new KeyframeEase(0.25, 13);
var easeInEnd3 = new KeyframeEase(0, 75);
var easeOutEnd3 = new KeyframeEase(0, 75);
var comp = app.project.activeItem;
var selectedLayers = comp.selectedLayers;
if(selectedLayers.length == 0){
  alert("Please select some weights");
}


for(var i=0;selectedLayers.length;i++){
var layer = selectedLayers[i];
if(layer.property("Contents").property(1).name != "Group 1"){
var contents = layer.property("Contents");
// Get expressions
var pathExpression = contents.property("Path 1").property("Path").expression;
var strokeExpression = contents.property("Stroke 1").property("Stroke Width").expression;
var group1 = contents.addProperty("ADBE Vector Group");
var vectors1 = group1.property("ADBE Vectors Group");
var path1 = vectors1.addProperty("ADBE Vector Shape - Group");
path1.property("Path").expression = pathExpression;
var trimPaths = vectors1.addProperty("ADBE Vector Filter - Trim");
var trimStart = trimPaths.property("ADBE Vector Trim Start");
// trimEnd
var trimEnd = trimPaths.property("ADBE Vector Trim End");
var numKeysEnd = trimEnd.numKeys;
//Create keyframes
trimEnd.setValueAtTime(comp.time,0);
trimEnd.setTemporalEaseAtKey(trimEnd.numKeys, [easeInEnd1], [easeOutEnd1]);
trimEnd.setValueAtTime(comp.time+flashTime/2,27);
trimEnd.setTemporalEaseAtKey(trimEnd.numKeys, [easeInEnd2], [easeOutEnd2]);
trimEnd.setValueAtTime(comp.time+flashTime,0);
trimEnd.setTemporalEaseAtKey(trimEnd.numKeys, [easeInEnd3], [easeOutEnd3]);
// Offset
var trimOffset = trimPaths.property("ADBE Vector Trim Offset");
trimOffset.setValueAtTime(comp.time,reverseCheckVar?170:0);
trimOffset.setTemporalEaseAtKey(trimOffset.numKeys, [easeInOffset], [easeOutOffset]);
trimOffset.setValueAtTime(comp.time+flashTime,reverseCheckVar?0:170);
trimOffset.setTemporalEaseAtKey(trimOffset.numKeys, [easeInOffset], [easeOutOffset]);
var stroke1 = vectors1.addProperty("ADBE Vector Graphic - Stroke");
var stroke1Width = stroke1.property("ADBE Vector Stroke Width");
stroke1Width.setValue(12);
stroke1.property("Color").setValueAtTime(comp.time,firingColor);
stroke1.property("Color").setValueAtTime(comp.time+flashTime,firingColor);
var group2 = contents.addProperty("ADBE Vector Group");
var vectors2 = group2.property("ADBE Vectors Group");
var path2 = vectors2.addProperty("ADBE Vector Shape - Group");
path2.property("Path").expression = pathExpression;
var stroke2 = vectors2.addProperty("ADBE Vector Graphic - Stroke");
var stroke2Width = stroke2.property("ADBE Vector Stroke Width");
stroke2Width.expression = strokeExpression;
contents.property(1).remove();
contents.property(1).remove();
}else{
  var strokeColor = layer.property("Contents").property("Group 1").property("Contents").property("Stroke 1").property("Color");
  strokeColor.setValueAtTime(comp.time,firingColor);
  strokeColor.setValueAtTime(comp.time+flashTime,firingColor);
  // trimEnd
  var trimEnd = layer.property("Contents").property("Group 1").property("Contents").property("Trim Paths 1").property("End");
  var numKeysEnd = trimEnd.numKeys;
  //Create keyframes
  trimEnd.setValueAtTime(comp.time,0);
  trimEnd.setTemporalEaseAtKey(trimEnd.numKeys, [easeInEnd1], [easeOutEnd1]);
  trimEnd.setValueAtTime(comp.time+flashTime/2,27);
  trimEnd.setTemporalEaseAtKey(trimEnd.numKeys, [easeInEnd2], [easeOutEnd2]);
  trimEnd.setValueAtTime(comp.time+flashTime,0);
  trimEnd.setTemporalEaseAtKey(trimEnd.numKeys, [easeInEnd3], [easeOutEnd3]);
  // Offset
  var trimOffset = layer.property("Contents").property("Group 1").property("Contents").property("Trim Paths 1").property("Offset");
  trimOffset.setValueAtTime(comp.time,reverseCheckVar?170:0);
  trimOffset.setTemporalEaseAtKey(trimOffset.numKeys, [easeInOffset], [easeOutOffset]);
  trimOffset.setValueAtTime(comp.time+flashTime,reverseCheckVar?0:170);
  trimOffset.setTemporalEaseAtKey(trimOffset.numKeys, [easeInOffset], [easeOutOffset]);
}
}
app.endUndoGroup();
}

function lockWeights(bool){
  var comp = app.project.activeItem;
  for(var i=1;i<comp.layers.length+1;i++){
    if(comp.layer(i).comment.length > 2){
      comp.layer(i).locked = bool;
    }
  }
}

function modifyNeurons(){
var comp = app.project.activeItem;
var animationTime = prompt("Enter the animation duration: ",0.5);
animationTime = eval(animationTime);
var num = prompt("Hidden layer/neuron:",1);
app.beginUndoGroup("Modify");
if(num.length == 2){
  var activation = prompt("Enter the value: ",99);
  activation = eval(activation);
  for(var i=0;i<comp.layers.length;i++){
    if(comp.layer(i+1).comment == num){
      var slider = comp.layer(i+1).property("Effects").property("Slider Control").property("Slider");
      var previousActivationIndex = slider.nearestKeyIndex(comp.time);
      var previousActivation = slider.keyValue(previousActivationIndex);
      slider.setValueAtTime(comp.time,previousActivation);
      slider.setValueAtTime(comp.time+animationTime,activation);
      break;
    }
  }
}else if(num.length == 1){
  var netArray = comp.netArray;
  var allActivations = [];
  num = eval(num);
  for(var i=0;i<netArray[num];i++){
    var p = prompt("Enter a value for neuron: "+num+""+i);
    allActivations[i] = eval(p);
  }
  for(var i=1;i<comp.layers.length+1;i++){
    if((comp.layer(i).comment.length == 2) && (comp.layer(i).comment[0] == num.toString())){
      neuronNumber = eval(comp.layer(i).comment[1]);
      var slider = comp.layer(i).property("Effects").property("Slider Control").property("Slider");
      var previousActivation = 0;
      if(slider.numKeys > 0){
        var previousActivationIndex = slider.nearestKeyIndex(comp.time);
        previousActivation = slider.keyValue(previousActivationIndex);
      }else{
        previousActivation = slider.valueAtTime(comp.time,false);
      }
      slider.setValueAtTime(comp.time,previousActivation);
      slider.setValueAtTime(comp.time+animationTime,allActivations[neuronNumber]);
    }
  }
}else{
  alert("Enter a valid neuron/layer number");
}
alert("Done!");
comp.time = comp.time + animationTime;
app.endUndoGroup();
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

win=new Window("palette","Neural net",[0,0,240,350],{resizeable:true,});
input=win.add("edittext",[41,28,206,63] ,"[3,1]",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
neuralNetStatic=win.add("statictext",[93,10,163,30] ,"neural net:",{multiline:true});
parameters=win.add("panel",[25,110,200,330]);
fireReverseCheck=win.add("checkbox",[150,133,200,330],"FRev");
reverseCheck=win.add("checkbox",[150,213,200,250],"Rev");
fireWeights = win.add("button",[45,125,140,155],"Fire Weights");
lockWeightsButton=win.add("button",[45,165,140,195],"Lock Weights");
selectWeights=win.add("button",[45,205,140,235],"Select Weights");
fireUp = win.add("button",[45,245,140,275],"FIRE UP!");
modify = win.add("button",[45,285,140,315],"Modify!");
reverseCheck.value=0;
createNet=win.add("button",[70,70,178,99],"Create");
win.center();
win.show();


createNet.onClick = function(){
  app.beginUndoGroup("createNet");
  var netArray = input.text;
  net(eval(netArray));
  app.endUndoGroup();
}
selectWeights.onClick = function(){
  app.beginUndoGroup("Select weights");
  var reverse = reverseCheck.value == 0? false:true;
  select(false,reverse);
  app.endUndoGroup();
}
lockWeightsButton.onClick = function(){
  app.beginUndoGroup("lock weights");
  weightsLocked = !weightsLocked;
  lockWeights(weightsLocked);
  app.endUndoGroup();
}
fireUp.onClick = function(){
  var comp = app.project.activeItem;
  var hexColor = $.colorPicker();
  var r = hexColor >> 16;
  var g = (hexColor & 0x00ff00) >> 8;
  var b = hexColor & 0xff;
  r/=255;g/=255;b/=255;
  var fTime = prompt("Enter the flash time",1.2);
  fTime = parseFloat(fTime);
  var startingPlace = prompt("Enter the starting neuron/layer",0);
  var endingPlace = prompt("Enter the ending neuron/layer",1);
  var formTheCombos = formCombosGivenCoord([startingPlace,endingPlace]);
  select(true,false,formTheCombos[0]);
  doFunction("fire",fTime,"["+r+","+g+","+b+",1]",formTheCombos[1]);
  alert("done!");
  comp.time = comp.time + fTime;
}

fireWeights.onClick = function(){
  app.beginUndoGroup("Fire weights");
  var hexColor = $.colorPicker();
  var r = hexColor >> 16;
  var g = (hexColor & 0x00ff00) >> 8;
  var b = hexColor & 0xff;
  r/=255;g/=255;b/=255;
  var promptValue = prompt("Enter the flash time",1.2);
  promptValue = parseFloat(promptValue);
  fire(promptValue,[r,g,b,1],fireReverseCheck.value);
  app.endUndoGroup();
}

modify.onClick = function(){
  modifyNeurons();
}
