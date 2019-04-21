#include "json2.js"

FOLDER_PATH = 'C:/Users/HP/Desktop/Banana61/00Videos/';
TEMPLATE_PATH = "C:/Users/HP/Desktop/Banana61/After effects files/basic template.aep";

function getRecentFile(){
  var folder = Folder(FOLDER_PATH);
  var files = folder.getFiles("*.json");
  if(files.length == 0){
    return 0;
  }
  var mostRecent = files[0];
  if(files.length > 1){
    for(var i=1;i<files.length;i++){
      if( files[i].modified > mostRecent.modified){
        mostRecent = files[i];
    }
  }
}
  return mostRecent;
}

function getFileURI(){
  var most_recent = getRecentFile();
  if(most_recent == 0){
    alert("There are no scripts here");
  }else{
  var file = (new File(most_recent)).openDlg("Pick a script","JSON:*.json");
  return file;
  }
}

function importFile(fileToImport){
  var importedFile = new File(fileToImport);
  var importOptions = new ImportOptions();
  importOptions.file = importedFile;
  importOptions.importAs = ImportAsType.FOOTAGE;
  var footage = app.project.importFile(importOptions);
  return footage;
}

function getExpression(footageName,type){
  str = "var m = thisLayer.marker;\n"
      +"var i = m.nearestKey(time).index;\n"
      +"if(m.nearestKey(time).time>time){\n"
      +"    i--;\n"
      +"}\n"
      +"if(i<1){i = 1;}\n"
      +"var jsonObject = footage(\""+footageName+"\").sourceData;\n"
      +"jsonObject[i][\'"+type+"\'];\n"
  return str;
}

function getJsonObject(uri){
  var file = File(uri);
  file.open('r');
  var jsonStr = file.read();
  file.close();
  var jObj = JSON.parse(jsonStr);
  return jObj;
}

function createAnimationMarkers(jsonObj){
  var animationPrev = "";
  var animationNow = "";
  var count = 1;
  var t = 0;
  var comments = [];
  var times = [];
  for(var i=1;i<jsonObj.length;i++){
    animationNow = jsonObj[i]['Animation'];
    comment = "";
    if(animationNow != animationPrev){
      comment = "scene "+count;
      count++;
    }
    comments[comments.length] = comment;
    if(i == 1){
      times[times.length] = t;
    }else{
      t += jsonObj[i-1]['Duration'];
      times[times.length] = t;
    }
    animationPrev = animationNow;
}
    return [times,comments]
}

// Open the project from TEMPLATE_PATH
// -------- //
app.open(File(TEMPLATE_PATH));

// Load the JSON:
// ------------ //
var exampleJson = app.project.itemByID(37);
var fileObj = getFileURI();
exampleJson.replace(File(fileObj.absoluteURI));
exampleJson.name = fileObj.name;

// Modify source text:
// ------------ //
var infoComp = app.project.itemByID(1);
var mainComp = app.project.itemByID(23);
var animationText = infoComp.layer(1);
var talkText = infoComp.layer(2);
animationText.property("Text").property("Source Text").expression = getExpression(fileObj.name,"Animation");
talkText.property("Text").property("Source Text").expression = getExpression(fileObj.name,"Line");

// Add markers:
// ----------- //
var jsonObject = getJsonObject(fileObj.absoluteURI);
var timesAndComments = createAnimationMarkers(jsonObject);
var times = timesAndComments[0];
var comments = timesAndComments[1];

for(var i=0;i<times.length;i++){
  var talkMarker = new MarkerValue("");
  var newMarker = new MarkerValue(comments[i]);
  talkText.property("Marker").setValueAtTime(times[i],talkMarker)
  animationText.property("Marker").setValueAtTime(times[i],newMarker);
  mainComp.markerProperty.setValueAtTime(times[i],newMarker);
}

// Modify compos:
// ----------- //
var totalTime = times[times.length-1];
mainComp.duration = totalTime + 3;
infoComp.duration = totalTime + 3;
mainComp.workAreaStart = 0;
infoComp.workAreaStart = 0;
mainComp.workAreaDuration = totalTime+1;
infoComp.workAreaDuration = totalTime+1;

for(var i=1;i<infoComp.layers.length+1;i++){
  infoComp.layer(i).outPoint = infoComp.duration;
}
mainComp.layer(1).locked = false;
mainComp.layer(1).outPoint = mainComp.duration;
mainComp.layer(1).locked = true;

// Save as:
// --------------- //
var saveName = FOLDER_PATH+fileObj.name.split('.')[0]+'.aep';
app.project.save(new File(saveName));
