#include "json2.js";
#targetengine allPoints
slidingPoints = []

NULL_LAYER_COMMENT = "thisispointcollectionnulllayer";
DEFAULT_PATH = "C:/Users/HP/Desktop/math animation'/Scripts/SlidingPoints/";

var w = new Window ("palette","Point recorder");
var startSession = w.add("button",undefined,"Start");
var store = w.add("button",undefined,"&Store");
store.shortcutKey = "s";
var endSession = w.add("button",undefined,"End");
var slideIt = w.add("button",undefined,"Slide");
w.show();

function createNull(){
  var comp = app.project.activeItem;
  var nullLayer = comp.layers.addNull();
  nullLayer.property("Effects").addProperty("Point Control");
  nullLayer.comment = NULL_LAYER_COMMENT;
  return nullLayer;
}

function addPoint(layer,pointCollection){
  var point = layer.property("Effects").property("Point Control").property("Point");
  var lengtho = pointCollection.length;
  pointCollection[lengtho] = [];
  pointCollection[lengtho] = point.value;
}

function getNullLayer(){
  var comp = app.project.activeItem;
  for(var i=1;i<comp.layers.length;i++){
    if(comp.layer(i).comment == NULL_LAYER_COMMENT){
      return comp.layer(i);
    }
  }
}

function writeToJSON(arr,chosenName){
  if(chosenName == ""){
    chosenName = "defaultName";
  }
  var file = new File(DEFAULT_PATH+chosenName+".json");
  file.open('w');
  j = JSON.stringify(arr);
  file.write(j);
  file.close();
}

function getPoints(filepath){
  var file = File(filepath);
  file.open('r');
  var contents = file.read();
  file.close();
  var arr = JSON.parse(contents);
  return arr;
}

function makeSliding(layer,points){
  var comp = app.project.activeItem;
  var currTime = comp.time;
  var waitingTime = 2;
  var slidingTime = 1;
  layer.transform.position.setValueAtTime(currTime,points[0]);
  for(var i=1;i<points.length;i++){
    layer.transform.position.setValueAtTime(currTime+i*slidingTime,points[i]);
    layer.transform.position.setValueAtTime(currTime+i*(waitingTime+slidingTime),points[i]);
  }
}

function getMostRecent(){
  var folder = Folder(DEFAULT_PATH);
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

startSession.onClick = function(){
  var layer = createNull();
}

store.onClick = function(){
  var selLayer = app.project.activeItem.selectedLayers[0];
  if(selLayer.comment != NULL_LAYER_COMMENT){
    selLayer = getNullLayer();
  }
  addPoint(selLayer,slidingPoints);
}

endSession.onClick = function(){
  var p = prompt("Enter the name of the file:");
  writeToJSON(slidingPoints,p);
  alert("point array saved!");
  var a = getPoints(DEFAULT_PATH+p+'.json');
}

slideIt.onClick = function(){
  var most_recent = getMostRecent();
  var pathOfSlid = (new File(most_recent)).openDlg("Pick a sliding json","JSON:*.json");
  var po = getPoints(pathOfSlid);
  var sel = app.project.activeItem.selectedLayers;
  if(sel.length != 1){
    alert("Select one layer and try again!");
  }else{
    app.beginUndoGroup("Begin Sliding");
    makeSliding(sel,po);
    app.endUndoGroup();
  }
}
