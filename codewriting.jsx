
// get the file:
function getCodeInFile(filepath){
  var thePyFile = File(filepath);
  thePyFile.open('r');
  var contents = thePyFile.read();
  thePyFile.close();
  return contents;
}
// Colorize certain words:
function addColorizer(textLayer, wordToHighlight, color) {
        var grpTextAnimators = textLayer.property("ADBE Text Properties").property(4);

        var grpTextAnimator = grpTextAnimators.addProperty("ADBE Text Animator");
        grpTextAnimator.name = wordToHighlight.toUpperCase();

        var textSelector = grpTextAnimator.property(1).addProperty("ADBE Text Selector");
        textSelector.property(7).property("ADBE Text Range Units").setValue(2);
        textSelector.property("ADBE Text Index Start").expression = "var wordToHighlight = '" + wordToHighlight + "';\ntext.sourceText.indexOf(wordToHighlight)-2;";
        textSelector.property("ADBE Text Index End").expression = "var wordToHighlight = '" + wordToHighlight + "';\ntext.sourceText.indexOf(wordToHighlight) + wordToHighlight.length-2;";

        var fillPropertyGreen = grpTextAnimator.property("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
        fillPropertyGreen.setValue(color);
}

function getAnimatorExpression(wordToHighlight){

  var expr = "wordToHighlight = "+wordToHighlight+";"
  "src = text.sourceText;"
  "words = src.replace(/^\\s+/,"").split(/\\s+/);"
  "currWord = words[textIndex-1];"
  "if(currWord == wordToHighlight){"
  "indexPos =  text.animator(\"Animator 4\").selector(\"Range Selector 1\").start;"
  "fIndex = src.indexOf(currWord)+currWord.length;"
  "if(indexPos >= (100*fIndex/src.length)){"
  "100"
  "}else{"
  "0"
  "}"
  "}else{"
  "    0"
  "}";

  return expr;

}

var code = getCodeInFile("pyfile.py");
var txt = app.project.activeItem.layers.addText(code);
addColorizer(txt,"def",[212,4,78]/255);
addColorizer(txt,"return",[4,255,134]/255);
addColorizer(txt,"print",[4,255,134]/255);
