function theFunction(x){
    return 1/(1+Math.exp(-x));
}
var basis = 333.5;
var x = thisLayer.transform.position[0];
var otherX = (thisComp.layer("circle x").transform.position[0]-960)/basis;
var y = 540 - theFunction(otherX)*basis;

[x,y];
