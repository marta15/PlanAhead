
function allowDrop(ev) {
    ev.preventDefault();
};
function dragStart(ev) {
    ev.dataTransfer.setData("movedId", ev.target.id);
};
function dragDrop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData("movedId");
    //ev.target.appendChild(document.getElementById(data));
    console.log("moved id: ", id);
    console.log("target: ", ev.currentTarget.id)
};
