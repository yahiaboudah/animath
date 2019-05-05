var comp = app.project.activeItem;

SAVE_AS_FRAME_ID = 2104;
STATIC_IMAGES_PATH = "C:/Users/HP/Desktop/Banana61/00Videos/Proxies/StaticImages/";
folder = Folder(STATIC_IMAGES_PATH);
numFiles = folder.getFiles().length;
STATIC_IMAGE_PATH = STATIC_IMAGES_PATH+"staticimage"+numFiles+".png";

function getSoloLayers(){
  var comp = app.project.activeItem;
  layers = [];
  indicies = [];
  for(var i=1;i<comp.layers.length+1;i++){
    if(comp.layer(i).solo){
      layers[layers.length] = comp.layer(i);
      indicies[indicies.length] = i;
    }
  }
  if(layers.length == 0){
    return "noSolo";
  }else{
    minIndex = Math.min.apply(null,indicies);
    obj = {
      "layers":layers,
      "minIndex": minIndex
    }
    return obj;
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

function splitLayers(layers,timeInterval,compDuration){
  if(timeInterval.start == 0){
    app.beginUndoGroup("Split Layers");
    if(timeInterval.end == compDuration){
      for(var i=0;i<layers.length;i++){
        layers[i].enabled = false;
      }
    }else{
      for(var i=0;i<layers.length;i++){
      layers[i].inPoint = timeInterval.end;
      layers[i].outPoint = compDuration;
    }
  }
    app.endUndoGroup();
  }else if(timeInterval.end == compDuration){
    app.beginUndoGroup("Split Layers");
    for(var i=0;i<layers.length;i++){
      alert("Here");
    layers[i].outPoint = timeInterval.start;
    alert("Finished");
  }
    app.endUndoGroup();
  }else{
    app.beginUndoGroup("Split Layers");
    for(var i=0;i<layers.length;i++){
      leftLayer = layers[i].duplicate();
      leftLayer.outPoint = timeInterval.start;
      layers[i].inPoint = timeInterval.end;
    }

    app.endUndoGroup();
  }
}

function setResolutionToFull(compo){
  res = compo.resolutionFactor;
  compo.resolutionFactor = [1,1];
  return res;
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

function dropSnapshot(interval,index){
  var importedFile = File(STATIC_IMAGE_PATH);
  var importOptions = new ImportOptions();
  importOptions.file = importedFile;
  importOptions.importAs = ImportAsType.FOOTAGE;
  var footage = app.project.importFile(importOptions);
  var snap = comp.layers.add(footage);
  app.project.item(app.project.items.length).selected = false;
  snap.inPoint = interval.start;
  snap.outPoint = interval.end;
  snap.moveAfter(comp.layer(index));
}

function unSolo(compo){
  for(var i=1;i<compo.layers.length;i++){
    if(compo.layer(i).solo){
      compo.layer(i).solo = false;
    }
  }
}

function doAll(){
  // Get the layer:
  theLayers = getSoloLayers();
  if(theLayers == 'noSolo'){
    alert("noSolo");
  }else{
  // Get the interval:
  timeInterval = getInterval();
  // Set res, and save prev res:
  originalRes = setResolutionToFull(comp);
  // Get the Snapshot:
  getSnapshot(timeInterval.start);
  // Split the Original Layer:
  splitLayers(theLayers.layers,timeInterval,comp.duration);
  // Drop the Snapshot:
  app.beginUndoGroup("Drop Shot");
  dropSnapshot(timeInterval,theLayers.minIndex);
  app.endUndoGroup();
  // Restore prev res:
  comp.resolutionFactor = originalRes;
  // Clear the prev element:
  app.project.renderQueue.item(app.project.renderQueue.numItems).remove();
  // Unsolo everything:
  unSolo(comp);
  }
}

doAll();
