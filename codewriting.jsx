#include "json2.js";

// get the file:
function getCode(filepath){
  var thePyFile = File(filepath);
  thePyFile.open('r');
  contents = thePyFile.read();
  thePyFile.close();
  return contents;
}

function getExpression(points){
  var expr = "var i = textIndex-1;\n"
  +"if(\n";
  for(var i=0;i<points.length;i++){
    expr += "("+points[i][0]+" <= i && i <= "+points[i][1]+") ||\n";
  }
  expr += "0){100}else{0}";
  return expr;
}

function addAnimatorProp(txtAnimator,animatorName,animExpression,highLightingColor){

  txtAnimator.name = animatorName;

  // Modify the amount expression:
  var expressionSelector = txtAnimator.property("Selectors").addProperty("ADBE Text Expressible Selector");// Add an expression selector
  expressionSelector.name ="Rangooo";

  expressionSelector.property("Based On").setValue(1); // set to chars
  expressionSelector.property("Amount").expression = animExpression; // get expression
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

function getPoints(text,patt,replacepatt){
    var points = [];
    var counter = 0;
    var tempStr = "";
    while((match = patt.exec(text)) != null){
      fi = match.index;
      li = patt.lastIndex;
      tempStr = text.substring(fi,li).replace(replacepatt,"");
      points[counter] = [];
      points[counter][0] = fi+1;
      points[counter][1] = fi + tempStr.length;
      counter++;
    }
    return points;
}

function testPoints(text,p){
  var str1 = "";
  for(var i=0;i<p.length;i++){
    str1 = text.substring(p[i][0],p[i][1]);
    alert(str1);
  }
}

function codeTextLayer(codeStr){
  var comp = app.project.activeItem;
  var text = comp.layers.addText(codeStr);
  var src = text.Text.sourceText.value.toString();
  src = src.replace(/^/gm," ");
  text.Text.sourceText.setValue(src);
  text.name = "a";
  var jsonObj = getSyntaxJSON();

  for(var i=0;i<jsonObj.length;i++){
    var txtAnims = text.property("ADBE Text Properties").property(4);
    var txtAnimator = txtAnims.addProperty("ADBE Text Animator");
    var name = jsonObj[i].name;
    var pattern = eval(jsonObj[i].pattern);
    var replacepattern = eval(jsonObj[i].replacepattern);
    var color = jsonObj[i].color;
    var points = getPoints(codeStr,pattern,replacepattern);
    var expression = getExpression(points);
    addAnimatorProp(txtAnimator,name,expression,color);
  }
  return text;
}

function output(input){
  tempFile = new File("C:/Users/HP/tempforexec.py");
  tempFile.open('w');
  tempFile.write(contents);
  tempFile.close();
  output = system.callSystem("python C:/Users/HP/tempforexec.py");
  tempFile.remove();
  return output;
}

function outputBox(){
  var box = app.project.activeItem.layers.addShape();
  var con = box.property("Contents");
  var rect = con.addProperty("ADBE Vector Shape - Rect");
  var size = rect.property("Size");
  size.setValue([924,924]);
  var roundedness = rect.property("ADBE Vector Rect Roundness");
  roundedness.setValue(45);
  var fill = con.addProperty("ADBE Vector Graphic - Fill");
  fill.property("Color").setValue([1,1,1,1]);
  return box;
}

function outputText(parentLayer,outputHere){
  var txt = app.project.activeItem.layers.addText(outputHere);
  txt.parent = parentLayer;
  srcRect = parentLayer.sourceRectAtTime(0,false);
  txt.transform.position.setValue([srcRect.left+50,srcRect.top+55]);
  return txt;
}

function modifyText(textLayer,fontSize,font,fill,fontStyle){
  var textProp = textLayer.property("Source Text");
  var textDocument = textProp.value;
  textDocument.applyFill = true;
  textDocument.fontSize = fontSize;
  textDocument.font = font;
  textDocument.fillColor = fill;
  textProp.setValue(textDocument);
}

var code = getCode("tst.py");
var text = codeTextLayer(code);
modifyText(text,50,"DejaVuSansMono",[1,1,1]);
text.transform.position.setValue([200,200]);

box = outputBox();
box.transform.position.setValue([1350,540]);
t = outputText(box,output(code));
modifyText(t,45,"DejaVuSansMono",[0,0,0]);
