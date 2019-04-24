#include "json2.js";

// get the file:
function getCode(filepath){
  var thePyFile = File(filepath);
  thePyFile.open('r');
  var contents = thePyFile.read();
  thePyFile.close();
  return contents;
}

function getExpression(points){
  var expr = "i = textIndex;\n"
  +"if(\n";
  for(var i=0;i<points.length;i++){
    expr += "("+points[i][0]+" <= i && i <= "+points[i][1]+") ||\n";
  }
  expr += "0){100}else{0}";
  return expr;
}

function addAnimatorProp(txtAnimator,animatorName,start,end,highLightingColor){

  txtAnimator.name = animatorName;

  // Modify the amount expression:
  var expressionSelector = txtAnimator.property("Selectors").addProperty("ADBE Text Selector");// Add an expression selector
  expressionSelector.name ="Rangooo";
  app.project.item(1).layer(1).property("ADBE Text Properties").property("ADBE Text Animators").property(1).property("ADBE Text Selectors").property(1).property("ADBE Text Range Advanced").property("ADBE Text Range Units").setValue(2);
  //expressionSelector.property("Advanced").property("Based On").setValue(1);
  expressionSelector.property("ADBE Text Index Start")setValue(start);
  expressionSelector.property("ADBE Text Index End").setValue(end);

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
    var str1 = "";
    while((match = patt.exec(text)) != null){
      fi = match.index;
      li = patt.lastIndex;
      tempStr = text.substring(fi,li).replace(replacepatt,"");
      points[counter] = [];
      points[counter][0] = fi;
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
  text.name = "a";
  var txtAnims = text.property("ADBE Text Properties").property(4);
  var txtAnimator = txtAnims.addProperty("ADBE Text Animator");
  var jsonObj = getSyntaxJSON();
  for(var i=0;i<jsonObj.length;i++){
    var name = jsonObj[i].name;
    var pattern = eval(jsonObj[i].pattern);
    var replacepattern = eval(jsonObj[i].replacepattern);
    var color = jsonObj[i].color;
    var points = getPoints(codeStr,pattern,replacepattern);
    //testPoints(codeStr,points);
    // alert("layer test");
    // var ttt = text.property("Text").property("Source Text").value.toString();
    // alert(typeof(ttt));
    // testPoints(ttt,points);
    // var expression = getExpression(points);
    for(var k=0;k<points.length;k++){
      addAnimatorProp(txtAnimator,name,points[i][0],points[i][1],color);
    }
  }
  return text;
}

var c = getCode("pyfile.py");
var t = codeTextLayer(c);
