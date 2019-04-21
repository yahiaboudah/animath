#include "big-ol-pile-of-functions.jsx";

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
  var contents = neuron.property("Contents");
  var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
  var ellipseSize = [ellipSize,ellipSize];
  ellipse.property("ADBE Vector Ellipse Size").setValue(ellipseSize);
  var fillProp = contents.addProperty("ADBE Vector Graphic - Fill");
  var fillColor = fillProp.property("ADBE Vector Fill Color");
  var fillOpacityProp = fillProp.property("ADBE Vector Fill Opacity");
  fillOpacityProp.expression = "comp(\""+comp.name+"\").layer(\""+name+"\").effect(\"Slider Control\")(\"Slider\")";
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
  txt.Text.property("Source Text").expression =
  "var k = Math.floor(thisComp.layer(\""+name+"\").content(\"Fill 1\").opacity)/100;\n"
  +"if(k==0 || k==1){k+\".00\"}else if(((k % 0.1) > 0.09 )||((k % 0.1) == 0)){k+\"0\"}else{k}";
  var animator = txt.Text.Animators.addProperty("ADBE Text Animator");
  var textFillColor = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
  textFillColorExpression =
  "var k = Math.floor(thisComp.layer(\""+name+"\").content(\"Fill 1\").opacity)/100;\n"
  +"if(k<0.5){\n"
  +"[1,1,1,1]\n"
  +"}else{\n"
  +"[1,1,1,255]/255\n"
  +"}\n";
  textFillColor.expression = textFillColorExpression;
  centerAnchorPoint(txt);
  // the precomp
  var precomp = comp.layers.precompose([1,2],name,true);
  precomp.width = precompDimension;
  precomp.height = precompDimension;
  var precompLayer = comp.selectedLayers[0];
  precompLayer.collapseTransformation = true;
  precompLayer.property("Effects").addProperty("Slider Control");
  return precompLayer;
}
