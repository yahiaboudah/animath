function setTime(t,compo){
  var wasLocked = false;
  var wasLayerLocked = false;
  if(typeof compo == 'undefined'){
    compo = app.project.activeItem;
  }
  compo.duration = t;
  for(var i=1;i<compo.layers.length+1;i++){
    if(compo.layer(i).source instanceof CompItem){
      if(compo.layer(i).locked){
        compo.layer(i).locked = false;
        wasLocked = true;
      }
      setAllComps(compo.layer(i).source,t);
      compo.layer(i).outPoint = t;
      if(wasLocked){
        compo.layer(i).locked = true;
      }
    }else{
      if(compo.layer(i).locked){
        compo.layer(i).locked = false;
        wasLayerLocked = true;
      }
      compo.layer(i).outPoint = t;
      if(wasLayerLocked){
        compo.layer(i).locked = true;
      }
    }
  }
}

function changeTime(compa,time){
  app.beginUndoGroup("Comp Settin Time");
  setTime(compa,time);
  app.endUndoGroup();
}


changeTime(80);
