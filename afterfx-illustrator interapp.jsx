function stringifyFunction(fn){
  var funcString = eval(fn);
  var args = "(";
  for(var i=1;i<arguments.length;i++){
    args += arguments[i]+",";
  }
  if(arguments.length > 1){
    args = args.slice(0,-1);
    args += ");\n";
  }
  else{
    args+=");\n";
  }
  functionString = fn + args + funcString.toString();
  return functionString;
}

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

var editEquationIllustrator0 = stringifyFunction("editEquation");
