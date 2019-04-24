#include "json2.js";

// get the file:
function getCode(filepath){
  var thePyFile = File(filepath);
  thePyFile.open('r');
  var contents = thePyFile.read();
  thePyFile.close();
  return contents;
}

function getRanges(codeStr){

}

function getExpression(){
  var expr = "i = textIndex;\n"
  +"if(\n"
  + getRanges();
  +"0){100}else{0}";
  return expr;
}

function addAnimatorProp(textLayer,animatorName,thingToHighlight,highLightingColor){
  var txtAnims = textLayer.property("ADBE Text Properties").property(4);
  var txtAnimator = txtAnims.addProperty("ADBE Text Animator");
  txtAnimator.name = animatorName;

  // Modify the amount expression:
  var expressionSelector = txtAnimator.property(1).addProperty("ADBE Text Expressible Selector");// Add an expression selector
  expressionSelector.property("Based On").setValue(3); // set to words
  expressionSelector.property("Amount").expression = getAnimatorExpression(thingToHighlight,false); // get expression

  // Add the appropriate fill color:
  var colorSelector = txtAnimator.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
  colorSelector.setValue(highLightingColor);
}

function getSyntaxJSON(){
  var jsonFile = File("syntax.json");
  jsonFile.open('r');
  jsonContent = jsonFile.read();
  jsonFile.close();
  var jsonObj = JSON.parse(jsonContent);
  return jsonObj;
}

function codeTextLayer(codeStr){
  var comp = app.project.activeItem;
  var text = comp.layers.addText(codeStr);
  var jsonObj = getSyntaxJSON();
  for(var i=0;i<jsonObj.length;i++){
    var name = jsonObj[i].name;
    var thing = jsonObj[i].thing;
    var color = jsonObj[i].color;
    addAnimatorProp(text,name,thing,color);
  }
  return text;
}

function getSyntaxJSON(){
  var jsonFile = File("syntax.json");
  jsonFile.open('r');
  jsonContent = jsonFile.read();
  jsonFile.close();
  var jsonObj = JSON.parse(jsonContent);
  return jsonObj;
}

function getPoints(text,patt,replacepatt){
    var points = [];
    var counter = 0;
    var tempStr = "";
    while(match = patt.exec(text) != null){
      fi = match.index;
      li = patt.lastIndex;
      tempStr = text.substring(fi,li).replace(replacepatt,"");
      points[counter] = [];
      points[counter][0] = fi;
      points[counter][1] = fi + tempStr.length;
      counter++
    }
    return points;
}

function testPoints(text,p){
  var str1 = "";
  for(var i=0;i<p.length;i++){
    str1 = text.substring(points[i][0],points[i][1]);
    alert(str1);
  }
}

var text = py();
var j = getSyntaxJSON();
for(var i= 0;i<){
  var pattern = eval(j[0].pattern);
  var replacepattern = eval(j[0].replacepattern);

  var p = getPoints(text,functionPatt,replacepatt);
}




//var t = codeTextLayer("hello() this is function2() for import as in return me this");
