
var comp = app.project.activeItem;

var shape = comp.layer(1);

shape.transform.position.expression = "\
var xPosition = time*(1920/6)\
var yPosition = (-100*(Math.round(10000*Math.cos(((xPosition-960)/100))))/10000) +540;\
[xPosition,yPosition]";

shape.transform.rotation.expression = "\
 -45*Math.round(10000*-Math.sin(((transform.position[0]-960)/100)))/10000";
