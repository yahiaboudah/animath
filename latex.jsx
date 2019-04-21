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
  var eqStr0 = equationString.text;
  var eqStr = eqStr0.replaceAll(" ","%20");
  var url = "http://latex.codecogs.com/png.latex?\\dpi{300}%20\\huge%20"+eqStr;
  var myCommand = "cd "+"C:\\wget" + " & wget -O x.png "+ url;
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
  }
  bt.send();
}
}

win=new Window("palette","Get equation",[0,0,250,180],{resizeable:true,});
equationString=win.add("edittext",[30,50,220,100] ,"x",{readonly:0,noecho:0,borderless:0,multiline:0,enterKeySignalsOnChange:0});
getEquationButton=win.add("button",[30,113,220,162],"GET IT!");

getEquationButton.onClick = function(){
  getEquationButtonClicked();
}

win.center();
win.show();
