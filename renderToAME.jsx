#targetengine intervals
intervals = [];
var comp = app.project.activeItem;

SAVE_AS_FRAME_ID = 2104;
STATIC_IMAGES_PATH = "C:/Users/HP/Desktop/Banana61/00Videos/Proxies/StaticImages/";
folder = Folder(STATIC_IMAGES_PATH);
numFiles = folder.getFiles().length;
STATIC_IMAGE_PATH = STATIC_IMAGES_PATH+"staticimage"+numFiles+".png";

function getSoloLayer(){
  var comp = app.project.activeItem;
  for(var i=1;i<comp.layers.length+1;i++){
    if(comp.layer(i).solo){
      return comp.layer(i);
    }
  }
}

function getInterval(){
  var comp = app.project.activeItem;
  var start = comp.workAreaStart;
  var end = start + comp.workAreaDuration;
  var obj = {
    "start":start,
    "end":end
  }
  return obj;
}

function splitLayer(layer,timeInterval,compDuration){
  if(timeInterval.start == 0){
    app.beginUndoGroup("Split Layers");
    layer.inPoint = timeInterval.end;
    layer.outPoint = compDuration;
    app.endUndoGroup();
  }else if(timeInterval.end == compDuration){
    app.beginUndoGroup("Split Layers");
    layer.inPoint = 0;
    layer.outPoint = timeInterval.start;
    app.endUndoGroup();
  }else{
    app.beginUndoGroup("Split Layers");
    leftLayer = layer.duplicate();
    leftLayer.outPoint = timeInterval.start;
    layer.inPoint = timeInterval.end;
    app.endUndoGroup();
  }
}

function getSnapshot(snapTime){
  var comp = app.project.activeItem;
  comp.time = snapTime;
  app.executeCommand(SAVE_AS_FRAME_ID);
  app.project.renderQueue.showWindow(false);
  num = app.project.renderQueue.numItems;
  app.project.renderQueue.item(num).outputModule(1).applyTemplate("SnapShotSettings");
  app.project.renderQueue.item(num).outputModule(1).file = new File(STATIC_IMAGE_PATH);
  app.project.renderQueue.render();
  app.project.renderQueue.showWindow(false);
}

function addToQueue(){
  for(var i=0;i<arguments.length;i++){
    app.project.renderQueue.items.add(arguments[i]);
  }
}

function clearQueue(){
  num = app.project.renderQueue.numItems+1;
  for(var i=1;i<num;i++){
    app.project.renderQueue.item(1).remove();
  }
}

function dropSnapshot(interval){
  var importedFile = File(STATIC_IMAGE_PATH);
  var importOptions = new ImportOptions();
  importOptions.file = importedFile;
  importOptions.importAs = ImportAsType.FOOTAGE;
  var footage = app.project.importFile(importOptions);
  var snap = comp.layers.add(footage);
  app.project.item(app.project.items.length).selected = false;
  snap.inPoint = interval.start;
  snap.outPoint = interval.end;
}

// Get the layer:
theLayer = getSoloLayer();
// Get the interval:
timeInterval = getInterval();
// Get the Shot:
getSnapshot(timeInterval.start);
// Split the Original Layer:
splitLayer(theLayer,timeInterval,comp.duration);
// Drop the Shot:
app.beginUndoGroup("Drop Shot");
dropSnapshot(timeInterval);
app.endUndoGroup();
// clearQueue();
