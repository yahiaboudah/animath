var comp = app.project.activeItem;

app.project.renderQueue.items.add(comp);

if (app.project.renderQueue.canQueueInAME){
    app.project.renderQueue.queueInAME(true);
}
else{
    alert("Add to the render queue");
}
