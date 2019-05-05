// The work area is the time interval

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
    layers[i].outPoint = timeInterval.start;
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
  if(comp.layers.length > 1){
    snap.moveAfter(comp.layer(index+1));
  }
  return snap;
}

function parentSnap(snap,origLayer,startTime){
  for(var i=1;i<snap.transform.numProperties+1;i++){
    if(snap.transform.property(i).canSetExpression){
      initVal = origLayer.transform.property(i).valueAtTime(startTime,true);
      propName = snap.transform.property(i).name;
      if(propName == "Scale"){
        propExpression = "arr = thisProperty.value;\notherArr = thisComp.layer(\""+origLayer.name+"\").transform(\""+propName+"\");\n[arr[0]*(otherArr[0]/"+initVal[0]+"),arr[1]*(otherArr[1]/"+initVal[1]+")]";
        snap.transform.property(i).expression = propExpression;
        continue;
      }
      if(initVal instanceof Array){
        propExpression = "arr = thisProperty.value;\notherArr = thisComp.layer(\""+origLayer.name+"\").transform(\""+propName+"\");\n[arr[0]+otherArr[0]-"+initVal[0]+",arr[1]+otherArr[1]-"+initVal[1]+"]";
      }else{
        propExpression = "val = thisProperty.value;\n otherVal = thisComp.layer(\""+origLayer.name+"\").transform(\""+propName+"\");\n finalVal = val + otherVal - "+initVal+";\nfinalVal";
      }
      snap.transform.property(i).expression = propExpression;
    }
  }
}

function unSolo(compo){
  for(var i=1;i<compo.layers.length;i++){
    if(compo.layer(i).solo){
      compo.layer(i).solo = false;
    }
  }
}

function doAll(){
  if(!comp || !(comp instanceof CompItem)){
    alert("Select a comp");
    return;
  }
  // Get the layer:
  theLayers = getSoloLayers();
  if(theLayers == 'noSolo'){
    alert("noSolo");
  }else{
  // Get the interval:
  timeInterval = getInterval();
  alert(timeInterval.start);
  alert(timeInterval.end);
  // Set res, and save prev res:
  originalRes = setResolutionToFull(comp);
  // Get the Snapshot:
  getSnapshot(timeInterval.start);
  // Drop the Snapshot:
  app.beginUndoGroup("Drop Shot");
  theSnap = dropSnapshot(timeInterval,theLayers.minIndex);
  if(theLayers.layers.length == 1){
    parentSnap(theSnap,theLayers.layers[0],timeInterval.start);
  }
  app.endUndoGroup();
  // Split the Original Layer:
  // splitLayers(theLayers.layers,timeInterval,comp.duration);
  // Restore prev res:
  comp.resolutionFactor = originalRes;
  // Clear the prev element:
  app.project.renderQueue.item(app.project.renderQueue.numItems).remove();
  // Unsolo everything:
  unSolo(comp);
  }
}

doAll();
