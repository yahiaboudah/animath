#include "json2.js";

// get the file:
function getCode(filepath){
  var thePyFile = File(filepath);
  thePyFile.open('r');
  var contents = thePyFile.read();
  thePyFile.close();
  return contents;
}
// Colorize certain words:
function addColorizer(textLayer) {
        var grpTextAnimators = textLayer.property("ADBE Text Properties").property(4);
        alert(grpTextAnimators);
        var grpTextAnimator = grpTextAnimators.addProperty("ADBE Text Animator");
        grpTextAnimator.name = wordToHighlight.toUpperCase();

        /*
        var textSelector = grpTextAnimator.property(1).addProperty("ADBE Text Selector");
        textSelector.property(7).property("ADBE Text Range Units").setValue(2);
        textSelector.property("ADBE Text Index Start").expression = "var wordToHighlight = '" + wordToHighlight + "';\ntext.sourceText.indexOf(wordToHighlight)-2;";
        textSelector.property("ADBE Text Index End").expression = "var wordToHighlight = '" + wordToHighlight + "';\ntext.sourceText.indexOf(wordToHighlight) + wordToHighlight.length-2;";

        var fillPropertyGreen = grpTextAnimator.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
        fillPropertyGreen.setValue(color);
        */
}

function getAnimatorExpression(wordToHighlight,animated){

  var expr = "wordToHighlight = \""+wordToHighlight+"\";\n"
  +"src = text.sourceText;\n"
  +"words = src.replace(/^\\s+/,\"\").split(/\\s+/);\n"
  +"currWord = words[textIndex-1];\n";
  if(animated){
    expr = expr+"if(currWord == wordToHighlight){\n"
    +"indexPos =  text.animator(\"Animator 4\").selector(\"Range Selector 1\").start;\n"
    +"fIndex = src.indexOf(currWord)+currWord.length;\n"
    +"if(indexPos >= (100*fIndex/src.length)){\n"
    +"100\n"
    +"}else{\n"
    +"0\n"
    +"}\n"
    +"}else{\n"
    +"    0\n"
    +"}";
  }else{
    expr = expr + "if(currWord == wordToHighlight){\n"
    +"100}else{0}";
  }

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
  for(var i=0;i<1;i++){
    var name = jsonObj[i].name;
    var thing = jsonObj[i].thing;
    thing = eval(thing);
    var color = jsonObj[i].color;
    addAnimatorProp(text,name,thing,color);
  }
  return text;
}

var t = codeTextLayer("hello there hello me bazouka there");
// addAnimatorProp(t,"hello","hello",theColor);
// addAnimatorProp(t,"there","there",anotherColor);
