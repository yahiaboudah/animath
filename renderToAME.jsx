#targetengine intervals
intervals = [];
var comp = app.project.activeItem;
SAVE_AS_FRAME_ID = 2104;
STATIC_IMAGE_PATH = "C:/Users/HP/Desktop/Banana61/00Videos/Proxies/StaticImages/";
folder = Folder(STATIC_IMAGE_PATH);
numFiles = folder.getFiles().length;
FILE_NAME = "staticimage"+numFiles;

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
    begLayer = layer.duplicate();
    begLayer.inPoint = 0;
    begLayer.outPoint = timeInterval.end;
    layer.inPoint = timeInterval.end;
    layer.outPoint = compDuration;
  }else if(timeInterval.end == compDuration){
    endLayer = layer.duplicate();
    endLayer.inPoint = timeInterval.start;
    endLayer.outPoint = compDuration;
    layer.inPoint = 0;
    layer.outPoint = timeInterval.start;
  }else{
    leftLayer = layer.duplicate();
    leftLayer.outPoint = timeInterval.start;
    layer.inPoint = timeInterval.end;
  }
}

function getSnapshot(fileName,snapTime){
  var comp = app.project.activeItem;
  comp.time = snapTime;
  app.executeCommand(SAVE_AS_FRAME_ID);
  app.project.renderQueue.showWindow(false);
  num = app.project.renderQueue.numItems;
  app.project.renderQueue.item(num).outputModule(1).applyTemplate("SnapShotSettings");
  app.project.renderQueue.item(num).outputModule(1).file = new File(STATIC_IMAGE_PATH+fileName);
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

function dropSnapshot(fileName,interval){
  var importedFile = File(STATIC_IMAGE_PATH+fileName);
  var importOptions = new ImportOptions();
  importOptions.file = importedFile;
  importOptions.importAs = ImportAsType.FOOTAGE;
  var footage = app.project.importFile(importOptions);
  var snap = comp.layers.add(footage);
  app.project.item(app.project.items.length).selected = false;
  snap.inPoint = interval.start;
  snap.outPoint = interval.end;
}

app.beginUndoGroup("Begin This");
// Get the layer:
theLayer = getSoloLayer();
// Get the interval:
timeInterval = getInterval();
// Split the Original Layer:
splitLayer(theLayer,timeInterval,comp.duration);
// Get the Shot:
clearQueue();
getSnapshot(FILE_NAME,timeInterval.start);
// Drop the Shot:
dropSnapshot(FILE_NAME,timeInterval);
clearQueue();

app.endUndoGroup();
