function importAndDrop(comp,filePath,fileName,duplicate){
  if(!duplicate){
    var something = 0;
    var index = 0;
    for(var i=1;i<app.project.items.length+1;i++){
      if(app.project.item(i).name == fileName){
        something +=1;
        index = i;
      }
    }
  }
  if(duplicate || something == 0){
  var importedFile = new File(filePath);
  var importOptions = new ImportOptions();
  importOptions.file = importedFile;
  importOptions.importAs = ImportAsType.FOOTAGE;
  var footage = app.project.importFile(importOptions);
  var footageLayer = comp.layers.add(footage);
  app.project.item(app.project.items.length).selected = false;
  }else{
    var footage = app.project.item(index);
    var footageLayer = comp.layers.add(footage);
  }
}

function clacKnobs(comp){
  var num = 0;
  var comp = comp;
  for(var i =1;i<comp.layers.length+1;i++){
    if(comp.layer(i).name.indexOf("knob") != -1){
      num++;
    }
  }
  return num;
}

function Knob(name){

    var comp = app.project.activeItem;
    if(typeof name == 'undefined'){
      var numb = clacKnobs(comp);
      namo = "knob "+ numb;
    }else{
      namo = name;
    }
    importAndDrop(comp,"C:\\wget\\knoback.png","knoback.png",false);
    comp.layer(1).transform.scale.setValue([10,10]);
    precompDim = comp.layer(1).sourceRectAtTime(comp.time,false).width;
    comp.layer(1).transform.position.setValue([precompDim/20,precompDim/20]);
    importAndDrop(comp,"C:\\wget\\realknob.png","realknob.png",false);
    comp.layer(1).transform.scale.setValue([10,10]);
    comp.layer(1).transform.position.setValue([precompDim/20,precompDim/20]);
    comp.layer(1).transform.rotation.expression = "comp(\""+comp.name+"\").layer(\""+namo+"\").effect(\"Slider Control\")(\"Slider\")";
    var precomp = comp.layers.precompose([1,2],"knob ",true);
    precomp.width = Math.floor(precompDim/10);
    precomp.height = precomp.width;
    precomp.name = namo;
    var precompLayer = comp.selectedLayers[0];
    precompLayer.collapseTransformation = true;
    precompLayer.property("Effects").addProperty("Slider Control");
    precompLayer.transform.scale.setValue([130,130]);
    return precompLayer;
}

var k = new Knob();
